import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './Home/home';
import Navbar from './Constants/navbar';
import EventDetails from './individual_components/event';
import { CustomEvent, events, eventFromServer, convertEventData } from '../constants';
import { animateScroll as scroll, Events } from 'react-scroll'
import Checkout from './Home/checkout';
import Signup from './individual_components/signup';
import Login from './individual_components/login';
import MyEvents from './Signed_In/my_events';
import CreateEvent from './Signed_In/create_event';
import ProtectedRoute from './individual_components/protectedRoute';
import fetchWithAuth from './individual_components/fetchWithAuth';

function Links() {
  // Filter events with at least one ticket type having quantity > 0
  const location = useLocation();
  const pathSegments = location.pathname.split('/');
  const firstSegment = pathSegments[0];

  const [allEvents, setAllEvents] = useState<CustomEvent[]>([])

  const validEvents = events.filter(event =>
    event.tickets.some(ticket => ticket.quantity > 0)
  );

  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }
  
  useEffect(
    () => {
      if (firstSegment === "" && allEvents.length <= 0) {
        const url = "http://localhost:8080/events";
  
        fetch(url, requestOptions)
          .then((response) => response.json())
          .then((data: eventFromServer[]) => {
            console.log("Events Data:", data);
            const customEvents = convertEventData(data);
            setAllEvents(customEvents); // Set the data in the state as CustomEvent[]
          })
          .catch((err) => console.log(err));
      }
    }, [firstSegment] // The effect will run every time `firstSegment` changes
  );

  const [filteredEvents, setFilteredEvents] = useState<CustomEvent[]>(allEvents);
    
  useEffect(() => {
    console.log("Updated allEvents:", allEvents); // Logs the updated state
    setFilteredEvents(allEvents)
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
            element={<EventDetails events={allEvents} />} 
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
                <MyEvents allEvents={allEvents} />
              </ProtectedRoute>
            }
          />
          <Route
            path = "/create-event"
            element = {
              <ProtectedRoute >
                <CreateEvent />
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
          />
        </div>
      </div>
    </div>

  );
}

export default Links;
