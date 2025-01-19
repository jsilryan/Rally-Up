import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import fetchWithAuth from "../individual_components/fetchWithAuth";
import { eventFromServer } from "../../constants";
import { CustomEvent } from "../../constants";
import { convertEventData } from "../../constants";
import Events from "../Home/events";

interface MyEventsProps {
  events: CustomEvent[]
}

export default function MyEvents({ events }: MyEventsProps) {
  
  const [loading, setLoading] = useState(true); // New loading state
  const navigate = useNavigate();

  const handleCreateEvent = () => {
    navigate("/create-event");
  };

  useEffect(() => {
    if (events.length > 0) {
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
