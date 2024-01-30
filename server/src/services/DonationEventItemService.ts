// services/DonationEventItemService.ts
import { DonationEventItem } from '../entities/DonationEventItem';
import { DonationEventItemRepository } from '../repositories/DonationEventItemRepository';


export class DonationEventItemService {
  private donationItemRepository: DonationEventItemRepository;

  constructor(donationItemRepository: DonationEventItemRepository) {
    this.donationItemRepository = donationItemRepository;
  }

  async createDonationEventItem(donationEventItem: DonationEventItem) {
    return this.donationItemRepository.createDonationEventItem(donationEventItem); 
  }
}
