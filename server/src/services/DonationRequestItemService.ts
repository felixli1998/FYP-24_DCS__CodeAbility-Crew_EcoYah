import { DonationRequestItem } from '../entities/DonationRequestItem';
import { DonationRequestItemRepository } from '../repositories/DonationRequestItemRepository';

export class DonationRequestItemService {
  private donationRequestItemRepository: DonationRequestItemRepository;

  constructor(donationRequestItemRepository: DonationRequestItemRepository) {
    this.donationRequestItemRepository = donationRequestItemRepository;
  }

  async createDonationRequestItem(donationRequestItem: DonationRequestItem) {
    return await this.donationRequestItemRepository.createDonationRequestItem(
      donationRequestItem
    );
  }

  async retrieveById(id: number) {
    return await this.donationRequestItemRepository.retrieveById(id);
  }

  async deleteById(id: Partial<DonationRequestItem>) {
    return await this.donationRequestItemRepository.deleteById(id);
  }
}
