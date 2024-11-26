import React, { useState, useMemo, useEffect } from "react";
import { CustomEvent } from "../../constants";
import { MdNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
import { Link } from "react-router-dom";

interface EventsProps {
  events: CustomEvent[]; // Accept events as a prop
  showLocation: boolean;
  searchQuery?: string; // Assuming you pass the search query as a prop
}

const Events: React.FC<EventsProps> = ({ events, showLocation, searchQuery }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const eventsPerPage = 6;

  // Filter events based on the search query and location
  const filteredEvents = useMemo(() => {
    // Filter events by searchQuery and showLocation flag
    let filtered = events;
    if (searchQuery) {
      filtered = filtered.filter((event) =>
        event.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (!showLocation) {
      filtered = filtered.map((event) => ({ ...event }));
    }
    return filtered;
  }, [events, showLocation, searchQuery]);

  // Calculate total pages based on the number of filtered events
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  // Memoized list of paginated events
  const paginatedEvents = useMemo(() => {
    const startIndex = currentPage * eventsPerPage;
    return filteredEvents.slice(startIndex, startIndex + eventsPerPage);
  }, [currentPage, filteredEvents]);

  // Ensure the current page is reset to 0 when filtered events change
  useEffect(() => {
    setCurrentPage(0); // Reset to the first page whenever filtered events change
  }, [filteredEvents]);

  // Navigate to the next set of events
  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // Navigate to the previous set of events
  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className={`p-4`}>
      {/* Events Grid */}
      <div className="grid grid-cols-1 ss:grid-cols-2 md:grid-cols-3 gap-6">
        {paginatedEvents.length === 0 ? (
          <p className="col-span-3 text-center text-gray-500">No events found</p>
        ) : (
          paginatedEvents.map((event) => (
            <Link to={`/events/${event.link.split('/').pop()}`}>
              <div
                key={event.id}
                className="hover:cursor-pointer bg-white shadow-md rounded-lg overflow-hidden transform transition duration-500 hover:scale-105"
              >
                <img
                  src={event.cover_image}
                  alt={event.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {event.name}
                  </h3>
                  <p className="text-gray-600">
                    {event.city}, {event.country}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {new Date(event.date).toLocaleDateString()} at {event.time}
                  </p>
                  {/* <p className="text-secondary font-bold mt-2">{event.pricing}</p> */}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-center items-center mt-8 space-x-4">
        {/* Previous Button */}
        <button
          onClick={handlePrevious}
          disabled={currentPage === 0}
          className={`flex items-center justify-center w-10 h-10 rounded-full bg-secondary text-white ${
            currentPage === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-secondary-dark"
          }`}
        >
          <GrFormPrevious size={24} />
        </button>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={currentPage >= totalPages - 1}
          className={`flex items-center justify-center w-10 h-10 rounded-full bg-secondary text-white ${
            currentPage >= totalPages - 1
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-secondary-dark"
          }`}
        >
          <MdNavigateNext size={24} />
        </button>
      </div>
    </div>
  );
};

export default Events;
