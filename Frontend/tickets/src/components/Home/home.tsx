import { useRef } from "react";
import Location from "./location";
import Events from "./events";
import { useIsVisible } from "../Constants/isVisible";
import { CustomEvent } from "../../constants";

interface HomeProps {
  filteredEvents: CustomEvent[]; // Accept filtered events as a prop
  allEvents: CustomEvent[];
  showLocation: boolean;
}

export default function Home({ filteredEvents, showLocation }: HomeProps) {
  console.log("Home Events:", filteredEvents);
  
  // Define your refs with the correct type
  const ref1 = useRef<HTMLDivElement>(null);
  const isVisible1 = useIsVisible(ref1);

  const ref2 = useRef<HTMLDivElement>(null);
  const isVisible2 = useIsVisible(ref2);

  // Loading state
  const isLoading = filteredEvents.length === 0;

  return (
    <div className="text-secondary">
      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <p className="text-lg text-gray-500 animate-pulse">Loading events...</p>
        </div>
      ) : (
        <>
          {/* Location Section */}
          {showLocation && (
            <div
              className={`flex justify-center items-start lg:pt-[80px] md:pt-12 sm:pt-28 pt-32 transition-opacity ease-in duration-700`}
            >
              <div className="xl:max-w-[1280px] w-full">
                <Location allEvents={filteredEvents} />
              </div>
            </div>
          )}

          {/* Events Section */}
          <div
            className={`${
              showLocation ? "mt-[-10px]" : "sm:pt-[100px] pt-40"
            } sm:px-16 px-6 flex justify-center items-start transition-opacity ease-in duration-700`}
          >
            <div className="xl:max-w-[1280px] w-full relative">
              {filteredEvents.length === 0 ? (
                <p className="text-center text-lg text-gray-500">
                  No events available.
                </p>
              ) : (
                <Events events={filteredEvents} showLocation={showLocation} />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
