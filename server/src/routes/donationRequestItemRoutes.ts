// External Imports
import express from 'express';

// Internal Imports
import { DonationRequestRepository } from '../repositories/DonationRequestRepository';
import { DonationRequestService } from '../services/DonationRequestService';
import { generateResponse, strongParams } from '../common/methods';

const router = express.Router();

// Donation Request Service
const donationRequestRepository = new DonationRequestRepository();
const donationRequestService = new DonationRequestService(
  donationRequestRepository
);

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

  console.log(sanitisedPayload);
  // Retrieve donation request
  const donationRequestObj =
    await donationRequestService.retrieveById(donationRequestId);

  if (!donationRequestObj) return generateResponse(res, 200, 'Invalid ID');

  // TODO: Could look into refactoring this out to a service instead //
  const donationRequestItemsObj = await Promise.all(
    requestItems.map(async (requestItem) => {
      const requestItemObj =
        await donationRequestService.createNewDonationRequestItem(
          requestItem.donationEventItemId,
          requestItem.quantity
        );
      return requestItemObj;
    })
  );

  try {
    donationRequestObj.donationRequestItems = donationRequestItemsObj;
    // TODO: updateDonationRequest and createDonationRequest are practically the same. But for semantic purposes
    const payload =
      await donationRequestService.updateDonationRequest(donationRequestObj);

    return generateResponse(res, 200, payload);
  } catch (err) {
    return generateResponse(res, 500, 'Something went wrong');
  }
});

export default router;
