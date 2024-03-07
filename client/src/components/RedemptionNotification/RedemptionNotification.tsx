//@ts-nocheck
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import io from 'socket.io-client';
import messageSound from "../../assets/message.mp3"; 

import RedemptionToastNotification from './RedemptionToastNotification';

function RedemptionNotification() {
    const [utterance, setUtterance] = useState<any>(null);
    const [notifications, setNotifications] = useState([]);
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

            // const synth = window.speechSynthesis;
            // const utterance: any = new SpeechSynthesisUtterance();
            // setUtterance(utterance);

            // utterance.text = "You have a cashback request.";
            // synth.speak(utterance);
        });

        // Clean up the socket connection when the component unmounts
        return () => {
            socket.disconnect();
            // synth.cancel();
        };
    }, []); // Empty dependency array to run the effect only once on component mount

    return (
        <div>
            <ToastContainer
                style={{ 
                    width: '80vw',
                }}
                autoClose={2000}
                hideProgressBar
            />        
        </div>
    );
}

export default RedemptionNotification;
