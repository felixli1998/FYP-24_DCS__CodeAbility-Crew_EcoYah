import { DonationRequest } from '../entities/DonationRequest';
import { AppDataSource } from '../config/data-source';

export class DonationRequestRepository {
  // TODO: This was created during model creation. Feel free to expand upon it as needed
  async createDonationRequest(donationRequest: DonationRequest) {
    return await AppDataSource.getRepository(DonationRequest).save(
      donationRequest
    );
  }

  // TODO: This was created during model creation. Feel free to expand upon it as needed
  async cancelDonationRequest(id: number) {
    return await AppDataSource.getRepository(DonationRequest).softDelete(id);
  }

  async updateDonationRequest(id: number, payload: Partial<DonationRequest>) {
    return await AppDataSource.getRepository(DonationRequest).save(payload);
  }

  async retrieveById(id: number) {
    return await AppDataSource.getRepository(DonationRequest).find({
      where: { id },
      relations: ['donationRequestItems'],
    });
  }
}
