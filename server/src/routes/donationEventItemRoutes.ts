import express from "express";

import {generateResponse, strongParams} from "../common/methods";
import { DonationEventItemService } from "../services/DonationEventItemService";
import { DonationEventItemRepository } from '../repositories/DonationEventItemRepository';


const router = express.Router();
const donationEventItemRepository= new DonationEventItemRepository();
const donationEventItemService = new DonationEventItemService(donationEventItemRepository);

router.get('/items-by-donation-event-id', async (req, res) => {
  try {
    const params = req.query;
    const allowedParams = ["donationEventId"];
    const filteredParams = strongParams(params, allowedParams);

    const {donationEventId} = filteredParams;
    if (!donationEventId || donationEventId.toString().trim() === "") {
      return generateResponse(res, 400, {
        message: "Donation event id parameter is required",
      });
    }

    const donationEventItems = await donationEventItemService.getDonationEventItembyDonationEventId(donationEventId);
    return generateResponse(res, 200, {donationEventItems});
  } catch (error) {
    console.error(error);
    return generateResponse(res, 500, {
      error: "Failed to retrieve items by donation event id",
    });
  }
});

export default router;
