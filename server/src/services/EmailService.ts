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
    const result = await this.donationRequestRepository.getDonationRequestsApproachingDeadline();
    console.log(result);
    const transporter = nodemailer.createTransport(config);

    try {
      for (const donationRequest of result) {

        const { drop_off_date, drop_off_time, user_name, user_email, donation_event_name, quantity, item, unit } = donationRequest;

        const formattedDate = dayjs(drop_off_date).format('DD/MM/YYYY');

        const message = {
          from: process.env.GMAIL_APP_USER,
          to: user_email, 
          subject: "[REMINDER] Donation Drop-Off",
          html: `Dear ${user_name},<br><br>
            Please be reminded that your drop off for 
            ${donation_event_name} is due on ${formattedDate} ${drop_off_time}.<br><br>
            Thank you.`,
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
