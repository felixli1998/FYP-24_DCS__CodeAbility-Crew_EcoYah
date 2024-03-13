// Internal Imports
import { AppDataSource } from "../config/data-source";
import { DonationRequest, Status } from "../entities/DonationRequest";
import { DonationRequestItem } from "../entities/DonationRequestItem";
import { DonationEvent } from "../entities/DonationEvent";
import { DonationEventItem } from "../entities/DonationEventItem";
import { Item } from "../entities/Item";

export class DashboardRepository {
  async getPopularEvent() {
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
      .cache(`get-popular-event`, 60000)
      .getRawOne();

    const camelCaseResult = {
      donationEventId: result?.donation_event_id,
      donationEventName: result?.donation_event_name,
      donationRequestCount: Number(result?.donation_request_count),
    };

    return camelCaseResult;
  }

  async getPopularItem() {
    const result = await AppDataSource.getRepository(DonationRequest)
      .createQueryBuilder("DR")
      .select(
        "DRI.donation_event_item_id, COUNT(DR.id) as donation_request_count",
      )
      .addSelect("I.name as donation_event_item_name")
      .leftJoin(DonationRequestItem, "DRI", "DRI.donation_request_id = DR.id")
      .leftJoin(DonationEventItem, "DEI", "DEI.id = DRI.donation_event_item_id")
      .leftJoin(Item, "I", "I.id = DEI.item_id")
      .where("DR.status IN (:...status)", {
        status: [Status.SUBMITTED, Status.COMPLETED],
      })
      .groupBy("DRI.donation_event_item_id, I.name")
      .orderBy("donation_request_count", "DESC")
      .cache(`get-popular-item`, 60000)
      .getRawOne();

    const camelCaseResult = {
      donationEventItemId: result?.donation_event_item_id,
      donationEventItemName: result?.donation_event_item_name,
      donationRequestCount: Number(result?.donation_request_count),
    };

    return camelCaseResult;
  }

  async getDonationRequests() {
    const result = await AppDataSource.getRepository(DonationRequest)
      .createQueryBuilder("DR")
      .select("COUNT(DR.id) as donation_request_count, DR.status")
      .groupBy("DR.status")
      .cache(`get-donation-requests`, 60000)
      .getRawMany();

    const camelCaseResult = result.map((entry, i) => ({
      id: i,
      value: Number(entry.donation_request_count),
      label: entry.status[0].toUpperCase() + entry.status.slice(1),
    }));

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
      .cache(`get-events-by-${month}`, 60000)
      .getRawMany();

    const camelCaseResult = result.map((entry) => ({
      donationEventId: entry.donation_event_id,
      donationEventName: entry.donation_event_name,
      status: entry.status,
      donationRequestCount: Number(entry.donation_request_count),
    }));

    const uniqueEvents = Array.from(
      new Set(camelCaseResult.map((entry) => entry.donationEventName)),
    );

    const submittedData = camelCaseResult.filter(
      (entry) => entry.status === Status.SUBMITTED,
    );
    const completedData = camelCaseResult.filter(
      (entry) => entry.status === Status.COMPLETED,
    );
    const withdrawnData = camelCaseResult.filter(
      (entry) => entry.status === Status.WITHDRAWN,
    );

    const groupSubmittedData = uniqueEvents.map((event) => {
      const entry = submittedData.find(
        (entry) => entry.donationEventName === event,
      );
      return entry ? entry.donationRequestCount : 0;
    });
    const groupCompletedData = uniqueEvents.map((event) => {
      const entry = completedData.find(
        (entry) => entry.donationEventName === event,
      );
      return entry ? entry.donationRequestCount : 0;
    });
    const groupWithdrawnData = uniqueEvents.map((event) => {
      const entry = withdrawnData.find(
        (entry) => entry.donationEventName === event,
      );
      return entry ? entry.donationRequestCount : 0;
    });

    return {
      eventsByMonth: camelCaseResult, // for cross-checking
      eventsArray: uniqueEvents,
      submittedData: groupSubmittedData,
      completedData: groupCompletedData,
      withdrawnData: groupWithdrawnData,
    };
  }

  async getItemsByMonth(month: string) {
    const monthNumber = parseInt(month, 10);
    const currentYear = new Date().getFullYear();

    const startDate = new Date(Date.UTC(currentYear, monthNumber - 1, 1));
    const endDate = new Date(Date.UTC(currentYear, monthNumber, 0, 23, 59, 59));

    const result = await AppDataSource.getRepository(DonationRequest)
      .createQueryBuilder("DR")
      .select(
        "DRI.donation_event_item_id, DR.status, COUNT(DR.id) as donation_request_count",
      )
      .addSelect("I.name as donation_event_item_name")
      .leftJoin(DonationEvent, "DE", "DE.id = DR.donation_event_id")
      .leftJoin(DonationRequestItem, "DRI", "DRI.donation_request_id = DR.id")
      .leftJoin(DonationEventItem, "DEI", "DEI.id = DRI.donation_event_item_id")
      .leftJoin(Item, "I", "I.id = DEI.item_id")
      .where("DE.start_date BETWEEN :startDate AND :endDate", {
        startDate,
        endDate,
      })
      .groupBy("DRI.donation_event_item_id, I.name, DR.status")
      .cache(`get-items-by-${month}`, 60000)
      .getRawMany();

    const camelCaseResult = result.map((entry) => ({
      donationEventItemId: entry.donation_event_item_id,
      donationEventItemName: entry.donation_event_item_name,
      status: entry.status,
      donationRequestCount: Number(entry.donation_request_count),
    }));

    const uniqueItems = Array.from(
      new Set(camelCaseResult.map((entry) => entry.donationEventItemName)),
    );

    const submittedData = camelCaseResult.filter(
      (entry) => entry.status === Status.SUBMITTED,
    );
    const completedData = camelCaseResult.filter(
      (entry) => entry.status === Status.COMPLETED,
    );
    const withdrawnData = camelCaseResult.filter(
      (entry) => entry.status === Status.WITHDRAWN,
    );

    const groupSubmittedData = uniqueItems.map((event) => {
      const entry = submittedData.find(
        (entry) => entry.donationEventItemName === event,
      );
      return entry ? entry.donationRequestCount : 0;
    });
    const groupCompletedData = uniqueItems.map((event) => {
      const entry = completedData.find(
        (entry) => entry.donationEventItemName === event,
      );
      return entry ? entry.donationRequestCount : 0;
    });
    const groupWithdrawnData = uniqueItems.map((event) => {
      const entry = withdrawnData.find(
        (entry) => entry.donationEventItemName === event,
      );
      return entry ? entry.donationRequestCount : 0;
    });

    return {
      itemsByMonth: camelCaseResult, // for cross-checking
      itemsArray: uniqueItems,
      submittedData: groupSubmittedData,
      completedData: groupCompletedData,
      withdrawnData: groupWithdrawnData,
    };
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
      .cache(`get-preferred-drop-off`, 60000)
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
      preferredDropOffData: camelCaseResult, // for cross-checking
      dayOfWeekArray: uniqueDayOfWeek,
      timeOfDayArray: uniqueTimeOfDay,
      morningData: groupMorningData,
      afternoonData: groupAfternoonData,
    };
  }
}
