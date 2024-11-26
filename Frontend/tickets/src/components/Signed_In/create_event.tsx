import React, { useState } from "react";
import { CustomEvent } from "../../constants";
import { FaTrashAlt } from "react-icons/fa";

export default function CreateEvent() {
  const [eventDetails, setEventDetails] = useState<CustomEvent>({
    id: Date.now(),
    name: "",
    city: "",
    country: "",
    date: "",
    time: "",
    cover_image: "",
    ticket_details: [{ type: "", price: 0 }], // Default ticket
    company: "",
    description: "",
    link: "",
  });

  const [dragging, setDragging] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEventDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTicket = () => {
    setEventDetails((prev) => ({
      ...prev,
      ticket_details: [...prev.ticket_details, { type: "", price: 0 }],
    }));
  };

  const handleTicketChange = (
    index: number,
    field: keyof CustomEvent["ticket_details"][number],
    value: string | number
  ) => {
    const updatedTickets = [...eventDetails.ticket_details];
    updatedTickets[index] = {
      ...updatedTickets[index],
      [field]: field === "type" && typeof value === "string" ? value.slice(0, 30) : value, // Limit ticket type to 30 characters
    };
    setEventDetails((prev) => ({ ...prev, ticket_details: updatedTickets }));
  };

  const handleDeleteTicket = (index: number) => {
    if (eventDetails.ticket_details.length > 1) {
      const updatedTickets = eventDetails.ticket_details.filter(
        (_, i) => i !== index
      );
      setEventDetails((prev) => ({ ...prev, ticket_details: updatedTickets }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEventDetails((prev) => ({
          ...prev,
          cover_image: e.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEventDetails((prev) => ({
          ...prev,
          cover_image: e.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (eventDetails.ticket_details.length === 0) {
      alert("At least one ticket type is required!");
      return;
    }

    const generatedLink = `/events/${eventDetails.id}`;
    console.log("Event Created:", { ...eventDetails, link: generatedLink });
    setEventDetails({
      id: Date.now(),
      name: "",
      city: "",
      country: "",
      date: "",
      time: "",
      cover_image: "",
      ticket_details: [{ type: "", price: 0 }], // Reset with default ticket
      company: "",
      description: "",
      link: "",
    });
    alert("Event created successfully!");
  };

  return (
    <div className="create-event-container p-6 min-h-screen bg-gray-100 flex flex-col items-center lg:pt-[100px] pt-28">
      <h1 className="text-2xl font-bold mb-4 text-secondary">Create Event</h1>
      <div className="form w-full max-w-lg bg-white p-6 rounded-md shadow-md">
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
          name="city"
          placeholder="City"
          value={eventDetails.city}
          onChange={handleInputChange}
          className="border w-full p-2 mb-4 rounded"
        />
        <input
          type="text"
          name="country"
          placeholder="Country"
          value={eventDetails.country}
          onChange={handleInputChange}
          className="border w-full p-2 mb-4 rounded"
        />
        <input
          type="date"
          name="date"
          value={eventDetails.date}
          onChange={handleInputChange}
          className="border w-full p-2 mb-4 rounded"
        />
        <input
          type="time"
          name="time"
          value={eventDetails.time}
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

        {/* Drag and Drop or Choose Cover Image */}
        <div
          className={`border-dashed border-2 p-4 mb-4 rounded flex justify-center items-center ${
            dragging ? "bg-gray-200" : "bg-gray-50"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="coverImage"
          />
          <label htmlFor="coverImage" className="cursor-pointer">
            {eventDetails.cover_image ? (
              <img
                src={eventDetails.cover_image}
                alt="Cover"
                className="max-w-full h-40 object-cover"
              />
            ) : (
              <span>Drag and drop or click to upload cover image</span>
            )}
          </label>
        </div>

        {/* Ticket Details */}
        <h3 className="text-lg font-semibold mb-2">Ticket Details</h3>
        {eventDetails.ticket_details.map((ticket, index) => (
          <div key={index} className="flex items-center mb-4">
            <div className="flex xxs:flex-row flex-col">
                <input
                type="text"
                placeholder="Ticket Type"
                value={ticket.type}
                onChange={(e) =>
                    handleTicketChange(index, "type", e.target.value)
                }
                className="border p-2 flex-1 xxs:mr-2 rounded"
                />
                <input
                type="number"
                placeholder="Price"
                value={ticket.price}
                onChange={(e) =>
                    handleTicketChange(index, "price", parseFloat(e.target.value))
                }
                className="border p-2 w-20 rounded xxs:mt-0 mt-2"
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
