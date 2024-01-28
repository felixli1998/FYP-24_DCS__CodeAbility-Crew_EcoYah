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

    async filterDonationEvents(filters: any): Promise<DonationEvent[]> {
        const queryBuilder = AppDataSource.getRepository(DonationEvent)
            .createQueryBuilder("donationEvent");

        if (filters.startDate && filters.endDate) {
            queryBuilder.where("donationEvent.startDate >= :startDate AND donationEvent.endDate <= :endDate", {
                startDate: filters.startDate,
                endDate: filters.endDate
            });
        }

        if (filters.createdBy) {
            queryBuilder.andWhere("donationEvent.createdBy = :userId", { userId: filters.createdBy });
        }

        if (filters.eventType) {
            queryBuilder.andWhere("donationEvent.eventType = :eventTypeId", { eventTypeId: filters.eventType });
        }

        return await queryBuilder.getMany();
    }

}