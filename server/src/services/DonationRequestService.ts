import { DonationRequestRepository } from '../repositories/DonationRequestRepository';
import { DonationRequest } from '../entities/DonationRequest';
import { DonationRequestItem } from '../entities/DonationRequestItem';
import { DonationRequestUpdatePayload } from '../routes/donationRequestRoutes';
import { DonationRequestItemRepository } from '../repositories/DonationRequestItemRepository';
import { DonationEventItemRepository } from '../repositories/DonationEventItemRepository';

export class DonationRequestService {
  private donationRequestRepository: DonationRequestRepository;
  private donationRequestItemRepository: DonationRequestItemRepository;
  private donationEventItemRepository: DonationEventItemRepository;

  constructor(donationRequestRepository: DonationRequestRepository) {
    this.donationRequestRepository = donationRequestRepository;
    this.donationRequestItemRepository = new DonationRequestItemRepository();
    this.donationEventItemRepository = new DonationEventItemRepository();
  }

  async createDonationRequest(donationRequest: DonationRequest) {
    return await this.donationRequestRepository.createDonationRequest(
      donationRequest
    );
  }

  async updateDonationRequest(donationRequest: DonationRequest) {
    return await this.donationRequestRepository.createDonationRequest(
      donationRequest
    );
  }

  async cancelDonationRequest(id: number) {
    return await this.donationRequestRepository.cancelDonationRequest(id);
  }

  async updateExistingDonationRequestItem(id: number, quantity: number) {
    const donationRequestItemObj =
      await this.donationRequestItemRepository.retrieveById(id);

    if (donationRequestItemObj) {
      donationRequestItemObj.quantity = quantity;
    }

    return donationRequestItemObj;
  }

  async createNewDonationRequestItem(
    donationEventId: number,
    quantity: number
  ) {
    const requestItem = new DonationRequestItem();
    const donationEventItem =
      await this.donationEventItemRepository.retrieveDonationEventItemById(
        donationEventId
      );

    if (donationEventItem) {
      requestItem.quantity = quantity;
      requestItem.donationEventItem = donationEventItem;
    }

    return requestItem;
  }

  async retrieveById(id: number) {
    return await this.donationRequestRepository.retrieveById(id);
  }

  async update(payload: DonationRequestUpdatePayload) {
    const { id } = payload;
    const donationRequestObj = await this.retrieveById(id);

    if (donationRequestObj == null) {
      return {
        action: false,
        data: [],
        message: 'Donation Request do not exist.',
      };
    }

    for (const [key, value] of Object.entries(payload)) {
      switch (key) {
        case 'id':
          break;
        case 'dropOffDate':
          donationRequestObj.dropOffDate = new Date(value as string);
          break;
        case 'dropOffTime':
          donationRequestObj.dropOffTime = value as string;
          break;
        case 'requestItems':
          if (Array.isArray(value)) {
            const requestItemsPromises = value.map(async (item) => {
              return await this.updateExistingDonationRequestItem(
                item.id,
                item.quantity as number
              );
            });

            const existingRequestItems =
              await this.donationRequestItemRepository.retrieveByDonationRequestId(
                donationRequestObj.id
              );

            const updatedRequestItems = (await Promise.all(
              requestItemsPromises
            )) as DonationRequestItem[];

            existingRequestItems.forEach((existingItem) => {
              // If the item is not in the updatedRequestItems array, append it to ensure it is not removed in an update
              if (
                !updatedRequestItems.find((item) => item.id === existingItem.id)
              ) {
                updatedRequestItems.push(existingItem);
              }
            });

            donationRequestObj.donationRequestItems = updatedRequestItems;
          }
          break;
        default:
          console.log('Invalid key provided.');
          break;
      }
    }

    const res =
      await this.donationRequestRepository.updateDonationRequest(
        donationRequestObj
      );

    return {
      action: true,
      data: res,
      message: 'Successfully updated donation request',
    };
  }

  async completeDonationRequest(id: number) {
    return await this.donationRequestRepository.completeDonationRequest(id);
  }

  async retrieveDonationRequestByDate(date: Date) {
    return await this.donationRequestRepository.retrieveDonationRequestByDate(
      date
    );
  }

  async completeDonationRequest(id: number) {
    return await this.donationRequestRepository.completeDonationRequest(id);
  }
}
