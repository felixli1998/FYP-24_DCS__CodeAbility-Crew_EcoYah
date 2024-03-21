// Internal Imports
import { UserPointsRepository } from "../repositories/UserPointsRepository";
import { UserPointsService } from "../services/UserPointsService";
import { DonationRequestRepository } from "../repositories/DonationRequestRepository";
import { EmailService } from "../services/EmailService";

const testMethod = () => {
  console.log(`This is a cron job that runs 15 second!: ${new Date()}`);
};

const checkForExpiringPoints = () => {
  console.log("Checking for expiring points...");
  const userPointsRepository = new UserPointsRepository();
  const userPointsService = new UserPointsService(userPointsRepository);

  userPointsService.expireUserPoints();
};

const checkForDonationDropOffs = () => {
  console.log("Checking for donation drop offs...");
  const donationRequestRepository = new DonationRequestRepository();
  const emailService = new EmailService(donationRequestRepository);

  emailService.notifyDropOffs();
};

export const scheduledMethods = [
  {
    method: testMethod,
    unixFormat: "*/15 * * * * *",
    description: "This is simple log method that runs every 15 seconds",
  },
  {
    method: checkForExpiringPoints,
    unixFormat: "0 59 23 * * *",
    description:
      "This is a cron job that runs at 23:59 daily to check for expiring userPoints",
  },
  {
    method: checkForDonationDropOffs,
    unixFormat: "0 59 23 * * *",
    description:
      "This is a cron job that runs at 23:59 daily to check for donation drop offs",
  },
];
