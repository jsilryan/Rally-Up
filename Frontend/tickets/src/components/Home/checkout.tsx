import React, { useState, useEffect } from 'react';
import { useCart, CartItem } from '../Constants/CartContext';
import { CustomEvent, serverLink, mpesaServer, mpesaData } from "../../constants";
import { Link } from 'react-router-dom';

interface Props {
    events: CustomEvent[]
}

const Checkout: React.FC<Props> = ({events}) => {
  const { cart, clearCart } = useCart();
  const [showMpesaInput, setShowMpesaInput] = useState(false);
  const [personalData, setPersonalData] = useState({
    phoneNumber: "",
    email: ""
  })
  const [isValidNumber, setIsValidNumber] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [submitPressed, setPressed] = useState(false)

  console.log("Cart:", cart)

  // Function to calculate the total price
  const totalPrice = cart.reduce((total, item) => {
    const ticketValues = Object.values(item.tickets || {});
    return total + ticketValues.reduce((subTotal, ticket) => subTotal + ticket.count * ticket.price, 0);
  }, 0);

 
  // Function to handle phone number input change
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const isValid = /^[17]\d{8}$/.test(value); // Validate phone number
    setPersonalData((prev) => ({
      ...prev,
      phoneNumber: value,
    }));
    setIsValidNumber(isValid);
  };

  // Function to handle email input change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); // Basic email validation
    setPersonalData((prev) => ({
      ...prev,
      email: value,
    }));
    setIsValidEmail(isValid);
  };

  const mpesaTransaction = async () => {
    const mpesaBody = {
      LNM_PHONE_NUMBER: '0'+personalData.phoneNumber,
      total_amount: totalPrice > 5 ? 1 : totalPrice
    }
    console.log("Mpesa Body", mpesaBody)
    const mpesaUrl = `${mpesaServer}/stk_push/callback/`
    const mpesaOptions = {
      method: "POST",
      headers: { 
        "Content-Type": "application/json" ,
      },
      body: JSON.stringify(mpesaBody),
    }

    const response = await fetch(mpesaUrl, mpesaOptions)
    
    if (!response.ok) {
      alert("Error with MPesa transaction, please try again.")
      setPressed(false)
      throw new Error(`Error: ${response.status}`);
    }
    const data: mpesaData = await response.json();
    console.log("MPesa Response:", data);

    return data.status
  }

  const handlePurchase = () => {
    if (submitPressed === true) {
      alert("Wait for response before trying again.")
      return
    }

    setPressed(true)

    // Convert the cart format
    const newCartEvents = cart.map(event => {
      const { eventId, tickets } = event;

      // Convert tickets from object to array
      const formattedTickets = Object.entries(tickets).map(([type, details]) => ({
        type,
        quantity: details.count,
        price: details.price
      }));

      return {
        eventID: eventId,
        tickets: formattedTickets
      };
    });

    const body = {
      cartEvents: newCartEvents,
      total: totalPrice,
      email: personalData.email,
      phone: personalData.phoneNumber
    }

    console.log("Checkout body:", body)

    if (isValidNumber && isValidEmail) {
      mpesaTransaction()
      .then ((mpesaStatus) => {
        if (mpesaStatus === "success") {
          const url = `${serverLink}/generate_ticket` 
          const options = {
            method: "POST",
            headers: { 
              "Content-Type": "application/json" ,
            },
            body: JSON.stringify(body),
          }
          console.log(url, options)
    
          fetch(url, options)
            .then((res) => {
              console.log('Status:', res.status, res.statusText);
              if (!res.ok) {
                setPressed(false)
                throw new Error(`HTTP error! Status: ${res.status}`);
              }
              return res.text(); // Read response as text
            })
            .then((data) => {
              console.log("Response from server:", data);
              // Reset form fields
              setPersonalData({
                phoneNumber: "",
                email: ""
              })
              alert('Thank you for your purchase. Check your email for the tickets.');
              // Payment logic
              console.log(cart)
              clearCart()
              setPressed(false)    
            })
            .catch((error) => {
              console.error(`Error purchasing tickets:`, error);
              setPressed(false)
              alert(`Failed to purchase tickets, please retry.`);
            }); 
            // alert('Thank you for your purchase. Check your email for the tickets.');
            // clearCart()
            // setPressed(false)
        }
        else {
          alert("Issue with MPesa transaction, please try again.")
          setPressed(false)
        }  
      })
    }
    else {
      alert("Confirm phone number and email details.")
      setPressed(false)
    }
  };

  useEffect (() => {
    const isCartEmpty = cart.length === 0 || cart.every((item) => Object.keys(item.tickets).length === 0);
    if (isCartEmpty) {
      clearCart(); // Optional: Clear the cart if needed
      console.log("No items in the cart.");
    } 
  }, [])


  return (
    <div className="flex justify-center items-start pt-28 transition-opacity ease-in duration-700">
      <div className="xl:max-w-[1280px] w-full px-6">
        <h1 className="text-4xl font-bold text-secondary mb-8">Checkout</h1>

        {cart.length === 0 ? (
          <p className="text-secondary_dark">Your cart is empty</p>
        ) : (
          <div className="bg-white shadow-xl rounded-lg p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-secondary mb-4">Order Summary</h2>
              {
                cart.map((item: CartItem) => {
                // Find the event by eventId from the events array
                const event = events.find((event) => event.id === item.eventId);

                return (
                    <div key={item.eventId} className="mb-4">
                        {/* Use event?.name to display the event name if found */}
                        <Link to={`/events/${item.link.split('/').pop()}`}>
                          <h3 className="font-bold text-lg text-secondary_dark hover:cursor-pointer">{event?.name || 'Event Name Not Found'}</h3>
                        </Link>
                        
                        {Object.entries(item.tickets).map(([type, details]) => (
                            <div key={type} className="flex xxs:justify-between xxs:flex-row flex-col text-secondary_dark mb-2">
                                <span className = "font-semibold">
                                    {type} x {details.count}
                                </span>
                                <span>Kshs. {(details.count * details.price).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                );
                })
            }

              <div className="border-t pt-4 mt-4 flex xxs:justify-between xxs:flex-row flex-col text-lg font-bold">
                <span>Total</span>
                <span>Kshs. {totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex xs:items-center xxs:flex-row flex-col xxs:space-x-4 mt-4">
              <button
                onClick={() => setShowMpesaInput(true)}
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg"
              >
                Pay with M-Pesa
              </button>
              <button className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg xxs:mt-0 mt-4">
                Pay with Card
              </button>
            </div>

            {showMpesaInput && (
              <div className="mt-6 border-t pt-4">
                <h3 className="text-xl font-semibold text-secondary mb-4">M-Pesa Payment</h3>
                
                {/* Phone Number Input */}
                <div className="flex items-center space-x-2 mb-4">
                  <span className="font-semibold text-lg">+254</span>
                  <input
                    type="tel"
                    value={personalData.phoneNumber}
                    onChange={handlePhoneNumberChange}
                    placeholder="712345678"
                    maxLength={9}
                    className="border border-gray-300 rounded-md p-2 w-48 focus:outline-none focus:border-secondary"
                  />
                </div>
                {!isValidNumber && personalData.phoneNumber.length > 0 && (
                  <p className="text-red-500">
                    Please enter a valid phone number starting with 1 or 7 (9 digits total).
                  </p>
                )}

                {/* Email Input */}
                <div className="mb-4">
                  <input
                    type="email"
                    value={personalData.email}
                    onChange={handleEmailChange}
                    placeholder="Enter your email"
                    className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:border-secondary"
                  />
                </div>
                {!isValidEmail && personalData.email.length > 0 && (
                  <p className="text-red-500">Please enter a valid email address.</p>
                )}

                {/* Purchase Button */}
                <button
                  onClick={handlePurchase}
                  disabled={!isValidNumber || !isValidEmail}
                  className={`mt-4 py-2 px-6 rounded-lg ${
                    isValidNumber && isValidEmail ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Purchase
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Checkout;