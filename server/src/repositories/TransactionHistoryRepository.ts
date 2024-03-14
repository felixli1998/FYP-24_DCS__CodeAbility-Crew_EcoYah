import { AppDataSource } from "../config/data-source";
import {
  Action,
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
}
