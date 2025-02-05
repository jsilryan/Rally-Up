import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CustomEvent, eventFromServer, convertEventData, serverLink } from "../../constants";
import Events from "../Home/events";
import { isAuthenticated } from '../individual_components/auth';
import fetchWithAuth from '../individual_components/fetchWithAuth';

interface MyEventsProps {
  setMyEvents: React.Dispatch<React.SetStateAction<CustomEvent[]>>;
  eventChange: boolean;
}

export default function MyEvents({ setMyEvents, eventChange }: MyEventsProps) {
  const [events, setEvents] = useState<CustomEvent[]>([])
  const [noData, setNoData] = useState<boolean>(false)
  useEffect (() => {
    const fetchMyEvents = async () => {
      if (isAuthenticated()) {
        const url_my_events = `${serverLink}/my_events`;
        const requestOptions_my_events = {
          method: "GET",
          headers: {
            "Content-Type": "application/json", 
          },
        };
        let retryCount = 0;
  
        while (retryCount < 5) { // Retry up to 5 times
          try {
            const response = await fetchWithAuth(url_my_events, requestOptions_my_events);
  
            if (!response.ok) {
              throw new Error(`Error: ${response.status}`);
            }
  
            const data: eventFromServer[] = await response.json();
            console.log("My Events Data:", data);
  
            const customEvents = convertEventData(data);
            const currentCustomEvents = customEvents.filter((event) => {
              const eventDate = new Date(event.startDate); // Convert event start date to a Date object
              const today = new Date(); // Get today's date
              today.setHours(0, 0, 0, 0); // Normalize to midnight for accurate comparison
              return eventDate >= today; // Include events from today or later
            });
            setEvents(currentCustomEvents);
            setMyEvents(currentCustomEvents)
            setNoData(true)
            break; // Exit loop on success
          } catch (err) {
            console.log("Retry fetching my events:", err);
            retryCount++;
            await new Promise((resolve) => setTimeout(resolve, 3000)); // Delay before retry
          }
        }
      }
    };
    if (events.length <= 0) {
      fetchMyEvents();
    }
  }, [eventChange])
     
  
  const [loading, setLoading] = useState(true); // New loading state
  const navigate = useNavigate();

  const handleCreateEvent = () => {
    navigate("/create-event");
  };

  useEffect(() => {
    if (events.length > 0 || noData) {
      setLoading(false)
    }
  }, [events]);

  const showLocation = false;

  return (
    <div className="pt-28 events-container p-6 min-h-screen bg-gray-100 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">My Events</h1>
      {loading ? (
        // Loading placeholder
        <div className="py-8 grid grid-cols-1 ss:grid-cols-2 md:grid-cols-3 gap-6 w-full">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="bg-gray-300 animate-pulse h-48 rounded-lg"
            ></div>
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="no-events text-center">
          <p className="text-gray-600 mb-4">You have no events</p>
          <button
            onClick={handleCreateEvent}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create New Event
          </button>
        </div>
      ) : (
        <div className="flex justify-center items-start transition-opacity ease-in duration-700">
          <div className="xl:max-w-[1280px] w-full relative">
            <Events events={events} showLocation={showLocation} />
          </div>
        </div>
      )}
    </div>
  );
}
