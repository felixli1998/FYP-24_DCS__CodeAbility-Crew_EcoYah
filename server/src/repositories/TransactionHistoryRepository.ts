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
      transactionHistory
    );
  }

  async getCashbackRequests() {
    const cashbackRequests = await AppDataSource.getRepository(
      TransactionHistory
    )
      .createQueryBuilder("TH")
      .select([
        "TH.id as id",
        "TH.points as points",
        "TH.action as action",
        "TH.status as status",
        "user.id AS user_id", 
        "user.name AS name", 
      ])
      .innerJoin("TH.userPoints", "userPoints")
      .innerJoin("userPoints.user", "user")
      .where("TH.action = :action", { action: Action.REDEEMED })
      .andWhere("TH.status = :status", {
        status: Status.PENDING,
      })
      .getRawMany();
    
    const restructureResult = cashbackRequests.map((entry) => ({
      userId: entry.user_id,
      name: entry.name,
      points: entry.points,
      transactionHistory: {
        id: entry.id,
        action: entry.action,
        status: entry.status
      }
    }))
    
    return restructureResult;
  }

  async getTransactionHistory(id: number) {
    return await AppDataSource.getRepository(TransactionHistory).findOne({
      where: { id },
    });
  }

  async updateStatus(transactionHistoryId: number, status: string) {
    return AppDataSource.getRepository(TransactionHistory).update(
      transactionHistoryId,
      { status: status }
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
            `MAX(th.created_at) + INTERVAL '${EXPIRY_DATE} months'', 'expiry_date`
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
  async getTransactionHistoryByAction(
    userId: string,
    action?: TransactionHistory["action"]
  ) {
    const whereCondition: any = { userPoints: { user: { id: userId } } };
    let relations: string[] = ["donationRequest.donationEvent"];

    if (action == "credited") {
      whereCondition.action = In([Action.CREDITED]);
    } else if (action == "redeemed") {
      whereCondition.action = In([Action.REDEEMED, Action.EXPIRED]);
      whereCondition.status = In([Status.APPROVED, Status.SYSTEM]);
      relations = [];
    }

    const transactionHistory = await AppDataSource.getRepository(
      TransactionHistory
    ).find({
      where: whereCondition,
      relations: relations,
      order: {
        updatedAt: "DESC",
      },
    });

    const transactionHistoryWithNamesOnly: any = transactionHistory.map(
      (transaction) => {
        const { donationRequest } = transaction;
        if (donationRequest && donationRequest.donationEvent) {
          return {
            id: transaction.id,
            points: transaction.points,
            action: transaction.action,
            status: transaction.status,
            createdAt: transaction.createdAt,
            updatedAt: transaction.updatedAt,
            donationEvent: donationRequest.donationEvent.name,
          };
        }
        return transaction;
      }
    );

    return transactionHistoryWithNamesOnly;
  }
}
