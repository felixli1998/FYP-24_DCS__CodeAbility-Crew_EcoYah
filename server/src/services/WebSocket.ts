import express, { Router, Request, Response } from "express";
import { Server, Socket } from "socket.io";
// Define a map to store active connections by location
const activeConnections: Map<string, any[]> = new Map();

export function createLongPollingConnection(io: Server, location:string) {
    io.on("connection", (socket: Socket) => {
        console.log(`New connection: ${socket.id}`);
        
        // Add the new connection to the active connections map
        addSocketToLocation(socket, location); // Assign default location

        // Handle disconnection
        socket.on("disconnect", () => {
            console.log(`Disconnected: ${socket.id}`);
            // Remove the disconnected socket from the active connections map
            removeSocketFromAllLocations(socket.id);
        });
    });
}

// Function to add a socket to a location
function addSocketToLocation(socket: Socket, location: string) {
    if (!activeConnections.has(location)) {
        activeConnections.set(location, []);
    }
    const socketIds = activeConnections.get(location);
    if (socketIds) {
        socketIds.push(socket);
    }
}

// Function to remove a socket from all locations
function removeSocketFromAllLocations(socketId: string) {
    activeConnections.forEach((socketIds, location) => {
        const index = socketIds.indexOf(socketId);
        if (index !== -1) {
            socketIds.splice(index, 1);
            // If there are no more sockets in this location, remove it from the map
            if (socketIds.length === 0) {
                activeConnections.delete(location);
            }
        }
    });
}

export interface ISocketNotification{
    location: string;
    notificationData: any;
}

export function sendNotificationToConnections(data: ISocketNotification) {
    const { location, notificationData } = data;
    const socketIds = activeConnections.get(location);
    if (socketIds) {
        socketIds.forEach(socketId => {
            socketId.emit("notification", notificationData);
        });
    }
}
