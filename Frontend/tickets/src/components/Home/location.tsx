import React, { useState, useEffect, useMemo } from "react";
import { CustomEvent, events } from "../../constants";
import { Link } from "react-router-dom";

interface LocProps {
  allEvents: CustomEvent[]
}

export default function Location({allEvents}: LocProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Function to get unique latest events by city and limit to 5
  const filteredEvents = useMemo(() => {
    const latestEventsByCity: Record<string, CustomEvent> = {};

    // Sort events by date descending
    const sortedEvents = [...allEvents].sort(
      (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );

    // Store the latest event for each city
    sortedEvents.forEach((event) => {
      if (!latestEventsByCity[event.location]) {
        latestEventsByCity[event.location] = event;
      }
    });

    // Get a random selection of up to 5 cities
    const uniqueEvents = Object.values(latestEventsByCity);
    const randomEvents = uniqueEvents
      .sort(() => Math.random() - 0.5) // Shuffle array randomly
      .slice(0, 5); // Take only the first 5

    return randomEvents;
  }, []);

  // Auto-slide functionality to shift events every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredEvents.length);
    }, 7000); // 7-second interval

    return () => clearInterval(interval); // Clean up on component unmount
  }, [filteredEvents.length]);

  return (
    <div className="relative md:h-[550px] h-[500px] overflow-hidden p-8 sm:m-16 md:mt-16 lg:mt-12 sm:mt-12 m-4 mt-8">
      {filteredEvents.map((event, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="relative flex items-center justify-end h-full rounded-3xl overflow-hidden shadow-2xl">
            {/* Right Image Section with Smooth Transition */}
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-1000 rounded-3xl"
              style={{
                backgroundImage: `url(${event.bannerPic})`,
                padding: "20px",
              }}
            />

            {/* Left Blurred Overlay with Smooth Transition */}
            <div
              className="absolute inset-y-0 left-0 w-full sm:w-1/2 lg:w-1/3 bg-black/30 sm:backdrop-blur-md bg-black/30 backdrop-blur-sm transition-all duration-700 ease-in-out hover:backdrop-blur-2xl hover:bg-black/80 p-10 sm:rounded-none rounded-3xl"
              style={{ transform: "translateX(0%)" }}
            >
              {/* Event Details */}
              <div className="flex flex-col items-start justify-center h-full text-left space-y-4 pl-6 md:pl-10">
                <h2 className="text-3xl md:text-4xl  font-bold text-white mb-2">
                  Latest in {event.location}
                </h2>
                <h3 className="text-xl md:text-2xl font-semibold text-white">
                  {event.name}
                </h3>
                {event.description && (
                  <div>
                    <p className="text-md md:text-lg text-gray-200 mb-2 xs:block hidden">
                      {event.description}
                    </p>
                    <p className="text-md md:text-lg text-gray-200 mb-2 xs:hidden block">
                      {event.description.length > 50
                        ? `${event.description.substring(0, 100)}...`
                        : event.description}
                    </p>
                  </div>
                )}
                {/* <span className="text-lg md:text-xl text-[#e06c7d]">
                  {event.tickets[0].price > 0 ? `Kshs. ${event.tickets[0].price}` : "Free"}
                </span> */}

                {/* Button for viewing or purchasing ticket */}
                <Link to={`/events/${event.link.split('/').pop()}`}>
                  <button
                    className="mt-4 px-6 py-2 bg-secondary text-white rounded-xl hover:bg-[#e06c7d] transition-all duration-300"
                  >
                    Purchase Ticket
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
