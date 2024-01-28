import { DonationEvent } from '../entities/DonationEvent';
import { DonationEventRepository } from '../repositories/DonationEventRepository';


export class DonationEventService {
  private donationEventRepository: DonationEventRepository;

  constructor(donationEventRepository: DonationEventRepository) {
    this.donationEventRepository = donationEventRepository;
  }

  async createDonationEvent(donationEvent: DonationEvent): Promise<DonationEvent> {
    return this.donationEventRepository.createDonationEvent(donationEvent);
  }
  
  async getAllDonationEvents(): Promise<DonationEvent[]> {
    return this.donationEventRepository.getAllDonationEvents();
  }

  async getDonationEventById(id: number): Promise<DonationEvent | null> {
    return this.donationEventRepository.getDonationEventById(id);
  }

  async updateDonationEvent(donationEvent: DonationEvent): Promise<DonationEvent> {
    return this.donationEventRepository.updateDonationEvent(donationEvent);
  }

  // Filtering

  async getFilteredDonationEvents(filters: any): Promise<DonationEvent[]> {
    return this.donationEventRepository.filterDonationEvents(filters);
  }
}
