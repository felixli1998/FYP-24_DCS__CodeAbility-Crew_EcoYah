// External Imports
import { startOfDay, endOfDay } from 'date-fns';

// Internal imports
import { DonationRequest, Status } from '../entities/DonationRequest';
import { AppDataSource } from '../config/data-source';
import { Between } from 'typeorm';
import IPagination from '../common/IPagination';

export class DonationRequestRepository {
  static PAGE_SIZE: number = 25;

  async getActiveDonationRequestFromUser(
    user_id: number,
    page: number = 1
  ): Promise<{ data: DonationRequest[]; pagination: IPagination }> {
    const offset = (page - 1) * DonationRequestRepository.PAGE_SIZE;
    const [data, totalCount] = await AppDataSource.getRepository(
      DonationRequest
    ).findAndCount({
      where: { 
        user: { id: user_id }, 
        status: Status.SUBMITTED 
      },
      relations: [
        'donationRequestItems', 
        'donationRequestItems.donationEventItem',
        'donationRequestItems.donationEventItem.donationEvent',
      ],
      order: {
        dropOffDate: 'DESC',
        dropOffTime: 'DESC',
      },
      skip: offset,
      take: DonationRequestRepository.PAGE_SIZE,
    });
    const totalPages = Math.ceil(
      totalCount / DonationRequestRepository.PAGE_SIZE
    );
    const pagination: IPagination = {
      pageNumber: page,
      hasNext: page < totalPages,
    };
    return { data, pagination };
  }

  async getCompletedDonationRequestFromUser(
    user_id: number,
    page: number = 1
  ): Promise<{ data: DonationRequest[]; pagination: IPagination }> {
    const offset = (page - 1) * DonationRequestRepository.PAGE_SIZE;
    const [data, totalCount] = await AppDataSource.getRepository(
      DonationRequest
    ).findAndCount({
      where: { 
        user: { id: user_id }, 
        status: Status.COMPLETED
      },
      relations: [
        'donationRequestItems', 
        'donationRequestItems.donationEventItem',
        'donationRequestItems.donationEventItem.donationEvent',
      ],
      order: {
        dropOffDate: 'DESC',
        dropOffTime: 'DESC',
      },
      skip: offset,
      take: DonationRequestRepository.PAGE_SIZE,
    });
    const totalPages = Math.ceil(
      totalCount / DonationRequestRepository.PAGE_SIZE
    );
    const pagination: IPagination = {
      pageNumber: page,
      hasNext: page < totalPages,
    };
    return { data, pagination };
  }

  // TODO: This was created during model creation. Feel free to expand upon it as needed
  async createDonationRequest(donationRequest: DonationRequest) {
    return await AppDataSource.getRepository(DonationRequest).save(
      donationRequest
    );
  }

  async cancelDonationRequest(id: number) {
    return await AppDataSource.getRepository(DonationRequest).softDelete(id);
  }

  // TODO: This was created during model creation. Feel free to expand upon it as needed
  async retrieveDonationRequestByDate(date: Date) {
    const start = startOfDay(date);
    const end = endOfDay(date);

    const selectOptions = {
      id: true,
      dropOffTime: true,
      dropOffDate: true,
      status: true,
      user: { name: true },
      donationRequestItems: {
        id: true,
        quantity: true,
        donationEventItem: {
          id: true,
          pointsPerUnit: true,
          donationEvent: {
            id: true,
            name: true,
          },
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
        'donationRequestItems',
        'donationRequestItems.donationEventItem',
        'donationRequestItems.donationEventItem.item',
        'donationRequestItems.donationEventItem.donationEvent',
      ],
    });
  }
}
