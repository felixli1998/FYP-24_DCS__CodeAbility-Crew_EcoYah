import express from "express";

// Internal Imports
import { generateResponse, strongParams } from "../common/methods";
import { TransactionHistoryRepository } from "../repositories/TransactionHistoryRepository";
import { TransactionHistoryService } from "../services/TransactionHistoryService";

const transactionHistoryRepository = new TransactionHistoryRepository();
const transactionHistoryService = new TransactionHistoryService(
  transactionHistoryRepository
);

const router = express.Router();

router.get("/pending-cashback-requests", async function (req, res) {
  try {
    const cashbackRequests =
      await transactionHistoryService.getCashbackRequests();
    return generateResponse(res, 200, {
      action: true,
      data: cashbackRequests,
    });
  } catch (error) {
    return generateResponse(res, 500, {
      action: false,
      message: "Internal Server Error. Please refresh and try again.",
    });
  }
});

router.get("/get-transaction-history", async (req, res) => {
  try {
    const params = req.query;
    const filterParams = strongParams(params, ["userId", "action"]);
    const { userId, action } = filterParams;

    let transactionHistory;
    if (action) {
      transactionHistory =
        await transactionHistoryService.getTransactionHistoryByAction(
          userId,
          action
        );
    } else {
      transactionHistory =
        await transactionHistoryService.getTransactionHistoryByAction(userId);
    }
    return generateResponse(res, 200, {
      action: true,
      message: transactionHistory,
    });
  } catch (error) {
    return generateResponse(res, 500, {
      action: false,
      message: "Internal Server Error. Please refresh and try again.",
    });
  }
});

export default router;
