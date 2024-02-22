// External Imports
import express from 'express';

// Internal Imports
import { generateResponse, strongParams } from "../common/methods";

import { DonationRequest } from "../entities/DonationRequest";
import { DonationRequestService } from "../services/DonationRequestService";
import { DonationRequestRepository } from '../repositories/DonationRequestRepository';

import { DonationRequestItem } from "../entities/DonationRequestItem";
import { DonationRequestItemService } from "../services/DonationRequestItemService";
import { DonationRequestItemRepository } from "../repositories/DonationRequestItemRepository";

import { UserService } from "../services/UserService";
import { UserRepository } from "../repositories/UserRepository";

import { DonationEventService } from "../services/DonationEventService";
import { DonationEventRepository } from "../repositories/DonationEventRepository";

import { DonationEventItemService } from "../services/DonationEventItemService";
import { DonationEventItemRepository } from "../repositories/DonationEventItemRepository";

export type RequestItemsPayloadT = {
  id: DonationRequestItem["id"];
  quantity: DonationRequestItem["quantity"];
};

export type DonationRequestUpdatePayload = {
  id: DonationRequest["id"];
  dropOffDate?: DonationRequest["dropOffDate"];
  dropOffTime?: DonationRequest["dropOffTime"];
  omitPoints?: DonationRequest["omitPoints"];
  requestItems?: RequestItemsPayloadT[];
};

const router = express.Router();

// Donation Request Service
const donationRequestRepository = new DonationRequestRepository();
const donationRequestService = new DonationRequestService(
  donationRequestRepository
);

// Donation Request Item Service
const donationRequestItemRepository = new DonationRequestItemRepository();
const donationRequestItemService = new DonationRequestItemService(
  donationRequestItemRepository
);

// User Service
const userRepository = new UserRepository();
const userServices = new UserService(userRepository);

// Donation Event Service
const donationEventRepository = new DonationEventRepository();
const donationEventService = new DonationEventService(
  donationEventRepository
);

// Donation Event Item Service
const donationEventItemRepository = new DonationEventItemRepository();
const donationEventItemService = new DonationEventItemService(
  donationEventItemRepository
);

router.get('/active-donation-requests', async (req, res) => {
  try {
    const params = req.query;
    const filterParams = strongParams(params, ['userId']);
    const { userId } = filterParams;

    // TODO: Ensure that the person requesting the donation request is the same as the user_id
    if (isNaN(userId)) return generateResponse(res, 400, 'ID should be a number');
    const { data, pagination } = await donationRequestService.getActiveDonationRequestFromUser(userId);
    return generateResponse(res, 200, data, pagination);
    }catch (error) {
      console.log(res)
      return generateResponse(res, 500, 'Something went wrong.');
    }
});

router.get('/completed-donation-requests', async (req, res) => {
  try {
    const params = req.query;
    const filterParams = strongParams(params, ['userId']);
    const { userId } = filterParams;
    // TODO: Ensure that the person requesting the donation request is the same as the user_id
    if (isNaN(userId)) return generateResponse(res, 400, 'ID should be a number');
    const { data, pagination } = await donationRequestService.getCompletedDonationRequestFromUser(userId);
    return generateResponse(res, 200, data, pagination);
    }catch (error) {
      return generateResponse(res, 500, 'Something went wrong.');
    }
});

router.post("/", async(req, res) => {
  // Assume that the request body contains an object of the fom
  // { request: {requestDetails}, eventId: 1, userId:1  }
  return generateResponse(res, 200, "Not implemented");
})

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

router.post('/create', async (req, res) => {
  // sanitize inputs
  const params = req.body; 
  const allowedEventParams = ['donationEventId', 'dropOffDate', 'dropOffTime', 'omitPoints', 'submittedBy', 'donationRequestItems'];
  const filteredEventParams = strongParams(params, allowedEventParams);

  try {
    const newDonationRequest = new DonationRequest();
    newDonationRequest.dropOffDate = filteredEventParams.dropOffDate;
    newDonationRequest.dropOffTime = filteredEventParams.dropOffTime;
    newDonationRequest.omitPoints = filteredEventParams.omitPoints;

    const donationEvent = await donationEventService.getDonationEventById(
      filteredEventParams.donationEventId
    );
    if (donationEvent) newDonationRequest.donationEvent = donationEvent;

    const user = await userServices.getUserById(filteredEventParams.submittedBy);
    if (user) newDonationRequest.user = user;

    const donationRequest = await donationRequestService.createDonationRequest(
      newDonationRequest
    );

    if (donationRequest) {
      for (const requestItem of filteredEventParams.donationRequestItems) {
        const newDonationRequestItem = new DonationRequestItem();
        newDonationRequestItem.quantity = requestItem.quantity;
        newDonationRequestItem.donationRequest = donationRequest;
        const donationEventItem =
          await donationEventItemService.retrieveDonationEventItemById(
            requestItem.donationEventItemId
          );
        if (donationEventItem)
          newDonationRequestItem.donationEventItem = donationEventItem;

        await donationRequestItemService.createDonationRequestItem(
          newDonationRequestItem
        );
      }
    }
   
    return generateResponse(res, 200, {
      action: true,
      message: "create_success",
    });
  } catch (error) {
    return generateResponse(res, 500, "Something went wrong.");
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

router.get('/retrieve-donation-request-count-by-event-id', async (req, res) => {
  const params = req.query;
  const filteredParams = strongParams(params, ['donationEventId']);
  const { donationEventId } = filteredParams;

  console.log("----------------donationEventId: ", donationEventId)
  console.log(typeof donationEventId)

  if(donationEventId === undefined || donationEventId === null || donationEventId === "") {
    return generateResponse(res, 400, 'Donation Event ID is required.');
  }
  try {
    const result = await donationRequestService.retrieveDonationRequestCountByEventId(parseInt(donationEventId));
    return generateResponse(res, 200, result);
  } catch (error) {
    return generateResponse(res, 500, 'Something went wrong.');
  }
});

export default router;
