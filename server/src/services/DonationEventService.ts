// Internal Imports
import { DonationEvent } from "../entities/DonationEvent";
import { DonationEventRepository } from "../repositories/DonationEventRepository";
import IPagination from "../common/IPagination";
import { DonationEventUpdatePayload } from "../routes/donationEventRoutes";
import { DonationEventItemRepository } from "../repositories/DonationEventItemRepository";
import { DonationEventItemService } from "./DonationEventItemService";
import { Item } from "../entities/Item";

export class DonationEventService {
  private donationEventRepository: DonationEventRepository;
  private donationEventItemRepository: DonationEventItemRepository;
  private donationEventItemService: DonationEventItemService;

  constructor(donationEventRepository: DonationEventRepository) {
    this.donationEventRepository = donationEventRepository;
    this.donationEventItemRepository = new DonationEventItemRepository();
    this.donationEventItemService = new DonationEventItemService(
      this.donationEventItemRepository,
    );
  }

  async createDonationEvent(
    donationEvent: DonationEvent,
  ): Promise<DonationEvent> {
    try {
      // This will trigger the @BeforeInsert() validations in the entity
      return await this.donationEventRepository.createDonationEvent(
        donationEvent,
      );
    } catch (error) {
      let errorMessage = "An error occurred while saving the donation event.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      throw new Error(errorMessage);
    }
  }

  async getAllDonationEvents(
    pageNumber: number = 1,
  ): Promise<{ data: DonationEvent[]; pagination: IPagination }> {
    return this.donationEventRepository.getAllDonationEvents(pageNumber);
  }

  async getDonationEventById(id: number): Promise<DonationEvent | null> {
    return this.donationEventRepository.getDonationEventById(id);
  }

  async updateDonationEvent(
    donationEvent: DonationEvent,
  ): Promise<DonationEvent> {
    return this.donationEventRepository.updateDonationEvent(donationEvent);
  }

  async updateDonationEventV1(id: number, payload: DonationEventUpdatePayload) {
    const updatedDonationEventPayload: Partial<DonationEvent> = {};

    const _ = Object.entries(payload).map(async ([key, value]) => {
      switch (key) {
        case "name":
          updatedDonationEventPayload.name = value as string;
          break;
        case "imageId":
          updatedDonationEventPayload.imageId = value as string;
          break;
        case "startDate":
          updatedDonationEventPayload.startDate = value as Date;
          break;
        case "endDate":
          updatedDonationEventPayload.endDate = value as Date;
          break;
        case "isActive":
          updatedDonationEventPayload.isActive = value as boolean;
          break;
        case "donationEventItems":
          if (Array.isArray(value)) {
            const newDonationEventItemIds = value.map(
              (donationEvent) => donationEvent.id,
            );
            const toBeRemovedIds = await this.removeDonationEventItemIds(
              id,
              newDonationEventItemIds as number[],
            );

            if (toBeRemovedIds.length > 0) {
              await Promise.all(
                toBeRemovedIds.map(async (id) => {
                  try {
                    await this.donationEventItemRepository.removeDonationEventItem(
                      id,
                    );
                  } catch (err) {
                    return {
                      action: false,
                      data: [],
                      message:
                        "You cannot delete a donation event item from an ongoing event!",
                    };
                  }
                }),
              );
            }

            await Promise.all(
              value.map(async (donationEventItem) => {
                // Update existing property
                if (donationEventItem.hasOwnProperty("id")) {
                  await this.donationEventItemRepository.updateDonationEventItem(
                    donationEventItem.id as number,
                    donationEventItem,
                  );
                } else {
                  const { item } = donationEventItem;
                  const { id: itemId } = item as Item;

                  await this.donationEventItemService.createItemFromEvent(
                    itemId,
                    id,
                    donationEventItem,
                  );
                }
              }),
            );
          }
          break;
        default:
          // Unlikely, since we already control the params through strongParams
          console.log("Invalid key provided");
      }
    });

    await Promise.all(_);

    console.log("let me update", updatedDonationEventPayload);
    const res = await this.donationEventRepository.updateDonationEventv1(
      id,
      updatedDonationEventPayload,
    );

    return {
      action: true,
      data: res,
      message: "Successfully updated donation event",
    };
  }

  async removeDonationEventItemIds(
    donationEventId: number,
    newDonationEventItemIds: number[],
  ) {
    const existingDonationEventItemIds =
      await this.donationEventRepository.findAllDonationEventItems(
        donationEventId,
      );
    const toBeRemovedIds = existingDonationEventItemIds.filter(
      (id) => !newDonationEventItemIds.includes(id),
    );

    return toBeRemovedIds;
  }

  // Filtering
  async getFilteredDonationEvents(
    filters: any,
    page: number,
  ): Promise<{ data: DonationEvent[]; pagination: IPagination }> {
    return this.donationEventRepository.filterDonationEvents(filters, page);
  }
}
