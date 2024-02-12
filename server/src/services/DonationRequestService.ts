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

  async cancelDonationRequest(id: number) {
    return await this.donationRequestRepository.cancelDonationRequest(id);
  }

  async updateDonationRequestItem(
    requestItems: Partial<DonationRequestItem>[]
  ) {
    const res = await requestItems.map(async (requestItem) => {
      // Updating an existing item
      if (requestItem.id) {
        const donationRequestItemObj =
          await this.donationRequestItemRepository.retrieveById(requestItem.id);

        if (donationRequestItemObj && requestItem.quantity) {
          donationRequestItemObj.quantity = requestItem.quantity;
        }

        return donationRequestItemObj;
      } else {
        return;
      }
    });

    return res;
  }

  async retrieveById(id: number) {
    return await this.donationRequestRepository.retrieveById(id);
  }

  async update(payload: DonationRequestUpdatePayload) {
    const { id } = payload;
    const donationRequestObj = await this.retrieveById(id);

    if (donationRequestObj == null) return;

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
          const newRequestItem = [];
          if (Array.isArray(value)) {
            const requestItemsPromises = value.map(async (item) => {
              // This is to update an existing request item
              if (item.id) {
                const requestItem =
                  await this.donationRequestItemRepository.retrieveById(
                    item.id
                  );
                if (requestItem && item.quantity) {
                  requestItem.quantity = item.quantity;
                }
                return requestItem;
              } else {
                const requestItem = new DonationRequestItem();
                if (item.donationEventId) {
                  const donationEventItem =
                    await this.donationEventItemRepository.retrieveDonationEventItemById(
                      item.donationEventId
                    );
                  if (donationEventItem) {
                    requestItem.quantity = item.quantity as number;
                    requestItem.donationEventItem = donationEventItem;
                  }
                  return requestItem;
                }
                // This is to create a new request item
              }
            });
            const requestItems = await Promise.all(requestItemsPromises);
            donationRequestObj.donationRequestItems = requestItems as DonationRequestItem[];
          }
          break;
        default:
          return 'Invalid key provided.';
      }
    }

    return await this.donationRequestRepository.updateDonationRequest(
      donationRequestObj
    );
  }
}
