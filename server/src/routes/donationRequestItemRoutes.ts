// External Imports
import express from 'express';

// Internal Imports
import { DonationRequestRepository } from '../repositories/DonationRequestRepository';
import { DonationRequestService } from '../services/DonationRequestService';
import { generateResponse, strongParams } from '../common/methods';
import { DonationRequestItemService } from '../services/DonationRequestItemService';
import { DonationRequestItemRepository } from '../repositories/DonationRequestItemRepository';

const router = express.Router();

// Donation Request Service
const donationRequestRepository = new DonationRequestRepository();
const donationRequestService = new DonationRequestService(
  donationRequestRepository
);

// Donation Request Item Service
const donationRequestItemRepository = new DonationRequestItemRepository();
const donationRequestItemService = new DonationRequestItemService(donationRequestItemRepository)

type RequestItemT = {
  donationEventItemId: number; // This is to associate donationEventItem
  quantity: number;
};

// Endpoint to create donation request item for an existing donation request //
router.post('/create-from-request', async (req, res) => {
  const payload = req.body;
  const allowedParams = ['donationRequestId', 'requestItems'];

  const sanitisedPayload = strongParams(payload, allowedParams);
  const { donationRequestId, requestItems } = sanitisedPayload as {
    donationRequestId: number;
    requestItems: RequestItemT[];
  };

  // Retrieve donation request
  const donationRequestObj =
    await donationRequestService.retrieveById(donationRequestId);

  if (!donationRequestObj) return generateResponse(res, 200, 'Invalid ID');

  const donationRequestItemsObj = await Promise.all(
    requestItems.map(async (requestItem) => {
      const requestItemObj =
        await donationRequestService.createNewDonationRequestItem(
          donationRequestObj,
          requestItem.donationEventItemId,
          requestItem.quantity
        );
      return requestItemObj;
    })
  );

  try {
      const payload = await Promise.all((donationRequestItemsObj.map(async (donationRequestItemObj) => {
        const createdDonationRequestItem = await donationRequestItemService.createDonationRequestItem(donationRequestItemObj)
        return createdDonationRequestItem;
      })))

    return generateResponse(res, 200, payload);
  } catch (err) {
    return generateResponse(res, 500, 'Something went wrong');
  }
});

export default router;
