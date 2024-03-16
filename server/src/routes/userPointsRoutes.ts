import express from "express";
import {generateResponse} from "../common/methods";
import {UserPointsRepository} from "../repositories/UserPointsRepository";
import {UserPointsService} from "../services/UserPointsService";
import {
  ISocketNotification,
  sendNotificationToConnections,
} from "../services/WebSocket";
import {TransactionHistoryService} from "../services/TransactionHistoryService";
import {TransactionHistoryRepository} from "../repositories/TransactionHistoryRepository";
import {Action} from "../entities/TransactionHistory";

const transactionHistoryRepository = new TransactionHistoryRepository();
const transactionHistoryService = new TransactionHistoryService(
  transactionHistoryRepository
);

const userPointsRepository = new UserPointsRepository();
const userPointsService = new UserPointsService(userPointsRepository);

const router = express.Router();

router.get("/:userId", async function (req, res) {
  const userId = parseInt(req.params.userId);
  try {
    const points = await userPointsService.getUserPoints(userId);
    return generateResponse(res, 200, {points: points});
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
  try {
    const currentPoints = await userPointsService.getUserPoints(userId);
    if (!currentPoints) {
      return generateResponse(res, 400, {
        message: "User does not have a points account",
      });
    }
    if (currentPoints.points < pointsToBeDeducted) {
      return generateResponse(res, 400, {
        message: "Insufficient points",
      });
    }
    // Makes a request to the polling thingy
    const data: ISocketNotification = {
      location: "default",
      notificationData: {
        userId: userId,
        name: currentPoints.user.name,
        points: pointsToBeDeducted,
      },
    };
    // TODO: Log the request into database
    const transactionHistory =
      await transactionHistoryService.createTransactionHistory(
        Action.REDEEMED,
        pointsToBeDeducted,
        userId
      );
    if (transactionHistory) {
      data.notificationData.transactionHistory = transactionHistory;
      sendNotificationToConnections(data);
      return generateResponse(res, 200, {
        message: "Request sent.",
      });
    }
    return generateResponse(res, 400, {
      message: "Failed to initiate cashback redemption",
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
  const transactionHistoryId = parseInt(req.body.transactionHistoryId);
  // Location is for logging purposes
  const location = req.body.location;
  const isAccept = true;

  try {
    const userPointsDeduction = await userPointsService.deductUserPoints(
      userId,
      pointsToBeDeducted
    );

    if (userPointsDeduction) {
        const transactionHistoryStatus =
          await transactionHistoryService.handleRedeemed(transactionHistoryId, isAccept);
        if (transactionHistoryStatus) {
            return generateResponse(res, 200, {
              message: "Points deducted successfully.",
            });
        }
    }
    return generateResponse(res, 400, {
        message: "Failed to handled cashback redemption acceptance.",
      });
  } catch (error) {
    return generateResponse(res, 500, {
      message: "Internal Server Error. Please refresh and try again.",
    });
  }
});

router.post("/reject-request", async function (req, res) {
    const transactionHistoryId = parseInt(req.body.transactionHistoryId);
    // Location is for logging purposes
    const location = req.body.location;
    const isAccept = false;
  
    try {
        const transactionHistoryStatus =
        await transactionHistoryService.handleRedeemed(transactionHistoryId, isAccept);
        if (transactionHistoryStatus) {
            return generateResponse(res, 200, {
                message: "Request rejected successfully.",
            });
        }
      return generateResponse(res, 400, {
          message: "Failed to handled cashback redemption rejection.",
        });
    } catch (error) {
      return generateResponse(res, 500, {
        message: "Internal Server Error. Please refresh and try again.",
      });
    }
});

export default router;
