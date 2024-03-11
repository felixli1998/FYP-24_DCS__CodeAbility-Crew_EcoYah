import { AppDataSource } from "../config/data-source";
import { TransactionHistory } from "../entities/TransactionHistory";

// Interacts database open close
export class TransactionHistoryRepository {
  async createTransactionHistory(transactionHistory: TransactionHistory) {
    return await AppDataSource.getRepository(TransactionHistory).save(transactionHistory);
  }
}
