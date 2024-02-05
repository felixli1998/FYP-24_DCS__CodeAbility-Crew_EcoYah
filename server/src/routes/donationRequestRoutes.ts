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

// TODO: This was creating during model creation. Feel free to delete or expand it as needed
router.post('/test/create', async (req, res) => {
  try {
    const donationRequest = new DonationRequest();
    donationRequest.quantity = 1;
    donationRequest.omitPoints = false;
    donationRequest.dropOffDate = new Date();
    donationRequest.dropOffTime = '12:00';

    const user = await userServices.getUserById(1);
    const donationEventItem =
      await donationEventItemRepository.retrieveDonationEventItemById(1);

    if (user) donationRequest.user = user;
    if (donationEventItem)
      donationRequest.donationEventItem = donationEventItem;
    const newDonationRequest =
      await donationRequestService.createDonationRequest(donationRequest);

    return generateResponse(res, 200, newDonationRequest);
  } catch (error) {
    console.error(error);
  }
});

// TODO: This was creating during model creation. Feel free to delete or expand it as needed
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
