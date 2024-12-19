import React, { useState, useEffect } from "react";
import { IoMdSearch } from "react-icons/io";
import { FaLocationArrow } from "react-icons/fa";
import { CustomEvent } from "../../constants"; // Import the Event type from constants

// Define the type for the props explicitly
interface SearchBarProps {
  events: CustomEvent[]; // The events prop is an array of Event objects
  onFilteredEvents: (filteredEvents: CustomEvent[]) => void; // onFilteredEvents is a function that takes an array of Event objects
  allEvents: CustomEvent[]
}

const SearchBar: React.FC<SearchBarProps> = ({ events, onFilteredEvents, allEvents }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");

  // useEffect to handle filtering events when searchQuery or locationQuery changes
  useEffect(() => {
    // If both searchQuery and locationQuery are empty, show all events
    if (searchQuery === "" && locationQuery === "") {
        events = allEvents
      onFilteredEvents(events); // Pass all events back when there is no search query or location query
    } 
    else {
      // Otherwise, filter events based on searchQuery and locationQuery
      events = allEvents
      const filtered = events.filter(
        (event) =>
          event.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          event.location.toLowerCase().includes(locationQuery.toLowerCase())
      );

      // If no events match, pass an empty list or an appropriate message to show
      if (filtered.length > 0) {
        onFilteredEvents(filtered); // Pass filtered events
      } else {
        onFilteredEvents([]); // Or you could send a "No results found" message
      }
    }
    // console.log(events.length, allEvents.length)
  }, [searchQuery, locationQuery]); // Dependencies to trigger effect on change

  return (
    <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 space-x-2 w-full max-w-lg">
      {/* Search Part */}
      <div className="flex items-center space-x-2 w-full">
        <IoMdSearch className="text-gray-500 text-xl" />
        <input
          type="text"
          placeholder="Search your event..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent outline-none w-full text-gray-700 placeholder-gray-500"
        />
      </div>

      {/* Divider */}
      <div className="h-6 w-px bg-gray-300 sm:flex hidden"></div>

      {/* Location Part */}
      <div className="flex items-center space-x-2 w-full sm:flex hidden">
        <FaLocationArrow className="text-gray-500 text-sm" />
        <input
          type="text"
          placeholder="Location"
          value={locationQuery}
          onChange={(e) => setLocationQuery(e.target.value)}
          className="bg-transparent outline-none w-full text-gray-700 placeholder-gray-500"
        />
      </div>

      {/* Search Button */}
      {/* <div className="ml-2">
        <button
          onClick={() => {}}
          className="p-2 rounded-full bg-secondary hover:bg-secondary_dark text-white transition-colors"
        >
          <IoMdSearch className="text-lg" />
        </button>
      </div> */}
    </div>
  );
};

export default SearchBar;
