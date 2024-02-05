import { DonationRequest } from '../entities/DonationRequest';
import { AppDataSource } from '../config/data-source';

export class DonationRequestRepository {
  // TODO: This was creating during model creation. Feel free to expand upon it as needed
  async createDonationRequest(donationRequest: DonationRequest) {
    return await AppDataSource.getRepository(DonationRequest).save(
      donationRequest
    );
  }

  // TODO: This was creating during model creation. Feel free to expand upon it as needed
  async cancelDonationRequest(id: number) {
    return await AppDataSource.getRepository(DonationRequest).softDelete(id);
  }
}
