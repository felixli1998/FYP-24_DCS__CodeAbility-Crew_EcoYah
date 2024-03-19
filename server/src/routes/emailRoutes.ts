// External Imports
import express from "express";

// Internal Imports
import { strongParams, generateResponse } from "../common/methods";
import { UserService } from "../services/UserService";
import { UserRepository } from "../repositories/UserRepository";
import { DonationRequestRepository } from "../repositories/DonationRequestRepository";
import { EmailService } from "../services/EmailService";

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

const donationRequestRepository = new DonationRequestRepository();
const emailService = new EmailService(donationRequestRepository);

const router = express.Router();

router.post("/notify-new-events", async (req, res) => {
  const params = req.body;
  const allowedParams = ["donationEventName", "captionText"];
  const filteredParams = strongParams(params, allowedParams);

  const emailList = await userService.getAllDonorEmails();

  if (emailList.length === 0) {
    return generateResponse(res, 400, { message: "No recipients found" });
  }

  const response = await emailService.notifyNewEvents(
    emailList,
    filteredParams.donationEventName,
    filteredParams.captionText,
  );

  if (response)
    return generateResponse(res, 201, {
      message: "Emails sent successfully!",
    });
  else return generateResponse(res, 500, { message: "Internal Server Error" });
});

// for testing purposes, will remove after PR is approved
router.post("/notify-drop-offs", async (req, res) => {
  const response = await emailService.notifyDropOffs();

  if (response)
    return generateResponse(res, 201, {
      message: "Emails sent successfully!",
    });
  else return generateResponse(res, 500, { message: "Internal Server Error" });
});

export default router;
