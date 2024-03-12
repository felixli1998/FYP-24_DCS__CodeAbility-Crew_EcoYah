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
        "to_char(DR.drop_off_date, 'Day') as day_of_week",
        "CASE WHEN TO_TIMESTAMP(DR.drop_off_time, 'HH24:MI')::TIME BETWEEN '00:00' AND '11:59' THEN 'Morning' ELSE 'Afternoon' END as time_of_day",
        "COUNT(DR.id) as donation_request_count",
      ])
      .groupBy("day_of_week, time_of_day")
      .orderBy("day_of_week, time_of_day")
      .getRawMany();

    const camelCaseResult = result.map((value) => ({
      dayOfWeek: value.day_of_week.trim(),
      timeOfDay: value.time_of_day,
      donationRequestCount: Number(value.donation_request_count),
    }));

    return camelCaseResult;
  }
}
