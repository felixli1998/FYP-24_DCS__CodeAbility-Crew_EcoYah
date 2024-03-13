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

  async getEventsByMonth(month: string) {
    const monthNumber = parseInt(month, 10);
    const currentYear = new Date().getFullYear();

    const startDate = new Date(Date.UTC(currentYear, monthNumber - 1, 1));
    const endDate = new Date(Date.UTC(currentYear, monthNumber, 0, 23, 59, 59));

    const result = await AppDataSource.getRepository(DonationRequest)
      .createQueryBuilder("DR")
      .select(
        "DR.donation_event_id, DR.status, COUNT(DR.id) as donation_request_count",
      )
      .addSelect("DE.name as donation_event_name")
      .innerJoin(DonationEvent, "DE", "DE.id = DR.donation_event_id")
      .where("DE.start_date BETWEEN :startDate AND :endDate", {
        startDate,
        endDate,
      })
      .groupBy("DR.donation_event_id, donation_event_name, DR.status")
      .getRawMany();

    return result;
  }

  async getPreferredDropOff() {
    const result = await AppDataSource.getRepository(DonationRequest)
      .createQueryBuilder("DR")
      .select([
        "to_char(DR.drop_off_date, 'Day') as day_of_week",
        "CASE WHEN TO_TIMESTAMP(DR.drop_off_time, 'HH24:MI')::TIME BETWEEN '00:00' AND '11:59' THEN 'Morning' ELSE 'Afternoon' END as time_of_day",
        "COUNT(DR.id) as donation_request_count",
      ])
      .groupBy("day_of_week, time_of_day, EXTRACT(DOW FROM DR.drop_off_date)")
      .orderBy("EXTRACT(DOW FROM DR.drop_off_date)", "ASC")
      .getRawMany();

    const camelCaseResult = result.map((entry) => ({
      dayOfWeek: entry.day_of_week.trim(),
      timeOfDay: entry.time_of_day,
      donationRequestCount: Number(entry.donation_request_count),
    }));

    const uniqueDayOfWeek = Array.from(
      new Set(camelCaseResult.map((entry) => entry.dayOfWeek)),
    );
    const uniqueTimeOfDay = Array.from(
      new Set(camelCaseResult.map((entry) => entry.timeOfDay)),
    );

    const morningData = camelCaseResult.filter(
      (entry) => entry.timeOfDay === "Morning",
    );
    const afternoonData = camelCaseResult.filter(
      (entry) => entry.timeOfDay === "Afternoon",
    );

    const groupMorningData = uniqueDayOfWeek.map((dayOfWeek) => {
      const entry = morningData.find((entry) => entry.dayOfWeek === dayOfWeek);
      return entry ? entry.donationRequestCount : 0;
    });

    const groupAfternoonData = uniqueDayOfWeek.map((dayOfWeek) => {
      const entry = afternoonData.find(
        (entry) => entry.dayOfWeek === dayOfWeek,
      );
      return entry ? entry.donationRequestCount : 0;
    });

    return {
      preferredDropOffData: camelCaseResult,
      dayOfWeekArray: uniqueDayOfWeek,
      timeOfDayArray: uniqueTimeOfDay,
      morningData: groupMorningData,
      afternoonData: groupAfternoonData,
    };
  }
}
