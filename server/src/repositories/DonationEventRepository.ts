import { DonationEvent } from '../entities/DonationEvent';
import { AppDataSource } from '../config/data-source';

// Interacts database open close
export class DonationEventRepository {
  async createDonationEvent(donationEvent: DonationEvent) {
    return await AppDataSource.getRepository(DonationEvent).save(donationEvent);
  }
}
