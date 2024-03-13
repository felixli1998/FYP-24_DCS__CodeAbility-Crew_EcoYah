// External Imports
import express from "express";

// Internal Imports
import { generateResponse } from "../common/methods";

import { DashboardService } from "../services/DashboardService";
import { DashboardRepository } from "../repositories/DashboardRepository";

const router = express.Router();
const dashboardRepository = new DashboardRepository();
const dashboardService = new DashboardService(dashboardRepository);

router.get("/get-popular-event", async (req, res) => {
  try {
    const result = await dashboardService.getPopularEventToDate();
    return generateResponse(res, 200, { data: result });
  } catch (error) {
    return generateResponse(res, 500, "Something went wrong");
  }
});

router.get("/get-popular-item", async (req, res) => {
  try {
    const result = await dashboardService.getPopularItemToDate();
    return generateResponse(res, 200, { data: result });
  } catch (error) {
    return generateResponse(res, 500, "Something went wrong");
  }
});

router.get("/get-events-by-month/:month", async (req, res) => {
  try {
    const month = req.params.month;
    if (!month) return generateResponse(res, 400, "Invalid Month");

    const result = await dashboardService.getEventsByMonth(month);
    return generateResponse(res, 200, { data: result });
  } catch (error) {
    return generateResponse(res, 500, "Something went wrong");
  }
});

router.get("/get-items-by-month/:month", async (req, res) => {
  try {
    const month = req.params.month;
    if (!month) return generateResponse(res, 400, "Invalid Month");

    const result = await dashboardService.getItemsByMonth(month);
    return generateResponse(res, 200, { data: result });
  } catch (error) {
    return generateResponse(res, 500, "Something went wrong");
  }
});

router.get("/get-preferred-drop-off", async (req, res) => {
  try {
    const result = await dashboardService.getPreferredDropOff();
    return generateResponse(res, 200, { data: result });
  } catch (error) {
    return generateResponse(res, 500, "Something went wrong");
  }
});

export default router;
