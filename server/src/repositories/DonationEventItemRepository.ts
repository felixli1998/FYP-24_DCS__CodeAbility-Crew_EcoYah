import { DonationEventItem } from '../entities/DonationEventItem';
import { AppDataSource } from '../config/data-source';

// Interacts database open close
export class DonationEventItemRepository {
  async createDonationEventItem(donationEventItem: DonationEventItem) {
    return await AppDataSource.getRepository(DonationEventItem).save(
      donationEventItem
    );
  }

  async updateDonationEventItem(id: DonationEventItem['id'], payload: Partial<DonationEventItem>) {
    return await AppDataSource.getRepository(DonationEventItem).update(id, payload);
  }

  async removeDonationEventItem(id: DonationEventItem['id']) {
    const donationEventItemToRemove = await this.retrieveDonationEventItemById(id);

    if (!donationEventItemToRemove) return;

    return await AppDataSource.getRepository(DonationEventItem).remove(donationEventItemToRemove);
  }

  async retrieveDonationEventItemById(id: number) {
    return await AppDataSource.getRepository(DonationEventItem).findOne({
      where: {
        id: id,
      },
    });
  }
}
