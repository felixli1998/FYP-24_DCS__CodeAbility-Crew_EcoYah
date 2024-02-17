import { DonationRequest } from '../entities/DonationRequest';
import { DonationRequestRepository } from '../repositories/DonationRequestRepository';

export class DonationRequestService {
  private donationRequestRepository: DonationRequestRepository;

  constructor(donationRequestRepository: DonationRequestRepository) {
    this.donationRequestRepository = donationRequestRepository;
  }

  async createDonationRequest(donationRequest: DonationRequest) {
    return await this.donationRequestRepository.createDonationRequest(
      donationRequest
    );
  }

  async cancelDonationRequest(id: number) {
    return await this.donationRequestRepository.cancelDonationRequest(id);
  }

  async retrieveDonationRequestByDate(date: Date) {
    return await this.donationRequestRepository.retrieveDonationRequestByDate(
      date
    );
  }

  async completeDonationRequest(id: number) {
    return await this.donationRequestRepository.completeDonationRequest(id);
  }

  async retrieveDonationRequestCountByEventId(
    donationEventId: number
  ): Promise<number> {
    return await this.donationRequestRepository.retrieveDonationRequestCountByEventId(donationEventId);
  }
}
