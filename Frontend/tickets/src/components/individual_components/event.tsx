import { useParams, useNavigate } from 'react-router-dom';
import { CustomEvent } from '../../constants';
import { IoMdArrowRoundBack, IoMdAddCircle, IoMdRemoveCircle } from 'react-icons/io';
import { FaShoppingCart } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useCart } from '../Constants/CartContext';
import { eventFromServer, convertIndividualEventData } from '../../constants';

const EventDetails: React.FC<{ events: CustomEvent[] }> = ({ events }) => {
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();
  const event = events.find((e) => e.link.includes(eventId as string));

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

  useEffect(() => {
    const url = `http://localhost:8080/events/${id}`;
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

  const { cart, updateCart } = useCart();

  const addToCart = (ticketType: string, ticketPrice: number) => {
    const existingEvent = cart.find((item) => String(item.eventId) === String(event.id));
    let newCart = existingEvent ? { ...existingEvent } : { eventId: event.id, tickets: {} };

    if (!newCart.tickets) {
      newCart.tickets = {};
    }

    if (newCart.tickets[ticketType]) {
      newCart.tickets[ticketType].count += 1;
    } else {
      newCart.tickets[ticketType] = { count: 1, price: ticketPrice };
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
        }

        updateCart(updatedCart);
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
          <p className="font-semibold">
            Start Date: {new Date(event.startDate).toLocaleDateString()} at {event.startTime}
          </p>
          <p className="font-semibold">
            End Date: {new Date(event.endDate).toLocaleDateString()} at {event.endTime}
          </p>

          {loading ? (
            <p className="text-gray-500 mt-4">Loading tickets...</p> // Loading indicator
          ) : (
            currentEvent &&
            currentEvent.tickets.map((ticket) => {
              const existingEvent = cart.find((item) => String(item.eventId) === String(event.id));
              return (
                <div key={ticket.name} className="flex items-center justify-between mt-4">
                  <span>
                    {ticket.name} - {ticket.price > 0 ? <span>Kshs. {ticket.price}</span> : <span>Free</span>}
                  </span>
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
            })
          )}

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
