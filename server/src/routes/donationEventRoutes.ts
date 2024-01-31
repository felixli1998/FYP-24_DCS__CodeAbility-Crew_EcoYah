// External Imports
import express from 'express';

// Internal Imports
import { strongParams, generateResponse } from '../common/methods';
import { DonationEventRepository } from '../repositories/DonationEventRepository';
import { DonationEventService } from '../services/DonationEventService';
import { DonationEvent } from '../entities/DonationEvent';

const router = express.Router();
const donationEventRepository= new DonationEventRepository();
const donationEventService = new DonationEventService(donationEventRepository);

// TODO: @Felix, I need some clarification on what can be filtered by
interface DonationEventFilterParams {
    startDate?: string;
    endDate?: string;
    createdBy?: string;
    eventType?: string;
    name?: string;
    isActive?: string
    createdAt?: string;
    updatedAt?: string;
}

router.get(`/:id?`, async (req, res) => {
    try {
        const id = req.params.id;
        if (id) {
            const parsedId = parseInt(id);
            // Ensure that ID is a number
            if (isNaN(parsedId)) return generateResponse(res, 400, "ID should be a number!");
            const donationEvent = await donationEventService.getDonationEventById(parsedId);
            // Handle if donationEvent is null
            if (!donationEvent) return generateResponse(res, 404, "Donation Event not found!");
            // Return donationEvent
            return generateResponse(res, 200, donationEvent);
        } 
        
        if (Object.keys(req.query).length === 0) {
            // This handles getting all donationEvents
            const donationEvents = await donationEventService.getAllDonationEvents();
            // Return donationEvents
            return generateResponse(res, 200, donationEvents);
        }

        // Getting filters
        // TODO: @Felix, I need you to help standardised what we can filter by over here.
        const filters:DonationEventFilterParams = {
            startDate: req.query['startDate'] as string,
            endDate: req.query['endDate'] as string, 
            createdBy: req.query['createdBy'] as string,
            eventType: req.query['eventType'] as string,
            name: req.query['name'] as string,
            isActive: req.query['isActive'] as string,
            createdAt: req.query['createdAt'] as string,
        };
        const {data, pagination} = await donationEventService.getFilteredDonationEvents(filters);
        // Return donationEvents
        return generateResponse(res, 200, data, pagination);
    } catch (error) {
       return generateResponse(res, 500, "Something went wrong.");
    }
});

router.put(`/:id`, async (req, res) => {
    // Handle if ID is not supplied
    const id = req.params.id;
    if (!id) return generateResponse(res, 400, "ID is required!");

    const parsedId = parseInt(id);
    // Retrieve donationEvent to ensure that it exists
    const donationEvent = await donationEventService.getDonationEventById(parsedId) as DonationEvent;
    // Handle if donationEvent is null
    if (!donationEvent) return generateResponse(res, 404, "Donation Event not found!");

    // Updating timestamp
    const updateParams = req.body as Record<string, unknown>;
    updateParams.updated_at = new Date();
    console.log("Original donationEvent", donationEvent)
    console.log("These are update", updateParams);
    // Apply partial updates
    for (const key in updateParams) {
        if (updateParams.hasOwnProperty(key)) {
            (donationEvent as any)[key] = updateParams[key];
        }
    }
    console.log("Updated donationEvent", donationEvent)
    // Updating donationEvent
    const updateDonationEvent = Object.assign(donationEvent, updateParams);

    const updatedDonationEvent = await donationEventService.updateDonationEvent(updateDonationEvent);
    
    return generateResponse(res, 200, updatedDonationEvent); 
});


export default router;