import { DonationRequest } from '../entities/DonationRequest';
import { DonationRequestRepository } from '../repositories/DonationRequestRepository';
export class DonationRequestService {
  private donationRequestRepository: DonationRequestRepository;

  constructor(donationRequestRepository: DonationRequestRepository) {
    this.donationRequestRepository = donationRequestRepository;
  }

  async getActiveDonationRequestFromUser(user_id:number, page: number = 1) {
    return await this.donationRequestRepository.getActiveDonationRequestFromUser(
      user_id,
      page
    );
  }

  async getCompletedDonationRequestFromUser(user_id:number, page: number = 1) {
    return await this.donationRequestRepository.getCompletedDonationRequestFromUser(
      user_id,
      page
    );
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
}
