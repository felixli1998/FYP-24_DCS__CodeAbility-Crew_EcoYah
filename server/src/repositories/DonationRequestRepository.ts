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
    const selectOptions = {
      id: true,
      omitPoints: true,
      dropOffDate: true,
      dropOffTime: true,
      donationEvent: {
        name: true,
        imageId: true,
        isActive: true, // TODO: Check if this is needed, current logic Active = "Submitted" but should we check donation event active status as well?
        startDate: true,
        endDate: true,
      },
      donationRequestItems: {
        id:true,
        quantity: true,
        donationEventItem: {
          id: true,
          minQty: true,
          pointsPerUnit: true,
          item: {
            id: true, 
            name: true,
            unit: true
          }
        },
      },
    };
    const [data, totalCount] = await AppDataSource.getRepository(
      DonationRequest
    ).findAndCount({
      select: selectOptions,
      where: {
        user: { id: user_id },
        status: Status.SUBMITTED
      },
      relations: [
        'donationEvent',
        'donationRequestItems',
        'donationRequestItems.donationEventItem',
        'donationRequestItems.donationEventItem.item',
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
        'donationEvent',
        'donationRequestItems',
        'donationRequestItems.donationEventItem',
        'donationRequestItems.donationEventItem.item',
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

  async retrieveDonationRequestCountByEventId(donationEventId: number) {
    return await AppDataSource.getRepository(DonationRequest).count({
      where: { donationEvent: { id: donationEventId } }
    });
  }

  async completeDonationRequest(id: number) {
    await AppDataSource.getRepository(DonationRequest).update({ id: id }, { status: Status.COMPLETED });
  }
}
