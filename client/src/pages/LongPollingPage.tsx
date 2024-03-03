//@ts-nocheck
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

function LongPolling() {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        // Create a Socket.IO client instance and connect to the server
        const socket = io('http://localhost:8000',);

        // Listen for 'notification' event from the server and update state
        socket.on('notification', (data) => {
            setNotifications((prevNotifications) => [...prevNotifications, data]);
        });

        // Clean up the socket connection when the component unmounts
        return () => {
            socket.disconnect();
        };
    }, []); // Empty dependency array to run the effect only once on component mount

    return (
        <div>
            <h1>Socket.IO Notifications</h1>
            Hi
            <ul>
            <ul>
    {notifications.map((notification, index) => (
        <li key={index}>{JSON.stringify(notification)}</li>
    ))}
</ul>

            </ul>
        </div>
    );
}

export default LongPolling;
