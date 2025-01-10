import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom"; // Import useLocation and Link
import { Logo } from "../../assets";
import SearchBar from "./search";
import { CustomEvent, events } from "../../constants"; // Assuming events is an array of event objects
import { useCart } from './CartContext';
import { FaShoppingCart } from 'react-icons/fa';
import * as HiIcons from 'react-icons/hi'
import * as AiIcons from 'react-icons/ai'
import { navLinks } from "../../constants";
import { isAuthenticated } from "../individual_components/auth";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  onFilteredEvents: (filtered: CustomEvent[]) => void;
  filteredEvents: CustomEvent[];
  allEvents: CustomEvent[];
  toggle: boolean;
  newMenu: () => void
}

export default function Navbar({ onFilteredEvents, filteredEvents, allEvents, toggle, newMenu }: NavbarProps) {
  const location = useLocation(); // Get the current location
  const isHomePage = location.pathname === "/"; // Check if the current path is home "/"
  const navigate = useNavigate(); // Call useNavigate inside the React component

  useEffect(() => {

  })

  const handleFilteredEvents = (filtered: CustomEvent[]) => {
    onFilteredEvents(filtered); // Update the filtered events in the parent component
  };

  const { cart } = useCart();

  // Calculate total items in the cart
  const totalItems = (cart || []).reduce(
    (acc, event) => acc + Object.values(event.tickets || {}).reduce((sum, ticket) => sum + ticket.count, 0),
    0
  );  

  const [subnav, setSubnav] = useState(false)

  function showSubnav () {
      setSubnav(!subnav)
  }

  function exitPage() {
    localStorage.clear(); // Clear tokens or perform other logout actions
    setTimeout(() => {
      isAuthenticated()
    }, 200)
    navigate("/"); // Redirect to the home page
    newMenu(); // Call the menu toggle function
  }
  

  return (
    <div className="nav">
      {/* Desktop Navbar */}
      <div className="md:flex hidden items-center justify-between bg-white shadow-md px-4 py-0">
        <Link to="/">
          <div className="flex items-center cursor-pointer">
            <img src={Logo} alt="Logo" className="w-[90px] h-[90px]" />
          </div>
        </Link>

        {/* Conditionally render SearchBar only on the home page */}
        {isHomePage && (
          <SearchBar
            events={filteredEvents}
            onFilteredEvents={handleFilteredEvents}
            allEvents={allEvents}
          />
        )}

        <div className="flex items-center space-x-8">
          {/* <h3 className="hover:text-secondary cursor-pointer">Sign Up</h3>
          <h3 className="hover:text-secondary cursor-pointer">Log In</h3> */}
          {
            !isAuthenticated() ?
            <ul className="list-none sm:flex hidden justify-end items-center flex-1 space-x-4">
              {
                navLinks.map((nav, index) => (
                  <li key = {index} >
                    <Link to={nav.link} className="hover:text-secondary cursor-pointer">
                      <h3>{nav.title}</h3>
                    </Link>
                  </li>
                ))
              }
            </ul>
            :
            <ul className="list-none sm:flex hidden justify-end items-center flex-1 space-x-4">
              <li>
                <Link to="/myevents">
                  <h3 className="hover:text-secondary cursor-pointer" >My Events</h3>
                </Link>
              </li>
              <li>
                <Link to="/create-event">
                  <h3 className="hover:text-secondary cursor-pointer" >Create Event</h3>
                </Link>
              </li>
              <li>
                <h3 className="hover:text-secondary cursor-pointer" onClick={exitPage}>Logout</h3>
              </li>
            </ul>
          }
          {/* Cart Icon with Total Items */}
          <Link to="/checkout">
            <div className="flex items-center space-x-2 cursor-pointer">
                <FaShoppingCart className="text-xl text-secondary_dark" />
                <span className="text-secondary_dark font-semibold text-md">{totalItems} items</span>
            </div>
          </Link>
            
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="md:hidden flex flex-col">
        <div className="flex items-center justify-between shadow-md bg-white px-8 py-0">
          <Link to="/">
            <div className="flex items-center cursor-pointer">
              <img src={Logo} alt="Logo" className="w-[90px] h-[90px]" />
            </div>
          </Link>

          <div className="flex items-center space-x-8">
            {/* Cart Icon with Total Items */}
            <Link to="/checkout">
              <div className="flex items-center justify-center space-x-2 cursor-pointer">
                  <FaShoppingCart className="text-xl text-secondary_dark" />
                  <span className="text-secondary_dark font-semibold text-lg">{totalItems}</span>
              </div>
            </Link>

            <div className="md:hidden flex flex-1 justify-end items-center cursor-pointer ">
              {
                  !toggle ? 
                  <HiIcons.HiMenu 
                      className="w-[32px] h-[32px] object-contain"
                      onClick={newMenu} 
                  />
                  :
                  <AiIcons.AiOutlineClose onClick={() => {
                      if (subnav) {
                          newMenu();
                          showSubnav();
                      } else {
                          newMenu();
                      }
                  }} className="w-[32px] h-[32px] object-contain"/>
              }
            </div>
          </div>
        </div>

        <div className={`flex md:hidden
            ${toggle ? "translate-x-0" : "translate-x-full opacity-0"} ease-in-out duration-300 overflow-auto
        `}>
          {
              toggle &&
              <ul className="list-none flex flex-col justify-center flex-1">
                {
                  !isAuthenticated() ?
                  navLinks.map((nav, index) => (
                      <div>
                          <li key = {index} 
                            className={`
                                font-poppins
                                font-normal
                                cursor-pointer
                                text-[15px] ${index === navLinks.length - 1 ? 'mr-0' : "mb-4"}
                                text-secondary_dark
                                bg-white
                                mb-1
                                p-3
                                flex
                                justify-between
                                border-b-2 border-gray-300
                            `}
                          >
                            <Link to={nav.link} className="hover:text-secondary cursor-pointer" onClick={newMenu}>
                              <h3>{nav.title}</h3>
                            </Link>
                          </li>
                        </div>
                    ))
                    :
                    <div>
                      
                      <li
                        className={`
                          font-poppins
                          font-normal
                          cursor-pointer
                          text-[15px]
                          text-secondary_dark
                          bg-white
                          mb-1
                          p-3
                          flex
                          justify-between
                          border-b-2 border-gray-300
                        `}
                      >
                        <Link to="/myevents" onClick={newMenu}>
                          <h3 className="hover:text-secondary cursor-pointer" >My Events</h3>
                        </Link>
                      </li>
                      
                      <li
                        className={`
                          font-poppins
                          font-normal
                          cursor-pointer
                          text-[15px]
                          text-secondary_dark
                          bg-white
                          mb-1
                          p-3
                          flex
                          justify-between
                          border-b-2 border-gray-300
                        `}
                      >
                        <Link to="/create-event" onClick={newMenu}>
                          <h3 className="hover:text-secondary cursor-pointer" >Create Event</h3>
                        </Link>
                      </li>
                      
                      <li
                        className={`
                          font-poppins
                          font-normal
                          cursor-pointer
                          text-[15px]
                          text-secondary_dark
                          bg-white
                          mb-1
                          p-3
                          flex
                          justify-between
                          border-b-2 border-gray-300
                        `}
                      >
                        <h3 className="hover:text-secondary cursor-pointer" onClick={exitPage}>Logout</h3>
                      </li>
                    </div>
                }
              </ul>
          }

        </div>

        {/* Conditionally render SearchBar only on the home page */}
        {isHomePage && !toggle && (
          <div className="flex items-center mt-4 justify-center px-2">
            <SearchBar
              events={filteredEvents}
              onFilteredEvents={handleFilteredEvents}
              allEvents={allEvents}
            />
          </div>
        )}

      </div>
    </div>
  );
}
