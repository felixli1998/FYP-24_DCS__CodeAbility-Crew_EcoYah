// External Imports
import express from 'express';

// Internal Imports
import { strongParams, generateResponse } from '../common/methods';
import { DonationEventRepository } from '../repositories/DonationEventRepository';
import { DonationEventService } from '../services/DonationEventService';

const router = express.Router();
const donationEventRepository= new DonationEventRepository();
const donationEventService = new DonationEventService(donationEventRepository);

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
        } else {
            // This handles getting all donationEvents
            const donationEvents = await donationEventService.getAllDonationEvents();
            // Return donationEvents
            return generateResponse(res, 200, donationEvents);
        }
    } catch (error) {
       return generateResponse(res, 500, "Something went wrong.");
    }
});

export default router;