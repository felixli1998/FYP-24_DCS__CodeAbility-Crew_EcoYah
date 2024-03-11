// External Imports
import express from "express";

// Internal Imports
import { generateResponse } from "../common/methods";

import { DashboardService } from "../services/DashboardService";
import { DashboardRepository } from "../repositories/DashboardRepository";

const router = express.Router();
const dashboardRepository = new DashboardRepository();
const dashboardService = new DashboardService(dashboardRepository);

router.get("/getPopularEventToDate", async (req, res) => {
  try {
    const result = await dashboardService.getPopularEventToDate();
    return generateResponse(res, 200, { data: result });
  } catch (error) {
    return generateResponse(res, 500, "Something went wrong");
  }
});

router.get("/getPopularItemToDate", async (req, res) => {
  try {
    const result = await dashboardService.getPopularItemToDate();
    return generateResponse(res, 200, { data: result });
  } catch (error) {
    return generateResponse(res, 500, "Something went wrong");
  }
});

export default router;
