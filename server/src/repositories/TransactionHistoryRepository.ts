import { AppDataSource } from "../config/data-source";
import { Action, EXPIRY_DATE, TransactionHistory } from "../entities/TransactionHistory";
export class TransactionHistoryRepository {
  async createTransactionHistory(transactionHistory: TransactionHistory) {
    return await AppDataSource.getRepository(TransactionHistory).save(transactionHistory);
  }

  async getExpiringDateForEachUser() {
    const result = await AppDataSource.getRepository(TransactionHistory)
                                    .createQueryBuilder("transactionHistory")
                                    .select("user_points_id")
                                    .addSelect(`MAX(created_at) + INTERVAL \'${EXPIRY_DATE} months\'', 'expiry_date`)
                                    .where('action = :action', { action: Action.CREDITED })
                                    .groupBy('user_points_id')
                                    .getRawMany();

      return result;
  }
}
