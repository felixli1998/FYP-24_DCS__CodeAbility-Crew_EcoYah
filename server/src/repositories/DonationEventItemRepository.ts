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
    // return await AppDataSource.getRepository(DonationEventItem).find({
    //   select: ['donationRequestItems'],
    //   where: {
    //     donationEvent: { id: donationEventId },
    //   },
    // });

    // return await AppDataSource.getRepository(DonationEventItem)
    //   .createQueryBuilder('dei')
    //   .select(['dei.donationRequestItems', 'item.name', 'item.unit']) // Select columns from both tables
    //   .leftJoinAndSelect(Item, 'item', 'dei.item.id = item.id') // Perform a left join with the Item table using itemId as the join condition
    //   .where('dei.donationEvent.id = :donationEventId', { donationEventId })
    //   .getMany();

    return await AppDataSource.getRepository(DonationEventItem)
    .createQueryBuilder('dei')
    .select(['dei.id', 'dei.minQty', 'dei.pointsPerUnit', 'item.id', 'item.name', 'item.unit']) // Select columns from both tables
    .leftJoin('dei.item', 'item') // Perform a left join with the Item table
    .where('dei.donationEvent.id = :donationEventId', { donationEventId })
    .getMany();
  }
}
