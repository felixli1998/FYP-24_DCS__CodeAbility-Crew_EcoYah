//@ts-nocheck
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import io from 'socket.io-client';

import RedemptionToastNotification from './RedemptionToastNotification';
import { WidthFull } from '@mui/icons-material';

function RedemptionNotification() {
    const [notifications, setNotifications] = useState([]);
    useEffect(() => {
        // Create a Socket.IO client instance and connect to the server
        const socket = io('http://localhost:8000',);

        // Listen for 'notification' event from the server and update state
        socket.on('notification', (data) => {
            setNotifications((prevNotifications) => [...prevNotifications, data]);
            console.log(data)
            toast.info(<RedemptionToastNotification />, { autoClose: 60000, data: data });
        });

        // Clean up the socket connection when the component unmounts
        return () => {
            socket.disconnect();
        };
    }, []); // Empty dependency array to run the effect only once on component mount

    return (
        <div>
            <p>Socket.IO Notifications is active here!</p>
            <ToastContainer
                position="top-center"
                style={{ 
                    width: '80vw',
                }}
                autoClose={2000}
                hideProgressBar
            />        </div>
    );
}

export default RedemptionNotification;
