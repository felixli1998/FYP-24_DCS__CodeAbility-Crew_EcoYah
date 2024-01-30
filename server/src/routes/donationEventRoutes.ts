// External Imports
import express from 'express';

// Internal Imports
import { strongParams, generateResponse } from '../common/methods';
import { DonationEvent } from '../entities/DonationEvent';
import { DonationEventRepository } from '../repositories/DonationEventRepository';
import { DonationEventService } from '../services/DonationEventService';
import { DonationEventItemRepository } from '../repositories/DonationEventItemRepository';
import { DonationEventItemService } from '../services/DonationEventItemService';
import { UserRepository } from '../repositories/UserRepository';
import { EventTypeRepository } from '../repositories/EventTypeRepository';
import { DonationEventItem } from '../entities/DonationEventItem';
import { Item } from '../entities/Item';
import { ItemRepository } from '../repositories/ItemRepository';
import { ItemService } from '../services/ItemService';

const router = express.Router();
const donationEventRepository= new DonationEventRepository();
const donationEventItemRepository= new DonationEventItemRepository();
const userRepository = new UserRepository();
const eventTypeRepository = new EventTypeRepository();
const itemRepository = new ItemRepository();
const donationEventService = new DonationEventService(donationEventRepository, donationEventItemRepository, userRepository, eventTypeRepository);
const donationEventItemService = new DonationEventItemService(donationEventItemRepository);

router.post('/create', async (req, res) => {
    try {
        // sanitize inputs
        const params = req.body; 
        const allowedEventParams = ['name', 'imageId',  'startDate', 'endDate', 'isActive', 'createdBy', 'eventType', 'donationEventItems'];
        const filteredEventParams = strongParams(params, allowedEventParams);

        // create new object to avoid typing errors
        const newDonationEvent = new DonationEvent();
        newDonationEvent.name = filteredEventParams.name;
        newDonationEvent.imageId = filteredEventParams.imageId;
        newDonationEvent.startDate = filteredEventParams.startDate;
        newDonationEvent.endDate = filteredEventParams.endDate;
        newDonationEvent.isActive = filteredEventParams.isActive;

        const createdByUser = await userRepository.getUserById(filteredEventParams.createdBy);
        const eventType = await eventTypeRepository.retrieveEventTypeById(filteredEventParams.eventType);

        if (createdByUser && eventType) {
            newDonationEvent.createdBy = createdByUser;
            newDonationEvent.eventType = eventType;
        }
          
        // Handle donationEventItems
        const newDonationEventItems = filteredEventParams.donationEventItems.map(async (donationEventItem: { item: Item; targetQty: number; minQty: number; pointsPerUnit: number; }) => {
            const newItem = new DonationEventItem();
            // const item = await itemRepository.getItemById(donationEventItem.item);
            // if (item) {
            //     newItem.item = item;
            // } 
            newItem.item = donationEventItem.item;
            newItem.targetQty = donationEventItem.targetQty;
            newItem.minQty = donationEventItem.minQty;
            newItem.pointsPerUnit = donationEventItem.pointsPerUnit;
            return newItem;
        });

        newDonationEvent.donationEventItems = newDonationEventItems;

        console.log(newDonationEvent);

        // calling the service layer
        const status1 = await donationEventService.createDonationEvent(newDonationEvent);
        const status2 = await donationEventItemService.createDonationEventItem(newDonationEventItems);

        return generateResponse(res, 200, { action: true, message: 'create_success' });
      } catch (error) {
        return generateResponse(res, 500, "Something went wrong");
      }
});

export default router;