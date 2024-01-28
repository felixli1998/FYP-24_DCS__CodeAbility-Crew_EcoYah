// External Imports
import express from 'express';

// Internal Imports
import { strongParams, generateResponse } from '../common/methods';
import { DonationEventRepository } from '../repositories/DonationEventRepository';
import { DonationEventService } from '../services/DonationEventService';

const router = express.Router();
const donationEventRepository= new DonationEventRepository();
const donationEventService = new DonationEventService(donationEventRepository);

// TODO: @Felix, I need some clarification on what can be filtered by
interface DonationEventFilterParams {
    startDate?: string;
    endDate?: string;
    createdBy?: string;
    eventType?: string;
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
            eventType: req.query['eventType'] as string
        };
        const donationEvents = await donationEventService.getFilteredDonationEvents(filters);
        // Return donationEvents
        return generateResponse(res, 200, donationEvents);
    } catch (error) {
       return generateResponse(res, 500, "Something went wrong.");
    }
});

router.put(`/:id`, async (req, res) => {
    return generateResponse(res, 200, "Not implemenented yet!");
});


export default router;