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
}
