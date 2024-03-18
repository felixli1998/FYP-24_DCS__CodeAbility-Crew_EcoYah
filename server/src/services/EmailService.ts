// External Imports
import nodemailer from "nodemailer";

// Internal Imports
import { User } from "../entities/User";

const config = {
  service: "gmail",
  auth: {
    user: process.env.GMAIL_APP_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
};

export class EmailService {
  async notifyNewEvents(
    emailList: User[],
    donationEventName: string,
    captionText: string,
  ) {
    const transporter = nodemailer.createTransport(config);

    const message = {
      from: process.env.GMAIL_APP_USER,
      bcc: emailList.map((user) => user.email).join(","), // a list of emails
      subject: `[NEW EVENT] ${donationEventName}`,
      html: captionText,
    };

    try {
      await transporter.sendMail(message);
      return true;
    } catch (err) {
      console.error("Error sending email:", err);
      return false;
    }
  }
}
