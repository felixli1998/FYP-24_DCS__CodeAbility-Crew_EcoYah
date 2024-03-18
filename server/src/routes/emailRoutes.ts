// External Imports
import express from "express";
import nodemailer from 'nodemailer';

// Internal Imports
import { strongParams, generateResponse } from "../common/methods";

const router = express.Router();

router.post("/notify-new-events", async (req, res) => {
    const params = req.body;
    const allowedParams = ["email", "donationEventName", "captionText"];
    const filteredParams = strongParams(params, allowedParams);

    const config = {
        service: 'gmail', 
        auth: {
            user: process.env.GMAIL_APP_USER,   
            pass: process.env.GMAIL_APP_PASSWORD 
        }
    }
    const transporter = nodemailer.createTransport(config);

    const message = {
        from: process.env.GMAIL_APP_USER,
        to: filteredParams.email, // can be a list of emails
        subject: `[NEW EVENT] ${filteredParams.donationEventName}`, 
        html: filteredParams.captionText, 
    };

    transporter.sendMail(message).then((info) => {
        return generateResponse(res, 201,  {
            msg: "Email sent",
            info: info.messageId,
            preview: nodemailer.getTestMessageUrl(info)
        });
    }).catch((err) => {
        return generateResponse(res, 500, { message: err });
    }
    );
})

export default router;
