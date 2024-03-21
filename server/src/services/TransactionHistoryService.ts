// Internal Imports
import { TransactionHistoryRepository } from "../repositories/TransactionHistoryRepository";
import { Action, TransactionHistory, Status } from "../entities/TransactionHistory";
import { DonationRequest } from "../entities/DonationRequest";
import { UserPoints } from "../entities/UserPoints";

export class TransactionHistoryService {
  private transactionHistoryRepository: TransactionHistoryRepository;

  constructor(transactionHistoryRepository: TransactionHistoryRepository) {
    this.transactionHistoryRepository = transactionHistoryRepository;
  }

  async getCashbackRequests() {
    return await this.transactionHistoryRepository.getCashbackRequests();
  }

  async getTransactionHistoryByAction(userId: string, action?: TransactionHistory["action"]) {
    return await this.transactionHistoryRepository.getTransactionHistoryByAction(userId, action);
  }

  // TODO: Might want to refactor this -- quite ugly way of doing things
  async createTransactionHistory(action: Action, amount: TransactionHistory["points"], userPointsID: UserPoints["id"], donationRequestID?: DonationRequest["id"]) {
    switch(action) {
      case Action.CREDITED:
        if (typeof(donationRequestID) == 'undefined') {
          throw new Error("Donation Request ID required");
        }

        const creditHistory = await this.handleCreditHistory(amount, userPointsID, donationRequestID);

        return creditHistory;
      case Action.EXPIRED:
        const expiredHistory = await this.handleExpiredHistory(amount, userPointsID);

        return expiredHistory;
      case Action.REDEEMED:
        const redeemedHistory = await this.handleRedeemedHistory(amount, userPointsID);

        return redeemedHistory;
      default:
        throw new Error(`Invalid action: ${action}`)
    }

  }

  private async handleCreditHistory(amount: TransactionHistory["points"], userPointsID: UserPoints["id"], donationRequestID: DonationRequest["id"]) {
    const newTransactionHistory = new TransactionHistory();

    newTransactionHistory.action = Action.CREDITED;
    newTransactionHistory.userPointsId = userPointsID;
    newTransactionHistory.donationRequestId = donationRequestID;
    newTransactionHistory.points = amount;

    const createdHistory = await this.transactionHistoryRepository.createTransactionHistory(newTransactionHistory);

    return createdHistory;
  }

  private async handleExpiredHistory(amount: TransactionHistory["points"], userPointsID: UserPoints["id"]) {
    const newTransactionHistory = new TransactionHistory();

    newTransactionHistory.action = Action.EXPIRED;
    newTransactionHistory.userPointsId = userPointsID;
    newTransactionHistory.points = amount;

    const createdHistory = await this.transactionHistoryRepository.createTransactionHistory(newTransactionHistory);

    return createdHistory;
  }

  private async handleRedeemedHistory(amount: TransactionHistory["points"], userPointsID: UserPoints["id"]) {
    const newTransactionHistory = new TransactionHistory();

    newTransactionHistory.action = Action.REDEEMED;
    newTransactionHistory.userPointsId = userPointsID;
    newTransactionHistory.points = amount;

    const createdHistory = await this.transactionHistoryRepository.createTransactionHistory(newTransactionHistory);

    return createdHistory;
  }

  async getExpiringDateForEachUser() {
    return await this.transactionHistoryRepository.getExpiringDateForEachUser();
  }

  // Admin accept or reject the cashback redemption
  async handleRedeemed(transactionHistoryId: number, isAccept: boolean ) {
    const transactionHistory = await this.transactionHistoryRepository.getTransactionHistory(transactionHistoryId);

    if (!transactionHistory) {
      throw new Error(`Transaction history with id ${transactionHistoryId} not found`);
    }

    if (transactionHistory.status !== Status.PENDING) {
      throw new Error(`Transaction history with id ${transactionHistoryId} has already been handled`);
    }

    const newStatus = isAccept ? Status.APPROVED : Status.REJECTED;

    const updateTransactionHistoryStatus = await this.transactionHistoryRepository.updateStatus(transactionHistoryId, newStatus);

    return updateTransactionHistoryStatus;
  }
}
