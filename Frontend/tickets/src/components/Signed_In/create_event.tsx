import React, { useState, useEffect } from "react";
import { CustomEvent, serverLink } from "../../constants";
import { FaTrashAlt } from "react-icons/fa";
import fetchWithAuth from "../individual_components/fetchWithAuth";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

interface CreateEventProps {
  setEventChange: React.Dispatch<React.SetStateAction<boolean>>;
  setUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  update: boolean;
  event: CustomEvent | null
}

export default function CreateEvent({setEventChange, setUpdate, update, event}: CreateEventProps) {
  const [eventDetails, setEventDetails] = useState<CustomEvent>(
    update && event != null ? 
    event
    :
    {
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
    }
  );

  console.log("Event Details:", eventDetails)
  // const [token, setToken] = React.useState(() => {
  //   const storedToken = localStorage.getItem("accessToken");
  //   return storedToken ? JSON.parse(storedToken) : null;
  // });
  // console.log("Token:", token)
  const navigate = useNavigate();

  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [submitPressed, setPressed] = useState(false)

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
    if (submitPressed === true) {
      alert("Wait for response before trying again.")
      return
    }

    setPressed(true)
    if (
      !eventDetails.name || 
      !eventDetails.startDate || 
      !eventDetails.endDate || 
      !eventDetails.startTime || 
      !eventDetails.endTime || 
      !eventDetails.bannerPic || 
      !eventDetails.description ||
      !city ||
      !country
    ) {
      alert('All fields are required!');
      setPressed(false);
      return
    }  

  
    if (eventDetails.tickets.length === 0) {
      alert("At least one ticket type is required!");
      setPressed(false);
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
        setPressed(false);
        return;
    }

    // Validate startDate and endDate
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set current date to midnight for comparison

    const startDate = new Date(eventDetails.startDate);
    const endDate = new Date(eventDetails.endDate);

    if (startDate < today) {
      alert("Start date cannot be today or a past date!");
      setPressed(false);
      return;
    }

    if (endDate < today) {
      alert("End date cannot be today or a past date!");
      setPressed(false);
      return;
    }

    if (endDate < startDate) {
      alert("End date cannot be earlier than the start date!");
      setPressed(false);
      return;
    }

    // Now handle the time validation
    const startTime = new Date(`${eventDetails.startDate}T${eventDetails.startTime}:00`); // Use a fixed date to compare time
    const endTime = new Date(`${eventDetails.endDate}T${eventDetails.endTime}:00`);

    if (startTime >= endTime) {
      alert("End time cannot be before start time!");
      setPressed(false);
      return;
    }

    // Combine city and country into a single location string
    const location = `${city.trim()}, ${country.trim()}`.replace(/, $/, "");
  
    // Prepare the event details payload
    const body = {
      name: eventDetails.name,
      description: eventDetails.description,
      startDate: eventDetails.startDate + "T" + eventDetails.startTime, // Combine date and time
      endDate: eventDetails.endDate + "T" + eventDetails.endTime, // Example: Same as startDate for now
      location: location, // Send null if location is empty
      bannerPic: eventDetails.bannerPic,
      tickets: eventDetails.tickets.map((ticket) => ({
        name: ticket.name,
        price: ticket.price, // Ensure price is an integer
        quantity: ticket.quantity, // Ensure quantity is an integer
      })),
    };
  
    console.log(`Event ${update ? "Updated" : "Created"}:`, body);
    const url = update ? `${serverLink}/update_event?event_id=${eventDetails.id}` : `${serverLink}/add_event`
    const options = {
      method: update ? "PATCH" : "POST",
      headers: { 
        "Content-Type": "application/json" ,
      },
      body: JSON.stringify(body),
    }
    fetchWithAuth(url, options)
      .then((res) => {
        console.log('Status:', res.status, res.statusText);
        if (!res.ok) {
          setPressed(false)
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.text(); // Read response as text
      })
      .then((data) => {
        console.log("Response from server:", data);
        alert(`Event ${update ? "Updated" : "Created"} Successfully!`);
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
        setPressed(false)
        setEventChange(true)
        update && setUpdate(false)
        localStorage.removeItem("update");
        localStorage.removeItem("updateEvent"); // Clear if null
        navigate("/myevents")
      })
      .catch((error) => {
        console.error(`Error ${update ? "updating" : "creating"} event:`, error);
        setPressed(false)
        alert(`Failed to ${update ? "update" : "create"} the event. Please try again.`);
      });
  };

  useEffect(() => {
    if (event) {
      const [city, country] = event.location.split(", ");
      setCity(city?.trim() || "")
      setCountry(country?.trim() || "")
    }
  }, [event])
  

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
      <h1 className="text-2xl font-bold mb-4 text-secondary">{update ? "Update " : "Create " }Event</h1>
      <div className="form w-full max-w-lg bg-white p-6 rounded-md shadow-md">
        {/* All Inputs */}
        {
          !update &&
          <div className="mb-4">
            <input
              type="text"
              name="name"
              placeholder="Event Name"
              value={eventDetails.name}
              onChange={handleInputChange}
              className="border w-full p-2 mb-2 rounded"
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
            <span className="text-sm text-gray-600">
              Please ensure that the event name, city and country you enter are correct. They cannot be altered once created.
            </span>
          </div>
        }
        <h4 className="text-gray-600">Start Date</h4>
        <input
          type="date"
          name="startDate"
          placeholder="Start Date"
          value={eventDetails.startDate}
          onChange={handleInputChange}
          className="border w-full p-2 mb-4 rounded"
        />
        <h4 className="text-gray-600">End Date</h4>
        <input
          type="date"
          name="endDate"
          placeholder="End Date"
          value={eventDetails.endDate}
          onChange={handleInputChange}
          className="border w-full p-2 mb-4 rounded"
        />
        <h4 className="text-gray-600">Start Time</h4>
        <input
          type="time"
          name="startTime"
          placeholder="Start Time"
          value={eventDetails.startTime}
          onChange={handleInputChange}
          className="border w-full p-2 mb-4 rounded"
        />
        <h4 className="text-gray-600">End Time</h4>
        <input
          type="time"
          name="endTime"
          placeholder="End Time"
          value={eventDetails.endTime}
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
        {
          !update &&
          <div>
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
          </div>
        }

        {/* Ticket Details */}
        {
          !update && (
            <div>
              <div className="mb-2">
                <h3 className="text-lg font-semibold mb-2">Ticket Details</h3>
                <span className="text-sm text-gray-600">
                  Please ensure that the details you enter are correct, as they cannot be altered once created.
                </span>
              </div>

              {/* Header Row */}
              {eventDetails.tickets && eventDetails.tickets.length > 0 && (
                <div className="flex items-center mb-2 font-semibold text-gray-700">
                  <div className="flex xs:flex-row flex-col w-full">
                    <div className="flex-1 xs:mr-2 text-center">Ticket Type</div>
                    <div className="w-20 xs:mr-2 text-center">Quantity</div>
                    <div className="w-20 text-center">Price</div>
                  </div>
                </div>
              )}

              {eventDetails.tickets &&
                eventDetails.tickets.map((ticket, index) => (
                  <div key={index} className="flex items-center mb-4">
                    <div className="flex xs:flex-row flex-col w-full">
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
                        className="border p-2 w-20 rounded xs:mt-0 mt-2 xs:mr-2"
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
            </div>
          )
        }

        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white w-full p-2 rounded hover:bg-green-600"
        >
          {update ? "Update " : "Create " } Event
        </button>
      </div>
    </div>
  );
}
