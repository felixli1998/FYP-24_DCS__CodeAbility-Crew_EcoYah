import {useState, useEffect } from "react";

export default function DonationEvents() {
    const [events, setEvents] = useState([]);
    const [errorFetchingEvents, setErrorFetchingEvents] = useState(false);

    const getAllEvents = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/events');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getAllEvents();
                setEvents(res);
            } catch (error) {
                console.error('Error:', error);
                setErrorFetchingEvents(true);
            }
        }
        fetchData();
    }, []);

    return (
        <div>
            <h1>Donation Events</h1>
            <ul>
                {/* {events.map((event) => (
                    <li key={event.id}>
                        <h2>{event.name}</h2>
                        <p>{event.description}</p>
                    </li>
                ))} */}
            </ul>
        </div>
    );
}