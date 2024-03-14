import express from "express";
import { generateResponse } from "../common/methods";
import { UserPointsRepository } from "../repositories/UserPointsRepository";
import { UserPointsService } from "../services/UserPointsService";
import { ISocketNotification, sendNotificationToConnections } from "../services/WebSocket";

const userPointsRepository = new UserPointsRepository();
const userPointsService = new UserPointsService(userPointsRepository);

const router = express.Router();

router.get("/:userId", async function (req, res) {
    const userId = parseInt(req.params.userId);
    try {
        const points = await userPointsService.getUserPoints(userId);
        return generateResponse(res, 200, { points: points });
    } catch (error) {
        return generateResponse(res, 500, {
            message: "Internal Server Error. Please refresh and try again.",
        });
    }
});

router.post("/request", async function (req, res) {
    // Makes a request
    const userId = parseInt(req.body.userId);
    const pointsToBeDeducted = parseInt(req.body.points);
    try{
        const currentPoints = await userPointsService.getUserPoints(userId);
        if (!currentPoints) {
            return generateResponse(res, 400, {
                message: "User does not have a points account",
            });
        };
        if (currentPoints.points < pointsToBeDeducted) {
            return generateResponse(res, 400, {
                message: "Insufficient points",
            });
        };
        // Makes a request to the polling thingy
        const data: ISocketNotification = {
            location: "default",
            notificationData: {
                userId: userId,
                name: currentPoints.user.name,
                points: pointsToBeDeducted,
            }
        };
        // TODO: Log the request into database
        sendNotificationToConnections(data)

        return generateResponse(res, 200, {
            message: "Request sent.",
        });

    } catch (error) {
        return generateResponse(res, 500, {
            message: "Internal Server Error. Please refresh and try again.",
        });
    }

});

router.post("/accept-request", async function (req, res) {
    const userId = parseInt(req.body.userId);
    const pointsToBeDeducted = parseInt(req.body.points);
    // Location is for logging purposes
    const location = req.body.location;
    try{
        // TODO: First, verify if the request has been completed in the database. If yes, throw error.
        const _ = await userPointsService.deductUserPoints(userId, pointsToBeDeducted);
        // TODO: Update the request status in the database
        return generateResponse(res, 200,  {
            message: "Points deducted successfully."
        })
    } catch (error) {
        return generateResponse(res, 500, {
            message: "Internal Server Error. Please refresh and try again.",
        });
    }
});

router.post("/reject-request", async function (req, res) {
    // TODO: First, verify if the request has been completed in the database. If yes, throw error.
    // TODO: Update the request status in the database
    const userId = parseInt(req.body.userId);
    const pointsToBeDeducted = parseInt(req.body.points);
    // Location is for logging purposes
    const location = req.body.location;
    return generateResponse(res, 200,  {
        message: "Request rejected successfully."
    })
});




export default router;
