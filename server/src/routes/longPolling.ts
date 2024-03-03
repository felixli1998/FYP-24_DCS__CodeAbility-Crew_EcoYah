import express, { Router, Request, Response } from "express";
import { Server, Socket } from "socket.io";

const router: Router = express.Router();

let activeConnections: Socket[] = [];

// Function to handle long polling connection
export function handleLongPolling(io: Server) {
    console.log("This is called! Active connections: ", activeConnections)
    io.on("connection", (socket: Socket) => {
        console.log(`New connection: ${socket.id}`);
        
        // Add the new connection to the active connections array
        activeConnections.push(socket);

        // Handle disconnection
        socket.on("disconnect", () => {
            console.log(`Disconnected: ${socket.id}`);
            // Remove the disconnected socket from the active connections array
            activeConnections = activeConnections.filter(conn => conn !== socket);
        });
    });
}

// Function to notify active connections
export function notifyActiveConnections(notificationData: any) {
    console.log("I emitted this, ", notificationData)
    console.log("Active connections: ", activeConnections)
    activeConnections.forEach(socket => {
        socket.emit("notification", notificationData);
    });
}

// Route to establish a long polling connection
router.get("/connect", (req: Request, res: Response) => {
    res.send("Connected to long polling");
    console.log("Active connections are ", activeConnections)
});

// Route to trigger notification for active connections
router.post("/notify", (req: Request, res: Response) => {
    // Example notification data from the request body
    const notificationData = req.body;
    console.log("We got here!", notificationData)
    
    // Notify active connections
    notifyActiveConnections(notificationData);

    // Here, you can send a response to the client indicating that the notification is done
    res.send("Notification process initiated");
});


// Route to get active connections (for testing purposes)
router.get("/active-connections", (req: Request, res: Response) => {
    // Respond with the list of active socket IDs
    const activeSocketIds = activeConnections.map(socket => socket.id);
    res.json({ activeSocketIds });
});


export default router;
