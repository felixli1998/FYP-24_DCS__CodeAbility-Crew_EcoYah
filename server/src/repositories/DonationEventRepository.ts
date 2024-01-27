import { DonationEvent } from "../entities/DonationEvent";
import { AppDataSource } from "../config/data-source";

// A repository interacts with the data base only. 
// There should not be any business logic in this particular segment.
// Business logic shoudl reside in the Service layer.

export class DonationEventRepository {
    async createDonationEvent(donationEvent: DonationEvent) {
        return await AppDataSource.getRepository(DonationEvent).save(donationEvent)
    }

    async getAllDonationEvents(): Promise<DonationEvent[]> {
        return await AppDataSource.getRepository(DonationEvent).find();
    }

    async getDonationEventById(id: number): Promise<DonationEvent | null> {
        const donationEvent = await AppDataSource.getRepository(DonationEvent).findOne({
            where: {
                id:id
            }
        });
        return donationEvent || null;
    }

    async updateDonationEvent(donationEvent: DonationEvent) {
        return await AppDataSource.getRepository(DonationEvent).save(donationEvent);
    }
}