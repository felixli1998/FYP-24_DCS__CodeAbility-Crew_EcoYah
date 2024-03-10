// External Imports
import express from "express";

import { TransactionHistoryRepository } from "../repositories/TransactionHistoryRepository";
import { TransactionHistoryService } from "../services/TransactionHistoryService";
import { generateResponse } from "../common/methods";

const router = express.Router();
const transactionHistoryRepository = new TransactionHistoryRepository();
const transactionHistoryService = new TransactionHistoryService(transactionHistoryRepository);

router.get('/test', async (req, res) => {
  const data = await transactionHistoryService.getExpiringDateForEachUser();

  return generateResponse(res, 200, { data });
});

export default router;