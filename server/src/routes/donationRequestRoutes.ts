// External Imports
import express from 'express';

// Internal Imports
import { DonationRequestRepository } from '../repositories/DonationRequestRepository';
import { DonationRequestService } from '../services/DonationRequestService';
import { DonationRequest } from '../entities/DonationRequest';
import { UserRepository } from '../repositories/UserRepository';
import { UserService } from '../services/UserService';
import { DonationEventItemRepository } from '../repositories/DonationEventItemRepository';
import { generateResponse } from '../common/methods';
import { DonationRequestItem } from '../entities/DonationRequestItem';
import { DonationRequestItemRepository } from '../repositories/DonationRequestItemRepository';

const router = express.Router();

// Donation Request Service
const donationRequestRepository = new DonationRequestRepository();
const donationRequestService = new DonationRequestService(
  donationRequestRepository
);
// User Service
const userRepository = new UserRepository();
const userServices = new UserService(userRepository);
// Donation Event Item Service
const donationEventItemRepository = new DonationEventItemRepository();
// Donation Request Item Service
const donationRequestItemRepository = new DonationRequestItemRepository();

// TODO: This was created during model creation. Feel free to delete or expand it as needed
router.post('/test/create', async (req, res) => {
  try {
    const donationRequest = new DonationRequest();
    donationRequest.omitPoints = false;
    donationRequest.dropOffDate = new Date();
    donationRequest.dropOffTime = '12:00';

    const donationEventItem1 =
      await donationEventItemRepository.retrieveDonationEventItemById(1);
    const donationEventItem2 =
      await donationEventItemRepository.retrieveDonationEventItemById(2);

    const donationRequestItem1 = new DonationRequestItem();
    const donationRequestItem2 = new DonationRequestItem();
    donationRequestItem1.quantity = 5;
    donationRequestItem2.quantity = 2;

    if (donationEventItem1 && donationEventItem2) {
      donationRequestItem1.donationEventItem = donationEventItem1;
      donationRequestItem2.donationEventItem = donationEventItem2;
    }

    // Create donation request item
    await Promise.all([
      donationRequestItemRepository.createDonationRequestItem(
        donationRequestItem1
      ),
      donationRequestItemRepository.createDonationRequestItem(
        donationRequestItem2
      ),
    ]);

    const user = await userServices.getUserById(1);
    if (user) donationRequest.user = user;

    donationRequest.donationRequestItems = [
      donationRequestItem1,
      donationRequestItem2,
    ];

    const newDonationRequest =
      await donationRequestService.createDonationRequest(donationRequest);

    return generateResponse(res, 200, newDonationRequest);
  } catch (error) {
    console.error(error);
  }
});

// TODO: Created during model creation. Feel free to delete or expand as needed
router.post('/test/cancel', async (req, res) => {
  const params = req.body;
  const { id } = params;

  try {
    const result = await donationRequestRepository.cancelDonationRequest(id);
    return generateResponse(res, 200, result);
  } catch (error) {
    console.error(error);
  }
});

export default router;
