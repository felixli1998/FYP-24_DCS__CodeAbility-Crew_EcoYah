// Internal Imports
import { TransactionHistoryRepository } from "../repositories/TransactionHistoryRepository";
import { Action, TransactionHistory } from "../entities/TransactionHistory";
import { DonationRequest } from "../entities/DonationRequest";
import { UserPoints } from "../entities/UserPoints";


export class TransactionHistoryService {
  private transactionHistoryRepository: TransactionHistoryRepository;

  constructor(transactionHistoryRepository: TransactionHistoryRepository) {
    this.transactionHistoryRepository = transactionHistoryRepository;
  }

  // TODO: Might want to refactor this -- quite ugly way of doing things
  async createTransactionHistory(action: Action, amount: TransactionHistory["points"], userPointsID: UserPoints["id"], donationRequestID?: DonationRequest["id"]) {
    switch(action) {
      case Action.CREDITED:
        if (typeof(donationRequestID) == 'undefined') {
          throw new Error("Donation Request ID required");
        }

        const history = await this.handleCreditHistory(amount, userPointsID, donationRequestID);

        return history;
      case Action.EXPIRED:
        // do something
        break;
      case Action.REDEEMED:
        // do something
        break;
      default:
        // do something
        throw new Error(`Invalid action: ${action}`)
    }

  }

  private async handleCreditHistory(amount: TransactionHistory["points"], userPointsID: UserPoints["id"], donationRequestID: DonationRequest["id"]) {
    const newTransactionHistory = new TransactionHistory();

    newTransactionHistory.action = Action.CREDITED;
    newTransactionHistory.userPointsId = userPointsID; // Testing
    newTransactionHistory.donationRequestId = donationRequestID; // Testing
    newTransactionHistory.points = amount;

    const createdHistory = await this.transactionHistoryRepository.createTransactionHistory(newTransactionHistory);

    return createdHistory;
  }

  private async handleExpiredHistory(amount: TransactionHistory["points"]) {}

  private async handleRedeemedHistory(amount: TransactionHistory["points"]) {}
}
