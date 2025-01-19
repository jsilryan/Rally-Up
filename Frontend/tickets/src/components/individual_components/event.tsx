import { useParams, useNavigate } from 'react-router-dom';
import { CustomEvent, serverLink } from '../../constants';
import { IoMdArrowRoundBack, IoMdAddCircle, IoMdRemoveCircle } from 'react-icons/io';
import { FaShoppingCart,FaTrashAlt } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useCart } from '../Constants/CartContext';
import { eventFromServer, convertIndividualEventData } from '../../constants';
import fetchWithAuth from './fetchWithAuth';

interface eventProps {
  setUpdateEvent: React.Dispatch<React.SetStateAction<CustomEvent | null>>;
  setUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  events: CustomEvent[];
  myEvents: CustomEvent[]; 
  update: boolean;
}

const EventDetails = ({ events, myEvents, update, setUpdate, setUpdateEvent }: eventProps) => {
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();
  const event = events.find((e) => e.link.includes(eventId as string));
  const [myEvent, setMyEvent] = useState(false)

  if (!event) {
    useEffect(() => {
      navigate('/');
    }, [navigate]);
    return null;
  }

  const id = event.id;
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const [currentEvent, setCurrentEvent] = useState<CustomEvent>();
  const [loading, setLoading] = useState(true); // New state for loading
  const [popup, setPopup] = useState(false)

  useEffect(() => {
    const url = `${serverLink}/events/${id}`;
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((data: eventFromServer) => {
        const customEvent = convertIndividualEventData(data);
        setCurrentEvent(customEvent);
        setLoading(false); // Data is loaded
      })
      .catch((err) => {
        console.log(err);
        setLoading(false); // Stop loading even on error
      });
  }, [id]);

  useEffect(() => {
    console.log("My Events:", myEvents)
    if (event) {
      const isMyEvent = myEvents.some((myEvent) => myEvent.id === event.id);
      setMyEvent(isMyEvent);
    }
  }, [event, myEvents]);


  const { cart, updateCart } = useCart();

  const addToCart = (ticketType: string, ticketPrice: number, link: string) => {
    const existingEvent = cart.find((item) => String(item.eventId) === String(event.id));
    let newCart = existingEvent ? { ...existingEvent } : { eventId: event.id, tickets: {}, link: link };

    if (!newCart.tickets) {
      newCart.tickets = {};
    }

    if (newCart.tickets[ticketType]) {
      newCart.tickets[ticketType].count += 1;
    } else {
      newCart.tickets[ticketType] = { count: 1, price: ticketPrice };
    }

    if (!newCart.link) {
      newCart.link = link
    }

    updateCart(newCart);
  };

  const removeFromCart = (ticketType: string) => {
    const existingEvent = cart.find((item) => String(item.eventId) === String(event.id));
    
    if (existingEvent && existingEvent.tickets[ticketType]?.count > 0) {
      const updatedCart = { ...existingEvent };

      if (updatedCart.tickets) {
        updatedCart.tickets[ticketType].count -= 1;
        if (updatedCart.tickets[ticketType].count === 0) {
          delete updatedCart.tickets[ticketType];
          updatedCart.eventId = ""
          updatedCart.link == ""
        }
        updateCart(updatedCart);
      }
    }
  };

  const totalPrice = cart.reduce((total, item) => {
    const ticketValues = Object.values(item.tickets || {});
    return total + ticketValues.reduce((subTotal, ticket) => subTotal + ticket.count * ticket.price, 0);
  }, 0);

  console.log("Event Cart:", cart)

  const ChangePopup = () => {
    setPopup(!popup)
  }

  const DeleteEvent = () => {
    const body = {
      event_id : id
    }
    console.log("Delete Body:", body)
    const url = `${serverLink}/delete_event?event_id=${id}`
    const options = {
      method: "DELETE",
      headers: { 
        "Content-Type": "application/json" ,
      }
    }
    fetchWithAuth(url, options)
    .then((res) => {
      console.log('Status:', res.status, res.statusText);
      if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.text(); // Read response as text
    })

    setPopup(false)
    navigate("/myevents")
  }

  function UpdateFunc() {
    if (currentEvent) {
      console.log("Event on Event Page Details:", currentEvent)
      setUpdate(true)
      localStorage.setItem("update", JSON.stringify(update));
      setUpdateEvent(currentEvent)
      localStorage.setItem("updateEvent", JSON.stringify(currentEvent));
      navigate("/create-event")
    }
    else {
      alert("Waiting for event to load.")
    }
  }

  return (
    <div className="flex justify-center items-start pt-28 transition-opacity ease-in duration-700">
      <div className="xl:max-w-[1280px] w-full px-6">
        <div className={`flex items-center ${myEvent && 'sm:justify-between sm:flex-row flex-col'}`}>
          <div className="flex space-x-2 cursor-pointer mb-4" onClick={() => navigate(-1)}>
            <IoMdArrowRoundBack className="text-2xl hover:text-[#e06c7d] text-secondary transition-colors duration-300" />
            <span className="text-secondary_dark font-semibold text-md">Back</span>
          </div>
          {
            myEvent &&
            <div className="grid grid-cols-2 items-center xs:gap-4 gap-1">
              <div className="flex justify-start">
                <FaTrashAlt 
                  className="cursor-pointer text-red-600 hover:text-red-800 text-3xl sm:text-4xl" 
                  onClick={ChangePopup} 
                  title="Delete Event" 
                />
              </div>
              <div className="flex justify-end">
                <button 
                  className="cursor-pointer bg-secondary_dark hover:bg-secondary_dark_hover rounded-md p-3"
                  onClick={UpdateFunc}
                >
                  <span className="text-white font-semibold text-sm sm:text-base">Update Event</span>
                </button>
              </div>
            </div>

          }
        </div>

        <h1 className="text-4xl font-bold text-secondary mb-4">{event.name}</h1>
        <img src={event.bannerPic} alt={event.name} className="w-full h-[500px] object-cover rounded-lg shadow-md mb-6" />

        <div className="bg-white shadow-lg rounded-lg p-6 m-4 hover:shadow-2xl transition-shadow duration-300">
          <p className="text-secondary_dark mb-6 text-lg">{currentEvent && currentEvent.description}</p>
          
          <div className="mb-4 space-y-2">
            <p className="font-semibold text-gray-700">
              <span className="text-gray-900">Location:</span> {event.location}
            </p>
            <p className="font-semibold text-gray-700">
              <span className="text-gray-900">Start Date:</span> {new Date(event.startDate).toLocaleDateString()} at {event.startTime}
            </p>
            <p className="font-semibold text-gray-700">
              <span className="text-gray-900">End Date:</span> {new Date(event.endDate).toLocaleDateString()} at {event.endTime}
            </p>
          </div>

          {loading ? (
            <p className="text-gray-500 mt-6 text-center">Loading tickets...</p> // Loading indicator
          ) : (
            currentEvent &&
            currentEvent.tickets.map((ticket) => {
              const existingEvent = cart.find((item) => String(item.eventId) === String(event.id));
              return (
                <div 
                  key={ticket.name} 
                  className="flex items-center justify-between mt-4 border-b border-gray-200 pb-4"
                >
                  <span className="text-gray-700 font-medium">
                    {ticket.name} - {ticket.price > 0 ? <span>Kshs. {ticket.price}</span> : <span>Free</span>}
                  </span>
                  {
                    !myEvent &&
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => addToCart(ticket.name, ticket.price, currentEvent.link)} 
                        className="text-green-500 hover:text-green-700 transition"
                      >
                        <IoMdAddCircle className="text-2xl" />
                      </button>
                      <span className="text-gray-700 font-semibold">{existingEvent?.tickets[ticket.name]?.count || 0}</span>
                      <button 
                        onClick={() => removeFromCart(ticket.name)} 
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <IoMdRemoveCircle className="text-2xl" />
                      </button>
                  </div>
                  }
                </div>
              );
            })
          )}

          <div className="flex items-center mt-8 space-x-3">
            <FaShoppingCart className="text-2xl text-secondary" />
            <span className="font-semibold text-xl text-gray-900">Cart Total: Kshs. {totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {
          popup && 
          (
            <div className="popup-container absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="popup bg-white p-6 rounded-lg shadow-lg w-96 text-center">
                {/* Popup Message */}
                <h3 className="text-xl font-semibold mb-4">Do you want to delete the event?</h3>
                
                {/* Buttons */}
                <div className="flex justify-around mt-4">
                  <button 
                    className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 focus:outline-none"
                    onClick={DeleteEvent} // Replace this with your delete logic
                  >
                    Delete Event
                  </button>
                  <button 
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg shadow hover:bg-gray-400 focus:outline-none"
                    onClick={ChangePopup} // Replace this with your cancel logic
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default EventDetails;
