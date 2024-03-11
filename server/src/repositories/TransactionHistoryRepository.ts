import { AppDataSource } from "../config/data-source";
import { TransactionHistory } from "../entities/TransactionHistory";

// Interacts database open close
export class TransactionHistoryRepository {
  // Do something...
  async createTransactionHistory(transactionHistory: TransactionHistory) {
    return await AppDataSource.getRepository(TransactionHistory).save(transactionHistory);
  }

  /* Fetches transaction history by action (optional): 
      - If "action == NULL", return all transaction history regardless of action and status
      - If "action == 'credited'", return all transaction history with action "credited"
      - If "action == 'redeemed'", return all transaction history with action "redeemed" and status "accepted"
  */
  async getTransactionHistoryByAction(userId: string, action?: TransactionHistory["action"]) {
    // TODO: Refactor it to relate to user id in userPoints
    let whereCondition: any = { userPoints : {id: userId }};

    // TO DOUBLE CHECK AFTER "STATUS" IS ADDED TO THE TRANSACTION HISTORY TABLE
    if (action){
      whereCondition.action = action;
      if(action === "redeemed"){
        whereCondition.status = "accepted";
      }
    } 

    // TODO: Attach donation request information for "All" and "Credited" action
    return await AppDataSource.getRepository(TransactionHistory).find({
        where: whereCondition,
        order: {
          createdAt: "DESC",
        }
    });
  }
}
