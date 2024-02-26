import { DonationEvent } from "../entities/DonationEvent";
import { AppDataSource } from "../config/data-source";
import IPagination from "../common/IPagination";

// A repository interacts with the data base only.
// There should not be any business logic in this particular segment.
// Business logic shoudl reside in the Service layer.
export class DonationEventRepository {
  static PAGE_SIZE: number = 25;
  async createDonationEvent(donationEvent: DonationEvent) {
    return await AppDataSource.getRepository(DonationEvent).save(donationEvent);
  }

  async getAllDonationEvents(
    page: number = 1,
  ): Promise<{ data: DonationEvent[]; pagination: IPagination }> {
    // Pagination
    const totalCount = await AppDataSource.getRepository(DonationEvent).count();
    const totalPages = Math.ceil(
      totalCount / DonationEventRepository.PAGE_SIZE,
    );
    const offset = (page - 1) * DonationEventRepository.PAGE_SIZE;
    const queryBuilder = AppDataSource.getRepository(DonationEvent)
      .createQueryBuilder("donationEvent")
      .orderBy("donationEvent.startDate", "ASC")
      .addOrderBy("donationEvent.endDate", "ASC")
      .addOrderBy("donationEvent.createdAt", "ASC")
      .skip(offset)
      .take(DonationEventRepository.PAGE_SIZE);
    const data = await queryBuilder.getMany();
    const pagination: IPagination = {
      pageNumber: page,
      hasNext: page < totalPages,
    };

    return { data, pagination };
  }

  async getAllDonationEventById(id: number): Promise<DonationEvent | null> {
    return await AppDataSource.getRepository(DonationEvent).findOne({
      where: {
        id: id,
      },
    });
  }

  async getDonationEventById(id: number): Promise<DonationEvent | null> {
    const donationEvent = await AppDataSource.getRepository(
      DonationEvent,
    ).findOne({
      where: {
        id: id,
      },
      relations: ["eventType", "donationEventItems", "donationEventItems.item"],
    });
    return donationEvent || null;
  }

  async findAllDonationEventItems(id: number) {
    const selectOptions = {
      donationEventItems: {
        id: true,
      },
    };

    const donationEvent = await AppDataSource.getRepository(
      DonationEvent,
    ).findOne({
      select: selectOptions,
      where: { id },
      relations: ["donationEventItems"],
    });

    if (!donationEvent) return [];

    const donationEventItemIds = donationEvent?.donationEventItems.flatMap(
      (item) => item.id,
    );

    return donationEventItemIds;
  }

  async updateDonationEvent(donationEvent: DonationEvent) {
    // Clarify with product owner if there are business rules to be applied here
    return await AppDataSource.getRepository(DonationEvent).save(donationEvent);
  }

  async updateDonationEventv1(
    id: DonationEvent["id"],
    payload: Partial<DonationEvent>,
  ) {
    return await AppDataSource.getRepository(DonationEvent).update(id, payload);
  }

  async filterDonationEvents(
    filters: any,
    page: number = 1,
  ): Promise<{ data: DonationEvent[]; pagination: IPagination }> {
    const queryBuilder =
      AppDataSource.getRepository(DonationEvent).createQueryBuilder(
        "donationEvent",
      );

    if (filters.startDate && !filters.endDate) {
      queryBuilder
        .andWhere("donationEvent.startDate >= :startDate", {
          startDate: filters.startDate,
        })
        .orderBy("donationEvent.startDate", "ASC");
    } else if (!filters.startDate && filters.endDate) {
      queryBuilder
        .andWhere("donationEvent.endDate <= :endDate", {
          endDate: filters.endDate,
        })
        .orderBy("donationEvent.endDate", "ASC");
    } else if (filters.startDate && filters.endDate) {
      queryBuilder
        .andWhere(
          "donationEvent.startDate >= :startDate AND donationEvent.endDate <= :endDate",
          {
            startDate: filters.startDate,
            endDate: filters.endDate,
          },
        )
        .orderBy("donationEvent.startDate", "ASC")
        .addOrderBy("donationEvent.endDate", "ASC");
    }

    if (filters.createdBy) {
      queryBuilder
        .andWhere("donationEvent.createdBy = :userId", {
          userId: filters.createdBy,
        })
        .orderBy("donationEvent.createdAt", "ASC");
    }

    if (filters.eventType) {
      console.log("^^^^^ IN FILTERS.EVENTTYPE IF ^^^^^^");

      queryBuilder
        .andWhere("donationEvent.eventType = :eventTypeId", {
          eventTypeId: filters.eventType,
        })
        .orderBy("donationEvent.createdAt", "ASC");
    }

    if (filters.isActive === "true") {
      const currentDate = new Date().toISOString();
      queryBuilder.andWhere(
        "donationEvent.isActive = :isActive AND \
                    :currentDate BETWEEN donationEvent.startDate AND donationEvent.endDate",
        { isActive: filters.isActive, currentDate: currentDate },
      );
    } else if (filters.isActive === "false") {
      queryBuilder
        .andWhere("donationEvent.isActive = :isActive", {
          isActive: filters.isActive,
        })
        .orWhere("donationEvent.endDate < :currentDate", {
          currentDate: new Date().toISOString(),
        })
        .orWhere("donationEvent.startDate > :currentDate", {
          currentDate: new Date().toISOString(),
        });
    }

    if (filters.name) {
      queryBuilder.andWhere("donationEvent.name ILIKE :name", {
        name: `%${filters.name}%`,
      });
    }

    // Pagination
    const totalCount = await queryBuilder.getCount();
    const totalPages = Math.ceil(
      totalCount / DonationEventRepository.PAGE_SIZE,
    );
    const offset = (page - 1) * DonationEventRepository.PAGE_SIZE;
    queryBuilder
      .orderBy("donationEvent.startDate", "ASC")
      .addOrderBy("donationEvent.endDate", "ASC")
      .addOrderBy("donationEvent.createdAt", "ASC")
      .offset(offset)
      .limit(DonationEventRepository.PAGE_SIZE);
    const data = await queryBuilder.getMany();
    const pagination: IPagination = {
      pageNumber: page,
      hasNext: page < totalPages,
    };
    return { data: data, pagination: pagination };
  }
}
