import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import io from 'socket.io-client';
import RedemptionToastNotification from './RedemptionToastNotification';

export default function RedemptionNotification() {
    const messageSound = require("../../assets/message.mp3");
    const [notifications, setNotifications] = useState<any[]>([]);

    useEffect(() => {
        // Create a Socket.IO client instance and connect to the server
        const socket = io('http://localhost:8000',);

        // Listen for 'notification' event from the server and update state
        socket.on('notification', (data) => {
            setNotifications((prevNotifications) => [...prevNotifications, data]);
            console.log(data)
            toast.info(<RedemptionToastNotification />, { autoClose: 60000, data: data });
            const sound = new Audio(messageSound);
            sound.play();

        });

        // Clean up the socket connection when the component unmounts
        return () => {
            socket.disconnect();
        };
    }, []); 

    return (
        <>
            <ToastContainer
                style={{ 
                    width: '80vw',
                }}
                autoClose={2000}
                hideProgressBar
            />        
        </>
    );
}
