import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MyEvents() {
    const [events, setEvents] = useState<string[]>([]); // Array of events (you can replace string with an event object type if needed)
    const navigate = useNavigate()
    const handleCreateEvent = () => {
        // Function to create a new event
        // This can navigate to an event creation form or add a placeholder event
        alert('Navigate to the Create Event page or open a form.');
        navigate("/create-event")
    };

    return (
        <div className="events-container p-6 min-h-screen bg-gray-100 flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4">My Events</h1>
            {events.length === 0 ? (
                <div className="no-events text-center">
                    <p className="text-gray-600 mb-4">You have no events</p>
                    <button
                        onClick={handleCreateEvent}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Create New Event
                    </button>
                </div>
            ) : (
                <div className="events-list w-full max-w-lg">
                    {events.map((event, index) => (
                        <div
                            key={index}
                            className="event-item bg-white p-4 rounded shadow mb-4"
                        >
                            <h3 className="font-semibold text-lg">Event {index + 1}</h3>
                            <p className="text-gray-700">{event}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
