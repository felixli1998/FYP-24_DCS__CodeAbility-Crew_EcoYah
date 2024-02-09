import { DonationEventItem } from '../entities/DonationEventItem';
import { AppDataSource } from '../config/data-source';

// Interacts database open close
export class DonationEventItemRepository {
  async createDonationEventItem(donationEventItem: DonationEventItem) {
    return await AppDataSource.getRepository(DonationEventItem).save(
      donationEventItem
    );
  }

  async retrieveDonationEventItemById(id: number) {
    return await AppDataSource.getRepository(DonationEventItem).findOne({
      where: {
        id: id,
      },
    });
  }
}
