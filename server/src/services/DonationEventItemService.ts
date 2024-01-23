// services/DonationEventItemService.ts
import { DonationEventItem } from '../entities/DonationEventItem';
import { DonationEventItemRepository } from '../repositories/DonationEventItemRepository';


export class DonationEventItemService {
  private donationItemRepository: DonationEventItemRepository;

  constructor(donationItemRepository: DonationEventItemRepository) {
    this.donationItemRepository = donationItemRepository;
  }

  async createDonationEventItem(donationItemRepository: DonationEventItem) {
    return this.donationItemRepository.createDonationEventItem(donationItemRepository); // Assuming createItem is a method in your repository
  }

  // Other business logic methods
  // ...
}
