// External Imports
import { startOfDay, endOfDay } from 'date-fns';

// Internal imports
import { DonationRequest, Status } from '../entities/DonationRequest';
import { AppDataSource } from '../config/data-source';
import { Between } from 'typeorm';

export class DonationRequestRepository {
  // TODO: This was created during model creation. Feel free to expand upon it as needed
  async createDonationRequest(donationRequest: DonationRequest) {
    return await AppDataSource.getRepository(DonationRequest).save(
      donationRequest
    );
  }

  async cancelDonationRequest(id: number) {
    return await AppDataSource.getRepository(DonationRequest).softDelete(id);
  }

  async updateDonationRequest(id: number, payload: Partial<DonationRequest>) {
    await AppDataSource.getRepository(DonationRequest).update(id, payload);
  }

  async retrieveById(id: number) {
    return await AppDataSource.getRepository(DonationRequest).findOne({
      where: { id },
      relations: [
        'donationRequestItems',
        'donationRequestItems.donationEventItem',
      ],
    });
  }

  async retrieveDonationRequestByDate(date: Date) {
    const start = startOfDay(date);
    const end = endOfDay(date);

    const selectOptions = {
      id: true,
      dropOffTime: true,
      dropOffDate: true,
      status: true,
      user: { name: true },
      donationEvent: {
        id: true,
        name: true,
      },
      donationRequestItems: {
        id: true,
        quantity: true,
        donationEventItem: {
          id: true,
          pointsPerUnit: true,
          item: {
            name: true,
            unit: true,
          },
        },
      },
    };

    return await AppDataSource.getRepository(DonationRequest).find({
      select: selectOptions,
      withDeleted: false, // only return active records
      where: { dropOffDate: Between(start, end), status: Status.SUBMITTED },
      cache: {
        id: `retrieve-by-date-${date.toISOString()}`, // Cache key by date
        milliseconds: 30000, // 30 seconds for now
      },
      relations: [
        'user',
        'donationEvent',
        'donationRequestItems',
        'donationRequestItems.donationEventItem',
        'donationRequestItems.donationEventItem.item',
      ],
    });
  }

  async completeDonationRequest(id: number) {
    await AppDataSource.getRepository(DonationRequest).update({ id: id }, { status: Status.COMPLETED });
  }
}
