import { DonationRequestItem } from '../entities/DonationRequestItem';
import { AppDataSource } from '../config/data-source';

export class DonationRequestItemRepository {
  async createDonationRequestItem(donationRequestItem: DonationRequestItem) {
    return await AppDataSource.getRepository(DonationRequestItem).save(
      donationRequestItem
    );
  }
}
