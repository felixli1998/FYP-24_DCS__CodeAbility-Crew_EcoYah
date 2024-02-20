import { DonationRequestItem } from '../entities/DonationRequestItem';
import { AppDataSource } from '../config/data-source';

export class DonationRequestItemRepository {
  async createDonationRequestItem(donationRequestItem: DonationRequestItem) {
    return await AppDataSource.getRepository(DonationRequestItem).save(
      donationRequestItem
    );
  }

  async retrieveById(id: number) {
    return await AppDataSource.getRepository(DonationRequestItem).findOne({
      where: { id },
    });
  }

  async retrieveByDonationRequestId(donationRequestId: number) {
    return await AppDataSource.getRepository(DonationRequestItem).find({
      where: { donationRequest: { id: donationRequestId } },
    });
  }

  async updateDonationRequestItem(id: number, payload: Partial<DonationRequestItem>){
    return await AppDataSource.getRepository(DonationRequestItem).update(id, payload)
  }
}
