import express from "express";
import { TransactionHistoryRepository } from "../repositories/TransactionHistoryRepository";
import { TransactionHistoryService } from "../services/TransactionHistoryService";
import { generateResponse, strongParams } from "../common/methods";

const transactionHistoryRepository = new TransactionHistoryRepository();
const transactionHistoryService = new TransactionHistoryService(transactionHistoryRepository);

const router = express.Router();

router.get("/get-transaction-history", async (req, res) => {
    try {
        const params = req.query;
        const filterParams = strongParams(params, ["userId", "action"]);
        const { userId, action } = filterParams;

        let transactionHistory;
        if (action) {
            transactionHistory = await transactionHistoryService.getTransactionHistoryByAction(userId, action);
        } else {
            transactionHistory = await transactionHistoryService.getTransactionHistoryByAction(userId);
        }
        return generateResponse(res, 200, { action: true, message: transactionHistory });
    } catch (error) {
        return generateResponse(res, 500, {
        action: false,
        message: "Internal Server Error. Please refresh and try again.",
        });
    }
});

export default router;

