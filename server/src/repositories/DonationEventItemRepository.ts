import { DonationEventItem } from '../entities/DonationEventItem';
import { Item } from '../entities/Item';
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

  // Retrieves all donationEventItems by donationEventId with itemName and Unit
  async getDonationEventItembyDonationEventId(donationEventId: number) {

    return await AppDataSource.getRepository(DonationEventItem)
    .createQueryBuilder('dei')
    .select(['dei.id', 'dei.minQty', 'dei.pointsPerUnit', 'item.id', 'item.name', 'item.unit'])
    .leftJoin('dei.item', 'item')
    .where('dei.donationEvent.id = :donationEventId', { donationEventId })
    .getMany();
  }
}
