import { In } from "typeorm";
import { AppDataSource } from "../config/data-source";
import {
  Action,
  Status,
  EXPIRY_DATE,
  TransactionHistory,
} from "../entities/TransactionHistory";
import { UserPoints } from "../entities/UserPoints";
export class TransactionHistoryRepository {
  async createTransactionHistory(transactionHistory: TransactionHistory) {
    return await AppDataSource.getRepository(TransactionHistory).save(
      transactionHistory,
    );
  }

  async getExpiringDateForEachUser() {
    const result = await AppDataSource.getRepository(UserPoints)
      .createQueryBuilder()
      .select("t1.user_points_id", "user_points_id")
      .addSelect("UserPoints.user_id", "user_id")
      .addSelect("UserPoints.points", "points")
      .addSelect("t1.expiry_date", "expiry_date")
      .from((subQuery) => {
        return subQuery
          .select("th.user_points_id", "user_points_id")
          .addSelect(
            `MAX(th.created_at) + INTERVAL '${EXPIRY_DATE} months'', 'expiry_date`,
          )
          .from(TransactionHistory, "th")
          .where("th.action = :action", { action: Action.CREDITED })
          .groupBy("th.user_points_id");
      }, "t1")
      .where("t1.user_points_id = UserPoints.id")
      .getRawMany();

    return result;
  }

  /* 
    Fetches transaction history (by action): 
      - If "action == NULL", return ALL transaction history regardless of action and status
      - If "action == 'credited'", return all transaction history with action "credited"
      - If "action == 'redeemed'", return all transaction history with action "redeemed" with status "accepted" or action "expired"
  */
  async getTransactionHistoryByAction(userId: string, action?: TransactionHistory["action"]) {
    let whereCondition: any = { userPoints : { user: {id: userId }}};
    let relations: string[] = ["donationRequest.donationEvent"];

    // TODO: AFTER "STATUS" IS ADDED TO THE TRANSACTION HISTORY TABLE
    if (action){
      if(action == "credited") {
        whereCondition.action = In([Action.CREDITED]);
        relations = ["donationRequest.donationEvent"];
      }
      if(action == "redeemed"){
        whereCondition.action = In([Action.REDEEMED, Action.EXPIRED]);
        whereCondition.status = In([Status.APPROVED, Status.SYSTEM]);
        relations = [];
      }
    }

    const transactionHistory = await AppDataSource.getRepository(TransactionHistory).find({
        where: whereCondition,
        relations: relations,
        order: {
          createdAt: "DESC",
        }
    });

    const transactionHistoryWithNamesOnly: any = transactionHistory.map(transaction => {
      console.log(transaction);
      const { donationRequest } = transaction;
      if (donationRequest && donationRequest.donationEvent) {
          return {
              id: transaction.id,
              points: transaction.points,
              action: transaction.action,
              status: transaction.status,
              createdAt: transaction.createdAt,
              updatedAt: transaction.updatedAt,
              donationEvent: donationRequest.donationEvent.name
          };
      }
      return transaction;
    });

    return transactionHistoryWithNamesOnly;
  }
}
