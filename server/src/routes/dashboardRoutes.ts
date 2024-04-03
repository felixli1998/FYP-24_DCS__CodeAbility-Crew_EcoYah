// External Imports
import express from "express";
import { Parser } from "@json2csv/plainjs";

// Internal Imports
import { generateResponse, strongParams } from "../common/methods";
import { DashboardService } from "../services/DashboardService";
import { DashboardRepository } from "../repositories/DashboardRepository";

const router = express.Router();
const dashboardRepository = new DashboardRepository();
const dashboardService = new DashboardService(dashboardRepository);

router.get("/get-popular-event", async (req, res) => {
  try {
    const result = await dashboardService.getPopularEvent();
    return generateResponse(res, 200, { data: result });
  } catch (error) {
    return generateResponse(res, 500, "Something went wrong");
  }
});

router.get("/get-popular-item", async (req, res) => {
  try {
    const result = await dashboardService.getPopularItem();
    return generateResponse(res, 200, { data: result });
  } catch (error) {
    return generateResponse(res, 500, "Something went wrong");
  }
});

router.get("/get-donation-requests", async (req, res) => {
  try {
    const result = await dashboardService.getDonationRequests();
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

router.get("/get-cashback-status", async (req, res) => {
  try {
    const result = await dashboardService.getCashbackStatus();
    return generateResponse(res, 200, { data: result });
  } catch (error) {
    return generateResponse(res, 500, "Something went wrong");
  }
});

router.post("/get-redeemed-cashback", async (req, res) => {
  try {
    const params = req.body;
    const allowedParams = ["startDate", "endDate"];
    const filteredParams = strongParams(params, allowedParams);

    if (!filteredParams)
      return generateResponse(res, 400, "Invalid Request Body");

    const result = await dashboardService.getRedeemedCashback(
      filteredParams.startDate,
      filteredParams.endDate,
    );
    return generateResponse(res, 200, { data: result });
  } catch (error) {
    return generateResponse(res, 500, "Something went wrong");
  }
});

router.post("/download-data-csv", async (req, res) => {
  try {
    const params = req.body;
    const allowedParams = ["fields", "data"];
    const filteredParams = strongParams(params, allowedParams);

    const json2csv = new Parser({ fields: filteredParams.fields });
    const csv = json2csv.parse(filteredParams.data);

    res.setHeader("Content-Type", "text/csv");
    res.attachment("redeemed_cashback_data.csv");
    res.status(200).send(csv);
  } catch (error) {
    return generateResponse(res, 500, "Something went wrong");
  }
});

export default router;
