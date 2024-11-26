import { useRef } from "react";
import Location from "./location";
import Events from "./events";
import { useIsVisible } from "../Constants/isVisible";
import { CustomEvent } from "../../constants";

interface HomeProps {
  filteredEvents: CustomEvent[]; // Accept filtered events as a prop
  allEvents: CustomEvent[];
  showLocation: boolean
}

export default function Home({ filteredEvents, allEvents, showLocation }: HomeProps) {
  // Define your refs with the correct type
  const ref1 = useRef<HTMLDivElement>(null);
  const isVisible1 = useIsVisible(ref1);

  const ref2 = useRef<HTMLDivElement>(null);
  const isVisible2 = useIsVisible(ref2);

  return (
    <div className="text-secondary">
      {/* Location Section */}
      {showLocation && (
        <div
        //   ref={ref1}
          className={`flex justify-center items-start lg:pt-[80px] md:pt-12 sm:pt-28 pt-32 transition-opacity ease-in duration-700 `} // ${isVisible1 ? "opacity-100" : "opacity-0"}
        >
          <div className="xl:max-w-[1280px] w-full">
            <Location />
          </div>
        </div>
      )}

      {/* Events Section */}
      <div
        // ref={ref2}
        className={`${showLocation ? "mt-[-10px]" : "sm:pt-[100px] pt-40"} sm:px-16 px-6 flex justify-center items-start transition-opacity ease-in duration-700`} // ${isVisible2 ? "opacity-100" : "opacity-0"}
      >
        <div className="xl:max-w-[1280px] w-full relative">
          {/* Pass filtered events to the Events component */}
          <Events events={filteredEvents} showLocation={showLocation}/>
        </div>
      </div>
    </div>
  );
}
