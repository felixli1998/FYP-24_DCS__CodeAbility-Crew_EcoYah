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


  async createNewDonationRequestItem(
    donationRequestObj: DonationRequest,
    donationEventId: number,
    quantity: number
  ) {
    const requestItem = new DonationRequestItem();
    const donationEventItem =
      await this.donationEventItemRepository.retrieveDonationEventItemById(
        donationEventId
      );

    if (donationEventItem) {
      requestItem.donationRequest = donationRequestObj
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
    const updatedRequestPayload: Partial<DonationRequest> = {};

    for (const [key, value] of Object.entries(payload)) {
      switch (key) {
        case 'id':
          break;
        case 'dropOffDate':
          updatedRequestPayload.dropOffDate = new Date(value as string);
          break;
        case 'dropOffTime':
          updatedRequestPayload.dropOffTime = value as string;
          break;
        case 'requestItems':
          if (Array.isArray(value)) {
            await Promise.all(value.map(async (item) => {
              const { id, quantity } = item;
              this.donationRequestItemRepository.updateDonationRequestItem(id, { quantity })
            }));
          }
          break;
        default:
          console.log('Invalid key provided.');
          break;
      }
    }

    const res = await this.donationRequestRepository.updateDonationRequest(id, updatedRequestPayload)

    return {
      action: true,
      data: res,
      message: 'Successfully updated donation request',
    };
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
