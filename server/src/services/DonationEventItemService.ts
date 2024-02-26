// Internal Imports
import { DonationEventItem } from "../entities/DonationEventItem";
import { DonationEventItemRepository } from "../repositories/DonationEventItemRepository";
import { DonationEventRepository } from "../repositories/DonationEventRepository";
import { DonationEvent } from "../entities/DonationEvent";
import { ItemRepository } from "../repositories/ItemRepository";
import { Item } from "../entities/Item";

export class DonationEventItemService {
  private donationItemRepository: DonationEventItemRepository;
  private donationEventRepository: DonationEventRepository;
  private itemRepository: ItemRepository;

  constructor(donationItemRepository: DonationEventItemRepository) {
    this.donationItemRepository = donationItemRepository;
    this.donationEventRepository = new DonationEventRepository();
    this.itemRepository = new ItemRepository();
  }

  async createDonationEventItem(donationEventItem: DonationEventItem) {
    return this.donationItemRepository.createDonationEventItem(
      donationEventItem
    );
  }

  async createItemFromEvent(
    itemId: number,
    donationEventId: number,
    donationEventItem: any
  ) {
    const { currentQty, minQty, pointsPerUnit, targetQty } = donationEventItem;
    const donationEvent =
      await this.donationEventRepository.getAllDonationEventById(
        donationEventId
      );
    const item = await this.itemRepository.getItemById(itemId);

    const donationEventItemObj = new DonationEventItem();
    donationEventItemObj.currentQty = currentQty;
    donationEventItemObj.minQty = minQty;
    donationEventItemObj.pointsPerUnit = pointsPerUnit;
    donationEventItemObj.targetQty = targetQty;
    donationEventItemObj.donationEvent = donationEvent as DonationEvent; // Assign the donationEvent object
    donationEventItemObj.item = item as Item;

    const createdDonationEventItem =
      await this.createDonationEventItem(donationEventItemObj); // Pass the donationEventItemObj

    return createdDonationEventItem;
  }

  async updateDonationEventItem(
    id: DonationEventItem["id"],
    payload: Partial<DonationEventItem>
  ) {
    return this.donationItemRepository.updateDonationEventItem(id, payload);
  }

  async retrieveDonationEventItemById(id: number) {
    return this.donationItemRepository.retrieveDonationEventItemById(id);
  }

  async getDonationEventItembyDonationEventId(donationEventId: number) {
    return this.donationItemRepository.getDonationEventItembyDonationEventId(
      donationEventId
    );
  }
}
