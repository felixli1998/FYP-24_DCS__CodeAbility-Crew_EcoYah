// External Imports
import express from "express";

import { TransactionHistoryRepository } from "../repositories/TransactionHistoryRepository";
import { TransactionHistoryService } from "../services/TransactionHistoryService";
import { generateResponse } from "../common/methods";
import { UserPointsService } from "../services/UserPointsService";
import { UserPointsRepository } from "../repositories/UserPointsRepository";

const router = express.Router();
const transactionHistoryRepository = new TransactionHistoryRepository();
const transactionHistoryService = new TransactionHistoryService(transactionHistoryRepository);

const userPointsService = new UserPointsService(new UserPointsRepository());

router.get('/test', async (req, res) => {
  const data = await transactionHistoryService.getExpiringDateForEachUser();
  const test = await userPointsService.expireUserPoints();

  return generateResponse(res, 200, { data });
});

export default router;