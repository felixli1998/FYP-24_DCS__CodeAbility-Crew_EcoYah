import { useState, useEffect } from "react";
import RedemptionToastNotification from "./RedemptionToastNotification";
import axios from "axios";
import { BASE_URL, USER_POINTS_ROUTES } from "../../services/routes";
import { getAllPending } from "../../services/cashbackApi";
import io from "socket.io-client";

export default function RedemptionNotification() {
  const messageSound = require("../../assets/message.mp3");
  const [notifications, setNotifications] = useState<any[]>([]);

  const fetchPendingCashbackRequests = async () => {
    try {
      const pendingData = await getAllPending();
      setNotifications(pendingData.data);
    } catch (error) {
      console.error("Error fetching pending data", error);
    }
  }

  const acceptCashbackRequest = (notification: any) => {
    axios.post(USER_POINTS_ROUTES.ACCEPT_REQUEST, {
      userId: notification.userId,
      points: notification.points,
      transactionHistoryId: notification.transactionHistory.id,
      // Location for future use
      location: "default",
    })
    // Make a call to actually deduct
    removeNotification(notification);
  };

  const rejectCashbackRequest = (notification: any) => {
    axios.post(USER_POINTS_ROUTES.REJECT_REQUEST, {
      transactionHistoryId: notification.transactionHistory.id,
      // Location for future use
      location: "default",
    });
    removeNotification(notification);
  };

  const removeNotification = (notificationToRemove: any) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter(
        (notification) => notification !== notificationToRemove,
      ),
    );
  };

  useEffect(() => {
    fetchPendingCashbackRequests();

    // Create a Socket.IO client instance and connect to the server
    const socket = io(BASE_URL);

    // Listen for 'notification' event from the server and update state
    socket.on("notification", (data) => {
      console.log(data)
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
          onAccept={() => acceptCashbackRequest(notification)}
          onReject={() => rejectCashbackRequest(notification)}
        />
      ))}
    </>
  );
}
