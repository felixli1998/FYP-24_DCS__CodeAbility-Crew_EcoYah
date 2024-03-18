// External Imports
import nodemailer from "nodemailer";
import dayjs from "dayjs";

// Internal Imports
import { User } from "../entities/User";
import { DonationRequestRepository } from "../repositories/DonationRequestRepository";

const config = {
  service: "gmail",
  auth: {
    user: process.env.GMAIL_APP_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
};

export type emailResultItemType = [string, string, string];

export type emailResultType = Record<
  string,
  {
    name: string;
    donationEventName: string;
    dropOffDate: string;
    dropOffTime: string;
    items: emailResultItemType[];
  }
>;

export class EmailService {
  private donationRequestRepository: DonationRequestRepository;

  constructor(donationRequestRepository: DonationRequestRepository) {
    this.donationRequestRepository = donationRequestRepository;
  }

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

  async notifyDropOff(
  ) {
    const result: emailResultType = await this.donationRequestRepository.getDonationRequestsApproachingDeadline();
    console.log(result);
    const transporter = nodemailer.createTransport(config);

    try {
      for (const [email, donationRequest] of Object.entries(result)) {

        const { dropOffDate, dropOffTime, name, donationEventName, items } = donationRequest;

        const formattedDate = dayjs(dropOffDate).format('DD/MM/YYYY');

        const formattedItems = items.map((item) => {
          return `${item[0]} ${item[1]} of ${item[2]}`;
        }).join('<br>');

        const message = {
          from: process.env.GMAIL_APP_USER,
          to: email, 
          subject: "[REMINDER] Donation Drop-Off",
          html: `Dear ${name},<br><br>
            Please be reminded that your drop off for 
            ${donationEventName} is due on ${formattedDate} ${dropOffTime}.<br><br>
            Your donation request consists of:<br><br>
            ${formattedItems}<br><br>
            Thank you for your generosity.`,
        };
  
        console.log(message);

        await transporter.sendMail(message);
      }
  
      return true;
    } catch (err) {
      console.error("Error sending emails:", err);
      return false;
    }
  }
}
