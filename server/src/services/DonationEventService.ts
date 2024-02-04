// Internal Imports
import { DonationEvent } from '../entities/DonationEvent';
import { DonationEventRepository } from '../repositories/DonationEventRepository';
import IPagination from '../common/IPagination';

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
        let errorMessage = "An error occurred while saving the donation event.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        throw new Error(errorMessage);
    }
  }
  
  async getAllDonationEvents(pageNumber: number = 1): Promise<{ data: DonationEvent[], pagination:IPagination }> {
    return this.donationEventRepository.getAllDonationEvents(pageNumber);
  }

  async getDonationEventById(id: number): Promise<DonationEvent | null> {
    return this.donationEventRepository.getDonationEventById(id);
  }

  async updateDonationEvent(donationEvent: DonationEvent): Promise<DonationEvent> {
    return this.donationEventRepository.updateDonationEvent(donationEvent);
  }

  // Filtering

  async getFilteredDonationEvents(filters: any): Promise<{ data: DonationEvent[], pagination:IPagination }> {
    return this.donationEventRepository.filterDonationEvents(filters);
  }
}
