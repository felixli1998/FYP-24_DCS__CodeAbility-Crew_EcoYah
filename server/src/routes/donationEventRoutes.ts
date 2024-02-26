// External Imports
import express from "express";

// Internal Imports
import { strongParams, generateResponse } from "../common/methods";
import { DonationEventRepository } from "../repositories/DonationEventRepository";
import { DonationEventService } from "../services/DonationEventService";
import { DonationEvent } from "../entities/DonationEvent";
import { DonationEventItem } from "../entities/DonationEventItem";
import { DonationEventItemRepository } from "../repositories/DonationEventItemRepository";
import { DonationEventItemService } from "../services/DonationEventItemService";
import { UserRepository } from "../repositories/UserRepository";
import { ItemRepository } from "../repositories/ItemRepository";

const router = express.Router();
const donationEventRepository = new DonationEventRepository();
const donationEventService = new DonationEventService(donationEventRepository);
const donationEventItemRepository = new DonationEventItemRepository();
const userRepository = new UserRepository();
const itemRepository = new ItemRepository();
const donationEventItemService = new DonationEventItemService(
  donationEventItemRepository,
);

export type DonationEventUpdatePayload = {
  name?: DonationEvent["name"];
  imageId?: DonationEvent["imageId"];
  startDate?: DonationEvent["startDate"];
  endDate?: DonationEvent["endDate"];
  isActive?: DonationEvent["isActive"];
  donationEventItems?: Partial<DonationEventItem>[];
};
interface DonationEventFilterParams {
  startDate?: string;
  endDate?: string;
  createdBy?: string;
  eventType?: string;
  name?: string;
  isActive?: string;
}

router.get("/all", async (req, res) => {
  // Check if req.query is empty
  let pageNumber = parseInt(req.query["pageNumber"] as string);
  if (isNaN(pageNumber)) {
    pageNumber = 1;
  }

  const queryKeys = Object.keys(req.query);
  if (
    queryKeys.length == 0 ||
    (queryKeys.length == 1 && queryKeys[0] == "pageNumber")
  ) {
    // This handles getting all donationEvents
    const { data, pagination } =
      await donationEventService.getAllDonationEvents(pageNumber);
    // Return donationEvents
    return generateResponse(res, 200, data, pagination);
  }

  const filters: DonationEventFilterParams = {
    startDate: req.query["startDate"] as string,
    endDate: req.query["endDate"] as string,
    createdBy: req.query["createdBy"] as string,
    eventType: req.query["eventType"] as string,
    name: req.query["name"] as string,
    isActive: req.query["isActive"] as string,
  };
  console.log("******* FILTERS [START]: ********");
  console.log(filters);
  console.log("******* FILTERS [END]: ********");

  try {
    const { data, pagination } =
      await donationEventService.getFilteredDonationEvents(filters, pageNumber);
    // Return donationEvents
    return generateResponse(res, 200, data, pagination);
  } catch (error) {
    return generateResponse(res, 500, "Something went wrong.");
  }
});

router.get(`/:id`, async (req, res) => {
  try {
    const id = req.params.id;
    if (id) {
      const parsedId = parseInt(id);
      // Ensure that ID is a number
      if (isNaN(parsedId))
        return generateResponse(res, 400, "ID should be a number!");
      const donationEvent =
        await donationEventService.getDonationEventById(parsedId);
      // Handle if donationEvent is null
      if (!donationEvent)
        return generateResponse(res, 404, "Donation Event not found!");
      // Return donationEvent
      return generateResponse(res, 200, donationEvent);
    }
  } catch (error) {
    return generateResponse(res, 500, "Something went wrong.");
  }
});

router.post("/create", async (req, res) => {
  try {
    // sanitize inputs
    const params = req.body;
    const allowedEventParams = [
      "name",
      "imageId",
      "startDate",
      "endDate",
      "isActive",
      "createdBy",
      "donationEventItems",
    ];
    const filteredEventParams = strongParams(params, allowedEventParams);

    // create new DonationEvent object to avoid typing errors
    const newDonationEvent = new DonationEvent();
    newDonationEvent.name = filteredEventParams.name;
    newDonationEvent.imageId = filteredEventParams.imageId;
    newDonationEvent.startDate = filteredEventParams.startDate;
    newDonationEvent.endDate = filteredEventParams.endDate;
    newDonationEvent.isActive = filteredEventParams.isActive;

    // get the existing User by Id
    const createdByUser = await userRepository.getUserById(
      filteredEventParams.createdBy,
    );

    // apply association to User
    if (createdByUser) {
      newDonationEvent.createdBy = createdByUser;
    }

    // get the existing Item(s) by Id and create new DonationEventItem objects
    const newDonationEventItems: any = await Promise.all(
      filteredEventParams.donationEventItems.map(
        async (donationEventItem: any) => {
          const newItem = new DonationEventItem();
          const item = await itemRepository.getItemById(
            donationEventItem.item.id,
          );
          if (item) {
            // apply association to Item
            newItem.item = item;
          }
          newItem.targetQty = donationEventItem.targetQty;
          newItem.minQty = donationEventItem.minQty;
          newItem.pointsPerUnit = donationEventItem.pointsPerUnit;

          return newItem;
        },
      ),
    );

    // apply association to DonationEventItem
    newDonationEvent.donationEventItems = newDonationEventItems;

    const donationEventResult =
      await donationEventService.createDonationEvent(newDonationEvent);

    for (const item of newDonationEventItems) {
      // apply association to DonationEvent
      item.donationEvent = donationEventResult;
      await donationEventItemService.createDonationEventItem(item);
    }

    return generateResponse(res, 200, {
      action: true,
      message: "create_success",
    });
  } catch (error) {
    if (error instanceof Error) {
      return generateResponse(res, 400, error.message);
    }

    return generateResponse(res, 500, "Internal Server Error");
  }
});

router.put(`/:id`, async (req, res) => {
  // Handle if ID is not supplied
  const id = req.params.id;
  if (!id) return generateResponse(res, 400, "ID is required!");

  const { updateParams: payload } = req.body;
  const allowedParams = [
    "name",
    "imageId",
    "startDate",
    "endDate",
    "isActive",
    "donationEventItems",
  ];
  const sanitisedPayload = strongParams(payload, allowedParams);

  try {
    const payload = await donationEventService.updateDonationEventV1(
      parseInt(id),
      sanitisedPayload as DonationEventUpdatePayload,
    );

    return generateResponse(res, 200, payload);
  } catch (err) {
    console.log(err);

    return generateResponse(res, 500, "Something went wrong!");
  }
});

export default router;
