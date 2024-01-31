// Internal Imports
import { DonationEvent } from '../entities/DonationEvent';
import { DonationEventRepository } from '../repositories/DonationEventRepository';


export class DonationEventService {
  private donationEventRepository: DonationEventRepository;

  constructor(donationEventRepository: DonationEventRepository) {
    this.donationEventRepository = donationEventRepository;
  }

  async createDonationEvent(donationEvent: DonationEvent): Promise<DonationEvent> {
    try {
      // This will trigger the @BeforeInsert() validations in the entity
      return await this.donationEventRepository.createDonationEvent(donationEvent);
    } catch (error) {
        console.log(error);
        throw new Error("An error occurred while saving the donation event.");
    }
  }
}
