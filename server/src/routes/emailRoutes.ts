// External Imports
import express from "express";
import nodemailer from "nodemailer";

// Internal Imports
import { strongParams, generateResponse } from "../common/methods";
import { UserService } from "../services/UserService";
import { UserRepository } from "../repositories/UserRepository";

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

const config = {
  service: "gmail",
  auth: {
    user: process.env.GMAIL_APP_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
};

const router = express.Router();

router.post("/notify-new-events", async (req, res) => {
  const params = req.body;
  const allowedParams = ["donationEventName", "captionText"];
  const filteredParams = strongParams(params, allowedParams);

  const emailList = await userService.getAllDonorEmails();

  if (emailList.length === 0) {
    return generateResponse(res, 400, { message: "No recipients found" });
  }

  const transporter = nodemailer.createTransport(config);

  const message = {
    from: process.env.GMAIL_APP_USER,
    bcc: emailList.map((user) => user.email).join(","), // a list of emails
    subject: `[NEW EVENT] ${filteredParams.donationEventName}`,
    html: filteredParams.captionText,
  };

  transporter
    .sendMail(message)
    .then((info) => {
      return generateResponse(res, 201, {
        msg: "Email sent",
        info: info.messageId,
        preview: nodemailer.getTestMessageUrl(info),
      });
    })
    .catch((err) => {
      return generateResponse(res, 500, { message: err });
    });
});

export default router;
