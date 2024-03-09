import { useState, useEffect } from "react";
import RedemptionToastNotification from "./RedemptionToastNotification";
import io from "socket.io-client";

export default function RedemptionNotification() {
  const messageSound = require("../../assets/message.mp3");
  const [notifications, setNotifications] = useState<any[]>([]);

  const removeNotification = (notificationToRemove: any) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter(
        (notification) => notification !== notificationToRemove,
      ),
    );
  };

  useEffect(() => {
    // Create a Socket.IO client instance and connect to the server
    const socket = io("http://localhost:8000");

    // Listen for 'notification' event from the server and update state
    socket.on("notification", (data) => {
      setNotifications((prevNotifications) => [...prevNotifications, data]);
      const sound = new Audio(messageSound);
      sound.autoplay = true;
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      {notifications.map((notification, index) => (
        <RedemptionToastNotification
          key={index}
          data={notification}
          onAccept={() => removeNotification(notification)}
          onReject={() => removeNotification(notification)}
        />
      ))}
    </>
  );
}
