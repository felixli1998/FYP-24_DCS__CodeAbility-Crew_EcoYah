// External Imports
import express from 'express';

// Internal Imports
import { strongParams, generateResponse } from '../common/methods';
import { DonationEvent } from '../entities/DonationEvent';
import { DonationEventRepository } from '../repositories/DonationEventRepository';
import { DonationEventService } from '../services/DonationEventService';
import { DonationEventItem } from '../entities/DonationEventItem';
import { DonationEventItemRepository } from '../repositories/DonationEventItemRepository';
import { DonationEventItemService } from '../services/DonationEventItemService';
import { UserRepository } from '../repositories/UserRepository';
import { EventTypeRepository } from '../repositories/EventTypeRepository';
import { ItemRepository } from '../repositories/ItemRepository';


const router = express.Router();
const donationEventRepository= new DonationEventRepository();
const donationEventItemRepository= new DonationEventItemRepository();
const userRepository = new UserRepository();
const eventTypeRepository = new EventTypeRepository();
const itemRepository = new ItemRepository();
const donationEventService = new DonationEventService(donationEventRepository);
const donationEventItemService = new DonationEventItemService(donationEventItemRepository);

router.post('/create', async (req, res) => {
    try {
        // sanitize inputs
        const params = req.body; 
        const allowedEventParams = ['name', 'imageId',  'startDate', 'endDate', 'isActive', 'createdBy', 'eventType', 'donationEventItems'];
        const filteredEventParams = strongParams(params, allowedEventParams);

        // create new DonationEvent object to avoid typing errors
        const newDonationEvent = new DonationEvent();
        newDonationEvent.name = filteredEventParams.name;
        newDonationEvent.eventType = filteredEventParams.eventType;
        newDonationEvent.imageId = filteredEventParams.imageId;
        newDonationEvent.startDate = filteredEventParams.startDate;
        newDonationEvent.endDate = filteredEventParams.endDate;
        newDonationEvent.isActive = filteredEventParams.isActive;

        // get the existing User by Id
        const createdByUser = await userRepository.getUserById(filteredEventParams.createdBy);

        // apply association to User 
        if (createdByUser) {
            newDonationEvent.createdBy = createdByUser;
        }

        // get the existing items by Id and create new Donation Event Item objects
        const newDonationEventItems: any = await Promise.all(
            filteredEventParams.donationEventItems.map(async (donationEventItem: any) => {
            const newItem = new DonationEventItem();
            const item = await itemRepository.getItemById(donationEventItem.id);
            if (item) {
                newItem.item = item;
            } 
            newItem.targetQty = donationEventItem.targetQty;
            newItem.minQty = donationEventItem.minQty;
            newItem.pointsPerUnit = donationEventItem.pointsPerUnit;

            return newItem;
        }));

        // apply association to donationEventItem
        newDonationEvent.donationEventItems = newDonationEventItems;
        
        const donationEventResult = await donationEventService.createDonationEvent(newDonationEvent);

        for (const item of newDonationEventItems) {
            // apply association to donationEvent
            item.donationEvent = donationEventResult;
            await donationEventItemService.createDonationEventItem(item);
        }

        return generateResponse(res, 200, { action: true, message: 'create_success' });
      } catch (error) {

        if (error instanceof Error) {
            return generateResponse(res, 400, error.message);
        }

        return generateResponse(res, 500, "Internal Server Error");
      }
});

export default router;