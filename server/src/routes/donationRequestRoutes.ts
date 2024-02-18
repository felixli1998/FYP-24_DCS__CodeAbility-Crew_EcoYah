// External Imports
import express from 'express';

// Internal Imports
import { DonationRequestRepository } from '../repositories/DonationRequestRepository';
import { DonationRequestService } from '../services/DonationRequestService';
import { DonationRequest } from '../entities/DonationRequest';
import { UserRepository } from '../repositories/UserRepository';
import { UserService } from '../services/UserService';
import { DonationEventItemRepository } from '../repositories/DonationEventItemRepository';
import { generateResponse, strongParams } from '../common/methods';
import { DonationRequestItem } from '../entities/DonationRequestItem';
import { DonationRequestItemRepository } from '../repositories/DonationRequestItemRepository';
import { DonationRequestItemService } from '../services/DonationRequestItemService';
import { DonationEventItemService } from '../services/DonationEventItemService';
import { DonationEventService } from '../services/DonationEventService';
import { DonationEventRepository } from '../repositories/DonationEventRepository';

export type RequestItemsPayloadT = {
  id: DonationRequestItem['id'];
  quantity: DonationRequestItem['quantity']
}

export type DonationRequestUpdatePayload = {
  id: DonationRequest['id'];
  dropOffDate?: DonationRequest['dropOffDate'];
  dropOffTime?: DonationRequest['dropOffTime'];
  omitPoints?: DonationRequest['omitPoints'];
  requestItems?: RequestItemsPayloadT[];
};

const router = express.Router();

// Donation Request Service
const donationRequestRepository = new DonationRequestRepository();
const donationRequestService = new DonationRequestService(
  donationRequestRepository
);
// User Service
const userRepository = new UserRepository();
const userServices = new UserService(userRepository);

// DonationEventService
const donationEventRepository = new DonationEventRepository();
const donationEventService = new DonationEventService(
  donationEventRepository
);

// Donation Event Item Service
const donationEventItemRepository = new DonationEventItemRepository();
const donationEventItemService = new DonationEventItemService(
  donationEventItemRepository
);

// Donation Request Item Service
const donationRequestItemRepository = new DonationRequestItemRepository();
const donationRequestItemService = new DonationRequestItemService(
  donationRequestItemRepository
);

router.post('/create', async (req, res) => {
  // sanitize inputs
  const params = req.body; 
  const allowedEventParams = ['donationEventId', 'dropOffDate', 'dropOffTime', 'omitPoints', 'submittedBy', 'donationRequestItems'];
  const filteredEventParams = strongParams(params, allowedEventParams);

  try {
    const donationRequest = new DonationRequest();
    donationRequest.dropOffDate = filteredEventParams.dropOffDate;
    donationRequest.dropOffTime = filteredEventParams.dropOffTime;
    donationRequest.omitPoints = filteredEventParams.omitPoints;

    const donationEvent = await donationEventService.getDonationEventById(filteredEventParams.donationEventId);
    if (donationEvent) donationRequest.donationEvent = donationEvent;

    const user = await userServices.getUserById(filteredEventParams.submittedBy);
    if (user) donationRequest.user = user;

    const newDonationRequest =
      await donationRequestService.createDonationRequest(donationRequest);

    return generateResponse(res, 200, newDonationRequest);
  } catch (error) {
    return generateResponse(res, 500, "Something went wrong.");
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

// TODO: Retrieve by request id
router.get('/retrieve-by-id', async (req, res) => {
  const params = req.query;
  const filterParams = strongParams(params, ['id']);
  const { id } = filterParams;

  try {
    const result = await donationRequestService.retrieveById(id);

    return generateResponse(res, 200, result);
  } catch (err) {
    return generateResponse(res, 500, 'Something went wrong.');
  }
});

router.get('/retrieve-active-by-date', async (req, res) => {
  const params = req.query;
  const filteredParams = strongParams(params, ['date']);
  const { date } = filteredParams;

  try {
    const result =
      await donationRequestService.retrieveDonationRequestByDate(
        new Date(date as string)
      );

    return generateResponse(res, 200, result);
  } catch (error) {
    return generateResponse(res, 500, 'Something went wrong.');
  }
});

router.put('/update', async (req, res) => {
  const payload = req.body;
  const allowedParams = ['id', 'dropOffDate', 'dropOffTime', 'requestItems', 'omitPoints'];
  const sanitisedPayload = strongParams(payload, allowedParams);

  if (!('id' in sanitisedPayload))
    return generateResponse(res, 200, 'Missing id');

  type DonationRequestUpdatePayloadWithId = DonationRequestUpdatePayload & {
    id: string;
  };

  try {
    // Type assertion that an id is definitely present due to my previous checks
    const payload = await donationRequestService.update(
      sanitisedPayload as DonationRequestUpdatePayloadWithId
    );
    return generateResponse(res, 200, payload);
  } catch (err) {
    return generateResponse(res, 500, 'Something went wrong');
  }
});

router.put('/complete', async (req, res) => {
  const payload = req.body;
  const allowedParams = ['id'];
  const sanitisedPayload = strongParams(payload, allowedParams);

  if (!('id' in sanitisedPayload))
    return generateResponse(res, 200, 'Missing id');

  const { id } = sanitisedPayload;

  try {
    const payload = await donationRequestService.completeDonationRequest(id);

    return generateResponse(res, 200, 'Updated successfully!');
  } catch (error) {
    return generateResponse(res, 500, 'Something went wrong');
  }
});

export default router;
