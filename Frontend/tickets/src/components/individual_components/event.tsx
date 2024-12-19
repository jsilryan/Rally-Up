import { useParams, useNavigate } from 'react-router-dom';
import { CustomEvent } from '../../constants';
import { IoMdArrowRoundBack, IoMdAddCircle, IoMdRemoveCircle } from 'react-icons/io';
import { FaShoppingCart } from 'react-icons/fa';
import { useState } from 'react';
import { useCart } from '../Constants/CartContext';

const EventDetails: React.FC<{ events: CustomEvent[] }> = ({ events }) => {
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();
  const event = events.find((e) => e.link.includes(eventId as string));
  const { cart, updateCart } = useCart(); // Use CartContext's values
  
  if (!event) return <p>Event not found</p>;

  const addToCart = (ticketType: string, ticketPrice: number) => {
    const existingEvent = cart.find((item) => String(item.eventId) === String(event.id));
    let newCart = existingEvent ? { ...existingEvent } : { eventId: event.id, tickets: {} };

    // Ensure tickets exist
    if (!newCart.tickets) {
      newCart.tickets = {};  // Initialize tickets if undefined
    }

    // If the ticketType exists, increment the count, otherwise create a new entry
    if (newCart.tickets[ticketType]) {
      newCart.tickets[ticketType].count += 1;
    } else {
      newCart.tickets[ticketType] = { count: 1, price: ticketPrice };
    }

    updateCart(newCart);  // Update the global cart
  };

  const removeFromCart = (ticketType: string) => {
    const existingEvent = cart.find((item) => String(item.eventId) === String(event.id));
    if (existingEvent && existingEvent.tickets[ticketType]?.count > 0) {
      const updatedCart = { ...existingEvent };

      // Ensure tickets exist on updatedCart
      if (updatedCart.tickets) {
        updatedCart.tickets[ticketType].count -= 1;

        // If the count is 0, remove the ticket
        if (updatedCart.tickets[ticketType].count === 0) {
          delete updatedCart.tickets[ticketType];
        }

        updateCart(updatedCart);  // Update the global cart
      }
    }
  };

  const totalPrice = cart.reduce((total, item) => {
    const ticketValues = Object.values(item.tickets || {});
    return total + ticketValues.reduce((subTotal, ticket) => subTotal + ticket.count * ticket.price, 0);
  }, 0);

  return (
    <div className="flex justify-center items-start pt-28 transition-opacity ease-in duration-700">
      <div className="xl:max-w-[1280px] w-full px-6">
        <div className="flex items-center space-x-2 cursor-pointer mb-4" onClick={() => navigate(-1)}>
          <IoMdArrowRoundBack className="text-2xl hover:text-[#e06c7d] text-secondary transition-colors duration-300" />
          <span className="text-secondary_dark font-semibold text-md">Back</span>
        </div>

        <h1 className="text-4xl font-bold text-secondary mb-4">{event.name}</h1>
        <img src={event.bannerPic} alt={event.name} className="w-full h-[500px] object-cover rounded-lg shadow-md mb-6" />

        <div className="bg-white shadow-xl rounded-lg p-4 m-4">
          <p className="text-secondary_dark mb-4">{event.description}</p>
          <p className="font-semibold">Location: {event.location}</p>
          <p className="font-semibold">Date: {new Date(event.date).toLocaleDateString()} at {event.time}</p>

          {event.tickets.map((ticket) => {
            // Find the current event in the cart
            const existingEvent = cart.find((item) => String(item.eventId) === String(event.id));

            return (
              <div key={ticket.name} className="flex items-center justify-between mt-4">
                <span>{ticket.name} - Kshs. {ticket.price}</span>
                <div className="flex items-center space-x-2">
                  <button onClick={() => addToCart(ticket.name, ticket.price)} className="text-green-500">
                    <IoMdAddCircle className="text-xl" />
                  </button>
                  <span>{existingEvent?.tickets[ticket.name]?.count || 0}</span>
                  <button onClick={() => removeFromCart(ticket.name)} className="text-red-500">
                    <IoMdRemoveCircle className="text-xl" />
                  </button>
                </div>
              </div>
            );
          })}

          <div className="flex items-center mt-8 space-x-2">
            <FaShoppingCart className="text-2xl text-secondary" />
            <span className="font-semibold text-lg">Cart: Kshs. {totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
