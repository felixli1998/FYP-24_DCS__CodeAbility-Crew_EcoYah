// External Imports
import { startOfDay, endOfDay } from "date-fns";
import dayjs from "dayjs";
import { In } from "typeorm";

// Internal imports
import { DonationRequest, Status } from "../entities/DonationRequest";
import { AppDataSource } from "../config/data-source";
import { Between } from "typeorm";
import IPagination from "../common/IPagination";
import { User } from "../entities/User";
import { DonationEvent } from "../entities/DonationEvent";
import { DonationEventItem } from "../entities/DonationEventItem";
import { DonationRequestItem } from "../entities/DonationRequestItem";
import { Item } from "../entities/Item";
import { emailResultType } from "../services/EmailService";

export class DonationRequestRepository {
  static PAGE_SIZE: number = 25;

  async getActiveDonationRequestFromUser(
    user_id: number,
    page: number = 1,
  ): Promise<{ data: DonationRequest[]; pagination: IPagination }> {
    const offset = (page - 1) * DonationRequestRepository.PAGE_SIZE;
    const selectOptions = {
      id: true,
      omitPoints: true,
      dropOffDate: true,
      dropOffTime: true,
      donationEvent: {
        id: true,
        name: true,
        imageId: true,
        isActive: true, // TODO: Check if this is needed, current logic Active = "Submitted" but should we check donation event active status as well?
        startDate: true,
        endDate: true,
      },
      donationRequestItems: {
        id: true,
        quantity: true,
        donationEventItem: {
          id: true,
          minQty: true,
          pointsPerUnit: true,
          item: {
            id: true,
            name: true,
            unit: true,
          },
        },
      },
    };
    const [data, totalCount] = await AppDataSource.getRepository(
      DonationRequest,
    ).findAndCount({
      select: selectOptions,
      where: {
        user: { id: user_id },
        status: Status.SUBMITTED,
      },
      relations: [
        "donationEvent",
        "donationRequestItems",
        "donationRequestItems.donationEventItem",
        "donationRequestItems.donationEventItem.item",
      ],
      order: {
        dropOffDate: "DESC",
        dropOffTime: "DESC",
      },
      skip: offset,
      take: DonationRequestRepository.PAGE_SIZE,
    });
    const totalPages = Math.ceil(
      totalCount / DonationRequestRepository.PAGE_SIZE,
    );
    const pagination: IPagination = {
      pageNumber: page,
      hasNext: page < totalPages,
    };
    return { data, pagination };
  }

  async getCompletedDonationRequestFromUser(
    user_id: number,
    page: number = 1,
  ): Promise<{ data: DonationRequest[]; pagination: IPagination }> {
    const offset = (page - 1) * DonationRequestRepository.PAGE_SIZE;
    const [data, totalCount] = await AppDataSource.getRepository(
      DonationRequest,
    ).findAndCount({
      where: {
        user: { id: user_id },
        status: Status.COMPLETED,
      },
      relations: [
        "donationEvent",
        "donationRequestItems",
        "donationRequestItems.donationEventItem",
        "donationRequestItems.donationEventItem.item",
      ],
      order: {
        dropOffDate: "DESC",
        dropOffTime: "DESC",
      },
      skip: offset,
      take: DonationRequestRepository.PAGE_SIZE,
    });
    const totalPages = Math.ceil(
      totalCount / DonationRequestRepository.PAGE_SIZE,
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
      donationRequest,
    );
  }

  async withdrawDonationRequest(id: number) {
    return await AppDataSource.getRepository(DonationRequest).update(id, {
      status: "withdrawn",
    });
  }

  async updateDonationRequest(id: number, payload: Partial<DonationRequest>) {
    await AppDataSource.getRepository(DonationRequest).update(id, payload);
  }

  async retrieveById(id: number) {
    return await AppDataSource.getRepository(DonationRequest).findOne({
      where: { id },
      relations: [
        "donationRequestItems",
        "donationRequestItems.donationEventItem",
        "user",
        "user.userPoints",
      ],
    });
  }

  async retrieveByUserId(user_id: number) {
    const selectOptions = {
      id: true,
      donationEvent: {
        id: true,
      },
      user: {
        id: true,
      },
    };
    return await AppDataSource.getRepository(DonationRequest).find({
      select: selectOptions,
      where: {
        user: { id: user_id },
        status: In([Status.SUBMITTED, Status.COMPLETED]),
      },
      relations: ["user", "donationEvent"],
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
      relations: [
        "user",
        "donationEvent",
        "donationRequestItems",
        "donationRequestItems.donationEventItem",
        "donationRequestItems.donationEventItem.item",
      ],
    });
  }

  async retrieveDonationRequestCountByEventId(donationEventId: number) {
    return await AppDataSource.getRepository(DonationRequest).count({
      where: { donationEvent: { id: donationEventId } },
    });
  }

  async completeDonationRequest(id: number) {
    await AppDataSource.getRepository(DonationRequest).update(
      { id: id },
      { status: Status.COMPLETED },
    );
  }

  async getDonationRequestsApproachingDeadline() {
    const currentDay = dayjs();
    const twoDaysLater = currentDay.add(2, "day");

    const donationRequests = await AppDataSource.getRepository(DonationRequest)
      .createQueryBuilder("DR")
      .select("DR.drop_off_date, DR.drop_off_time")
      .addSelect("U.name as user_name, U.email as user_email")
      .addSelect("DE.name as donation_event_name")
      .addSelect("DRI.quantity as quantity")
      .addSelect("I.name as item, I.unit as unit")
      .innerJoin(User, "U", "U.id = DR.user_id")
      .innerJoin(DonationEvent, "DE", "DE.id = DR.donation_event_id")
      .innerJoin(DonationRequestItem, "DRI", "DRI.donation_request_id = DR.id")
      .innerJoin(
        DonationEventItem,
        "DEI",
        "DEI.id = DRI.donation_event_item_id",
      )
      .innerJoin(Item, "I", "I.id = DEI.item_id")
      .where("DR.drop_off_date <= :twoDaysLater", { twoDaysLater })
      .andWhere("DR.status = :status", { status: Status.SUBMITTED })
      .getRawMany();

    const result: emailResultType = {};

    for (const donationRequest of donationRequests) {
      if (donationRequest.user_email in result) {
        result[donationRequest.user_email].items.push([
          donationRequest.quantity,
          donationRequest.unit,
          donationRequest.item,
        ]);
      } else {
        result[donationRequest.user_email] = {
          name: donationRequest.user_name,
          donationEventName: donationRequest.donation_event_name,
          dropOffDate: donationRequest.drop_off_date,
          dropOffTime: donationRequest.drop_off_time,
          items: [
            [
              donationRequest.quantity,
              donationRequest.unit,
              donationRequest.item,
            ],
          ],
        };
      }
    }

    return result;
  }
}
