import React, { useState } from "react";
import { CustomEvent } from "../../constants";
import { FaTrashAlt } from "react-icons/fa";
import fetchWithAuth from "../individual_components/fetchWithAuth";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

interface CreateEventProps {
  setEventChange: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CreateEvent({setEventChange}: CreateEventProps) {
  const [eventDetails, setEventDetails] = useState<CustomEvent>({
    id: "",
    name: "",
    location: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    bannerPic: "",
    tickets: [{ name: "", price: 0, quantity: 0 }], // Default ticket
    company: "",
    description: "",
    link: "",
  });
  // const [token, setToken] = React.useState(() => {
  //   const storedToken = localStorage.getItem("accessToken");
  //   return storedToken ? JSON.parse(storedToken) : null;
  // });
  // console.log("Token:", token)
  const navigate = useNavigate();

  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEventDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTicket = () => {
    setEventDetails((prev) => ({
      ...prev,
      tickets: [...prev.tickets, { name: "", price: 0, quantity: 0 }],
    }));
  };

  const handleTicketChange = (
    index: number,
    field: keyof CustomEvent["tickets"][number],
    value: string | number
  ) => {
    const updatedTickets = [...eventDetails.tickets];
    updatedTickets[index] = {
      ...updatedTickets[index],
      [field]: field === "name" && typeof value === "string" ? value.slice(0, 30) : value, // Limit ticket type to 30 characters
    };
    setEventDetails((prev) => ({ ...prev, tickets: updatedTickets }));
  };

  const handleDeleteTicket = (index: number) => {
    if (eventDetails.tickets.length > 1) {
      const updatedTickets = eventDetails.tickets.filter(
        (_, i) => i !== index
      );
      setEventDetails((prev) => ({ ...prev, tickets: updatedTickets }));
    }
  };

  const handleSubmit = () => {
    if (eventDetails.tickets.length === 0) {
      alert("At least one ticket type is required!");
      return;
    }

    // Validate tickets using map
    const invalidTickets = eventDetails.tickets.map((ticket) => {
      if (
          typeof ticket.price !== "number" ||
          typeof ticket.quantity !== "number" ||
          isNaN(ticket.price) ||
          isNaN(ticket.quantity) ||
          ticket.price < 0 ||
          ticket.quantity <= 0
      ) {
          return ticket; // Return invalid ticket
      }
      return null; // Valid ticket
    }).filter((ticket) => ticket !== null); // Filter out valid tickets

    if (invalidTickets.length > 0) {
        alert("Some tickets have invalid price or quantity values!");
        console.error("Invalid Tickets:", invalidTickets);
        return;
    }

    // Combine city and country into a single location string
    const location = `${city.trim()}, ${country.trim()}`.replace(/, $/, "");
  
    // Prepare the event details payload
    const body = {
      name: eventDetails.name,
      description: eventDetails.description,
      startDate: eventDetails.startDate + "T" + eventDetails.startTime + ":00", // Combine date and time
      endDate: eventDetails.endDate + "T" + eventDetails.endTime + ":00", // Example: Same as startDate for now
      location: location, // Send null if location is empty
      bannerPic: eventDetails.bannerPic,
      tickets: eventDetails.tickets.map((ticket) => ({
        name: ticket.name,
        price: ticket.price, // Ensure price is an integer
        quantity: ticket.quantity, // Ensure quantity is an integer
      })),
    };
  
    console.log("Event Created:", body);
    const url = "http://localhost:8080/add_event"
    const options = {
      method: "POST",
      headers: { 
        "Content-Type": "application/json" ,
      },
      body: JSON.stringify(body),
    }
    fetchWithAuth(url, options)
  
    // fetch("http://localhost:8080/add_event", {
    //   method: "POST",
    //   headers: { 
    //     "Content-Type": "application/json" ,
    //     'Authorization' : `Bearer ${token}`
    //   },
    //   body: JSON.stringify(body),
    // })
      .then((res) => {
        console.log('Status:', res.status, res.statusText);
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.text(); // Read response as text
      })
      .then((data) => {
        console.log("Response from server:", data);
        alert("Event created successfully!");
        // Reset form fields
        setEventDetails({
          id: String(Date.now()),
          name: "",
          location: "",
          startDate: "",
          endDate: "",
          startTime: "",
          endTime: "",
          bannerPic: "",
          tickets: [{ name: "", price: 0, quantity: 0 }], // Reset with default ticket
          company: "",
          description: "",
          link: "",
        });
        setCity("");
        setCountry("");
        setEventChange(true)
      })
      .catch((error) => {
        console.error("Error creating event:", error);
        alert("Failed to create the event. Please try again.");
      });
  };
  

  return (
    <div className="create-event-container p-6 min-h-screen bg-gray-100 flex flex-col items-center lg:pt-[100px] pt-28">
      {/* Back Button */}
      <button 
        className="flex items-center text-secondary mb-4"
        onClick={() => navigate('/myevents')}
      >
        <IoArrowBack size={24} className="mr-2" />
        <span>Back</span>
      </button>
      <h1 className="text-2xl font-bold mb-4 text-secondary">Create Event</h1>
      <div className="form w-full max-w-lg bg-white p-6 rounded-md shadow-md">
        {/* All Inputs */}
        <input
          type="text"
          name="name"
          placeholder="Event Name"
          value={eventDetails.name}
          onChange={handleInputChange}
          className="border w-full p-2 mb-4 rounded"
        />
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="border w-full p-2 mb-4 rounded"
        />
        <input
          type="text"
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="border w-full p-2 mb-4 rounded"
        />
        <input
          type="date"
          name="startDate"
          placeholder="Start Date"
          value={eventDetails.startDate}
          onChange={handleInputChange}
          className="border w-full p-2 mb-4 rounded"
        />
        <input
          type="date"
          name="endDate"
          placeholder="End Date"
          value={eventDetails.endDate}
          onChange={handleInputChange}
          className="border w-full p-2 mb-4 rounded"
        />
        <input
          type="time"
          name="startTime"
          placeholder="Start Time"
          value={eventDetails.startTime}
          onChange={handleInputChange}
          className="border w-full p-2 mb-4 rounded"
        />
        <input
          type="time"
          name="endTime"
          placeholder="End Time"
          value={eventDetails.endTime}
          onChange={handleInputChange}
          className="border w-full p-2 mb-4 rounded"
        />
        <input
          type="text"
          name="company"
          placeholder="Company Name"
          value={eventDetails.company}
          onChange={handleInputChange}
          className="border w-full p-2 mb-4 rounded"
        />
        <textarea
          name="description"
          placeholder="Description (optional)"
          value={eventDetails.description}
          onChange={handleInputChange}
          className="border w-full p-2 mb-4 rounded"
        />

        {/* Image URL Input */}
        <input
          type="text"
          placeholder="Banner Image URL"
          value={eventDetails.bannerPic}
          onChange={(e) =>
            setEventDetails((prev) => ({
              ...prev,
              bannerPic: e.target.value,
            }))
          }
          className="border w-full p-2 mb-4 rounded"
        />
        {eventDetails.bannerPic && (
          <img
            src={eventDetails.bannerPic}
            alt="Cover"
            className="max-w-full h-40 object-cover mb-4"
          />
        )}

        {/* Ticket Details */}
        <h3 className="text-lg font-semibold mb-2">Ticket Details</h3>
        {eventDetails.tickets.map((ticket, index) => (
          <div key={index} className="flex items-center mb-4">
            <div className="flex xs:flex-row flex-col">
              <input
                type="text"
                placeholder="Ticket Type"
                value={ticket.name}
                onChange={(e) =>
                  handleTicketChange(index, "name", e.target.value)
                }
                className="border p-2 flex-1 xs:mr-2 rounded"
              />
              <input
                type="number"
                placeholder="Quantity"
                value={ticket.quantity}
                onChange={(e) =>
                  handleTicketChange(index, "quantity", parseFloat(e.target.value))
                }
                className="border p-2 w-20 rounded xs:mt-0 mt-2 xs:mr-2 "
              />
              <input
                type="number"
                placeholder="Price"
                value={ticket.price}
                onChange={(e) =>
                  handleTicketChange(index, "price", parseFloat(e.target.value))
                }
                className="border p-2 w-20 rounded xs:mt-0 mt-2"
              />
            </div>
            {index > 0 && (
              <button
                onClick={() => handleDeleteTicket(index)}
                className="text-red-500 hover:text-red-600 ml-2"
              >
                <FaTrashAlt />
              </button>
            )}
          </div>
        ))}
        <button
          onClick={handleAddTicket}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
        >
          Add Ticket
        </button>

        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white w-full p-2 rounded hover:bg-green-600"
        >
          Create Event
        </button>
      </div>
    </div>
  );
}
