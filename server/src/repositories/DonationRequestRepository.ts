// External Imports
import { startOfDay, endOfDay } from 'date-fns';

// Internal imports
import { DonationRequest } from '../entities/DonationRequest';
import { AppDataSource } from '../config/data-source';
import { Between } from 'typeorm';

export class DonationRequestRepository {
  // TODO: This was created during model creation. Feel free to expand upon it as needed
  async createDonationRequest(donationRequest: DonationRequest) {
    return await AppDataSource.getRepository(DonationRequest).save(
      donationRequest
    );
  }

  async cancelDonationRequest(id: number) {
    return await AppDataSource.getRepository(DonationRequest).softDelete(id);
  }

  // TODO: This was created during model creation. Feel free to expand upon it as needed
  async retrieveDonationRequestByDate(date: Date) {
    const start = startOfDay(date);
    const end = endOfDay(date);

    return await AppDataSource.getRepository(DonationRequest).find({
      where: { dropOffDate: Between(start, end) },
    });
  }
}
