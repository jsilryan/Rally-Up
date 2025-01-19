import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './Home/home';
import Navbar from './Constants/navbar';
import EventDetails from './individual_components/event';
import { CustomEvent, eventFromServer, convertEventData, serverLink } from '../constants';
import { animateScroll as scroll } from 'react-scroll'
import Checkout from './Home/checkout';
import Signup from './individual_components/signup';
import Login from './individual_components/login';
import MyEvents from './Signed_In/my_events';
import CreateEvent from './Signed_In/create_event';
import ProtectedRoute from './individual_components/protectedRoute';


function Links() {
  // Filter events with at least one ticket type having quantity > 0
  const location = useLocation();
  const pathSegments = location.pathname.split('/');
  const firstSegment = pathSegments[0];

  const [eventChange, setEventChange] = useState(true)

  const [allEvents, setAllEvents] = useState<CustomEvent[]>([])
  const [myEvents, setMyEvents] = useState<CustomEvent[]>([])
  

  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }
  
  useEffect(() => {
    const fetchEvents = async () => {
      const url = `${serverLink}/events`;
      let retryCount = 0;
  
      while (retryCount < 5) { // Retry up to 5 times
        try {
          const response = await fetch(url, requestOptions);
  
          if (!response.ok) {
            throw new Error(`Error: ${response.status}`); // Retry on bad response
          }
  
          const data: eventFromServer[] = await response.json();
          console.log("Events Data:", data);
  
          // Convert and filter events - Only those being held today or later
          const customEvents = convertEventData(data);
          const currentCustomEvents = customEvents.filter((event) => {
            const eventDate = new Date(event.startDate); // Convert event start date to a Date object
            const today = new Date(); // Get today's date
            today.setHours(0, 0, 0, 0); // Normalize to midnight for accurate comparison
            return eventDate >= today; // Include events from today or later
          });
  
          setAllEvents(currentCustomEvents); // Set the data in the state
          setEventChange(false); // Mark event change as processed
          break; // Exit loop on success
        } catch (err) {
          console.log("Retry fetching events:", err);
          retryCount++;
          await new Promise((resolve) => setTimeout(resolve, 3000)); // Delay before retry
        }
      }
    };
    
    if (allEvents.length <= 0 || eventChange === true) {
      fetchEvents();
    }
  }, [eventChange]); // Dependencies
  

  const [filteredEvents, setFilteredEvents] = useState<CustomEvent[]>(allEvents);

  useEffect(() => {
    console.log("Updated allEvents:", allEvents); // Logs the updated state
    setFilteredEvents(allEvents)

    console.log("My Events:", myEvents)
  }, [allEvents]);  // Triggers whenever `allEvents` is updated  
  
  // const allEvents = validEvents;

  const handleFilteredEvents = (filtered: CustomEvent[]) => {
    setFilteredEvents(filtered);
  };

  const shouldShowLocation = filteredEvents.length === allEvents.length;

  const [toggle, setToggle] = useState(false)

  let savedPosition = 0
  function newMenu() {
    if (toggle) { // If the menu is currently open
      scroll.scrollTo(savedPosition);// scroll back to the saved position
    } else {
      savedPosition = window.pageYOffset || document.documentElement.scrollTop;
    }
    setToggle((prev) => !prev)
  }

  const [update, setUpdate] = useState<boolean>(() => {
    const savedUpdate = localStorage.getItem("update");
    console.log("Saved Update:", savedUpdate)
    return savedUpdate ? JSON.parse(savedUpdate) : false;
  });
  
  const [updateEvent, setUpdateEvent] = useState<CustomEvent | null>(() => {
    const savedUpdateEvent = localStorage.getItem("updateEvent");
    console.log("Saved Update Event:", savedUpdateEvent)
    return savedUpdateEvent ? JSON.parse(savedUpdateEvent) : null;
  });

  useEffect(() => {
    console.log("First Segment:", firstSegment)
    if (firstSegment !== "create-event") {
      setUpdate(false);
      setUpdateEvent(null);
      localStorage.removeItem("update");
      localStorage.removeItem("updateEvent");
    }
  }, [firstSegment]);  

  return (
    
    !toggle ?
    <div className="w-full">
      {/* Fixed Navbar */}
      <div className="flex justify-center items-center fixed top-0 w-full z-50 bg-white">
        <div className="xl:max-w-[1280px] w-full">
          <Navbar
            filteredEvents={filteredEvents}
            onFilteredEvents={handleFilteredEvents}
            allEvents={allEvents}
            toggle={toggle}
            newMenu={newMenu}
            setEventChange={setEventChange}
          />
        </div>
      </div>

      {/* Routes Configuration */}
      <div > {/* Added top margin to avoid overlap with the fixed Navbar */}
        <Routes>
          <Route
            path="/"
            element={
              <Home
                filteredEvents={filteredEvents}
                allEvents={allEvents}
                showLocation={shouldShowLocation}
              />
            }
          />
          <Route 
            path="/events/:eventId" 
            element={<EventDetails events={allEvents} myEvents={myEvents} update={update} setUpdate={setUpdate} setUpdateEvent={setUpdateEvent}/>} 
          />
          <Route
            path='/checkout'
            element = {<Checkout events={allEvents}/>}
          />
          <Route
            path="/signup"
            element={<Signup />}
          />
          <Route
            path='/login'
            element={<Login />}
          />
          <Route
            path = "/myevents"
            element = {
              <ProtectedRoute>
                <MyEvents setMyEvents={setMyEvents} eventChange={eventChange}/>
              </ProtectedRoute>
            }
          />
          <Route
            path = "/create-event"
            element = {
              <ProtectedRoute >
                <CreateEvent setEventChange={setEventChange} setUpdate={setUpdate} update={update} event={updateEvent}/>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>

    :

    <div className="w-full">
      {/* Fixed Navbar */}
      <div className="flex justify-center items-center fixed top-0 w-full z-50 bg-white">
        <div className="xl:max-w-[1280px] w-full">
          <Navbar
            filteredEvents={filteredEvents}
            onFilteredEvents={handleFilteredEvents}
            allEvents={allEvents}
            toggle={toggle}
            newMenu={newMenu}
            setEventChange={setEventChange}
          />
        </div>
      </div>
    </div>

  );
}

export default Links;
