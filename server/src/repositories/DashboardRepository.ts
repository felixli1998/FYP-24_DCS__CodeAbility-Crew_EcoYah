// Internal imports
import { AppDataSource } from "../config/data-source";
import { DonationRequest, Status } from "../entities/DonationRequest";
import { DonationRequestItem } from "../entities/DonationRequestItem";
import { DonationEvent } from "../entities/DonationEvent";
import { DonationEventItem } from "../entities/DonationEventItem";
import { Item } from "../entities/Item";

export class DashboardRepository {
  async getPopularEventToDate() {
    const result = await AppDataSource.getRepository(DonationRequest)
      .createQueryBuilder("DR")
      .select("DR.donation_event_id, COUNT(DR.id) as donation_request_count")
      .addSelect("DE.name as donation_event_name")
      .innerJoin(DonationEvent, "DE", "DE.id = DR.donation_event_id")
      .where("DR.status IN (:...status)", {
        status: [Status.SUBMITTED, Status.COMPLETED],
      })
      .groupBy("DR.donation_event_id, DE.name")
      .orderBy("donation_request_count", "DESC")
      .getRawOne();

    const camelCaseResult = {
      donationEventId: result?.donation_event_id,
      donationEventName: result?.donation_event_name,
      donationRequestCount: Number(result?.donation_request_count),
    };

    return camelCaseResult;
  }

  async getPopularItemToDate() {
    const result = await AppDataSource.getRepository(DonationRequest)
      .createQueryBuilder("DR")
      .select(
        "DRI.donation_event_item_id, COUNT(DR.id) as donation_request_count",
      )
      .addSelect("I.name as donation_event_item_name")
      .leftJoin(DonationRequestItem, "DRI", "DRI.donation_request_id = DR.id")
      .leftJoin(DonationEventItem, "DEI", "DEI.id = DRI.donation_event_item_id")
      .leftJoin(Item, "I", "I.id = DEI.id")
      .where("DR.status IN (:...status)", {
        status: [Status.SUBMITTED, Status.COMPLETED],
      })
      .groupBy("DRI.donation_event_item_id, I.name")
      .orderBy("donation_request_count", "DESC")
      .getRawOne();

    const camelCaseResult = {
      donationEventItemId: result?.donation_event_item_id,
      donationEventItemName: result?.donation_event_item_name,
      donationRequestCount: Number(result?.donation_request_count),
    };

    return camelCaseResult;
  }

  async getPreferredDropOff() {
    const result = await AppDataSource.getRepository(DonationRequest)
      .createQueryBuilder("DR")
      .select([
        "CASE WHEN EXTRACT(DOW FROM DR.dropOffDate) BETWEEN 1 AND 5 THEN 'Monday - Friday' ELSE 'Weekend' END as dayOfWeek",
        "CASE WHEN EXTRACT(HOUR FROM DR.dropOffTime) BETWEEN 0 AND 11 THEN 'Morning' ELSE 'Afternoon' END as timeOfDay",
        "COUNT(DR.id) as count",
      ])
      .groupBy("dayOfWeek, timeOfDay")
      .orderBy("dayOfWeek, timeOfDay")
      .getRawMany();

    return result;
  }
}
