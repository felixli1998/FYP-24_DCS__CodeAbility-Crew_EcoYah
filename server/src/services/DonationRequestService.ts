import { DonationRequestRepository } from "../repositories/DonationRequestRepository";
import { DonationRequest } from "../entities/DonationRequest";
import { DonationRequestItem } from "../entities/DonationRequestItem";
import { DonationRequestUpdatePayload } from "../routes/donationRequestRoutes";
import { DonationRequestItemRepository } from "../repositories/DonationRequestItemRepository";
import { DonationEventItemRepository } from "../repositories/DonationEventItemRepository";
import { UserPointsService } from "./UserPointsService";
import { UserPointsRepository } from "../repositories/UserPointsRepository";
import { TransactionHistoryRepository } from "../repositories/TransactionHistoryRepository";
import { TransactionHistoryService } from "./TransactionHistoryService";
import { Action } from "../entities/TransactionHistory";
import { UserRepository } from "../repositories/UserRepository";

export class DonationRequestService {
  private donationRequestRepository: DonationRequestRepository;
  private donationRequestItemRepository: DonationRequestItemRepository;
  private donationEventItemRepository: DonationEventItemRepository;
  private userPointsService: UserPointsService;
  private userRepository: UserRepository;
  private transactionHistoryService: TransactionHistoryService;

  constructor(donationRequestRepository: DonationRequestRepository) {
    this.donationRequestRepository = donationRequestRepository;
    this.donationRequestItemRepository = new DonationRequestItemRepository();
    this.donationEventItemRepository = new DonationEventItemRepository();

    const userPointsRepository = new UserPointsRepository();
    this.userPointsService = new UserPointsService(userPointsRepository);

    const transactionHistoryRepository = new TransactionHistoryRepository();
    this.transactionHistoryService = new TransactionHistoryService(
      transactionHistoryRepository,
    );
  }

  async getActiveDonationRequestFromUser(user_id: number, page: number = 1) {
    return await this.donationRequestRepository.getActiveDonationRequestFromUser(
      user_id,
      page,
    );
  }

  async getCompletedDonationRequestFromUser(user_id: number, page: number = 1) {
    return await this.donationRequestRepository.getCompletedDonationRequestFromUser(
      user_id,
      page,
    );
  }

  async createDonationRequest(donationRequest: DonationRequest) {
    return await this.donationRequestRepository.createDonationRequest(
      donationRequest,
    );
  }

  async updateDonationRequest(donationRequest: DonationRequest) {
    return await this.donationRequestRepository.createDonationRequest(
      donationRequest,
    );
  }

  async withdrawDonationRequest(id: number) {
    return await this.donationRequestRepository.withdrawDonationRequest(id);
  }

  async createNewDonationRequestItem(
    donationRequestObj: DonationRequest,
    donationEventId: number,
    quantity: number,
  ) {
    const requestItem = new DonationRequestItem();
    const donationEventItem =
      await this.donationEventItemRepository.retrieveDonationEventItemById(
        donationEventId,
      );

    if (donationEventItem) {
      requestItem.donationRequest = donationRequestObj;
      requestItem.quantity = quantity;
      requestItem.donationEventItem = donationEventItem;
    }

    return requestItem;
  }

  async retrieveById(id: number) {
    return await this.donationRequestRepository.retrieveById(id);
  }

  async retrieveByUserId(user_id: number) {
    return await this.donationRequestRepository.retrieveByUserId(user_id);
  }

  async update(payload: DonationRequestUpdatePayload) {
    const { donationRequestId } = payload;
    const updatedRequestPayload: Partial<DonationRequest> = {};

    try {
      for (const [key, value] of Object.entries(payload)) {
        switch (key) {
          case "donationRequestId":
            break;
          case "dropOffDate":
            updatedRequestPayload.dropOffDate = new Date(value as string);
            break;
          case "dropOffTime":
            updatedRequestPayload.dropOffTime = value as string;
            break;
          case "omitPoints":
            updatedRequestPayload.omitPoints = value as boolean;
            break;
          case "oldDonationRequestItems":
            if (Array.isArray(value)) {
              await Promise.all(
                value.map(async (item) => {
                  const { id, quantity } = item;
                  this.donationRequestItemRepository.updateDonationRequestItem(
                    id,
                    { quantity },
                  );
                }),
              );
            }
            break;
          default:
            console.log("Invalid key provided.");
            break;
        }
      }

      const res = await this.donationRequestRepository.updateDonationRequest(
        donationRequestId,
        updatedRequestPayload,
      );
      return {
        action: true,
        data: res,
        message: "Successfully updated donation request",
      };
    } catch (error) {
      console.error(error);
      throw new Error();
    }
  }

  async retrieveDonationRequestByDate(date: Date) {
    return await this.donationRequestRepository.retrieveDonationRequestByDate(
      date,
    );
  }

  async completeDonationRequest(id: number) {
    const donationRequest =
      await this.donationRequestRepository.retrieveById(id);

    if (donationRequest) {
      let totalPts = 0;

      // if donationRequest.omitPoints is true, do not credit user points
      if (!donationRequest.omitPoints) {
        totalPts = await this.tabulateTotalPts(id);
        await this.userPointsService.creditUserPoints(
          donationRequest.user.id,
          totalPts,
        );
      }

      await Promise.all([
        this.userRepository.updateUser(donationRequest.user.email, {
          totalDonations: donationRequest.user.totalDonations + 1,
          lastDonation: new Date(),
          streak: donationRequest.user.streak + 1,
        }),
        this.transactionHistoryService.createTransactionHistory(
          Action.CREDITED,
          totalPts,
          donationRequest.user.userPoints.id,
          id,
        ),
      ]);
    }

    await Promise.all([
      this.updateDonationEventItemQty(id),
      this.donationRequestRepository.completeDonationRequest(id), // Mark donation request as completed
    ]);
  }

  async retrieveDonationRequestCountByEventId(
    donationEventId: number,
  ): Promise<number> {
    return await this.donationRequestRepository.retrieveDonationRequestCountByEventId(
      donationEventId,
    );
  }

  // Helper functions below
  validateDonationRequestItems(donationRequestItem: DonationRequestItem[]): {
    valid: boolean;
    message: string;
  } {
    // Check not empty
    if (donationRequestItem.length === 0) {
      return {
        valid: false,
        message: "Donation request items cannot be empty",
      };
    }
    // Check quantity
    for (const item of donationRequestItem) {
      if (item.quantity < 1) {
        return {
          valid: false,
          message: "Quantity must be at least 1",
        };
      }
    }
    return {
      valid: true,
      message: "Donation request items are valid",
    };
  }

  private async tabulateTotalPts(id: number) {
    // Based on the donation request ID, retrieve all the donation request items
    const donationRequestItems =
      await this.donationRequestItemRepository.retrieveByDonationRequestId(id);

    let totalPts = 0;
    for (const donationRequestItem of donationRequestItems) {
      totalPts +=
        donationRequestItem.donationEventItem.pointsPerUnit *
        donationRequestItem.quantity;
    }

    return totalPts;
  }

  private async updateDonationEventItemQty(id: DonationRequest["id"]) {
    const donationRequestItems =
      await this.donationRequestItemRepository.retrieveByDonationRequestId(id);

    const payload = donationRequestItems.map((item) => {
      return {
        donationEventItemId: item.donationEventItem.id,
        newQty: item.donationEventItem.currentQty + item.quantity,
      };
    });

    await Promise.all(
      payload.map(async (item) => {
        this.donationEventItemRepository.updateDonationEventItemQty(
          item.donationEventItemId,
          item.newQty,
        );
      }),
    );
  }
}
