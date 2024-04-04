// Internal Imports
import { isSameDay } from "date-fns";
import { TransactionHistoryRepository } from "../repositories/TransactionHistoryRepository";
import { UserPointsRepository } from "../repositories/UserPointsRepository";
import { TransactionHistoryService } from "./TransactionHistoryService";
import { Action } from "../entities/TransactionHistory";

export class UserPointsService {
  private userPointsRepository: UserPointsRepository;
  private transactionHistoryRepository: TransactionHistoryRepository;
  private transactionHistoryService: TransactionHistoryService;

  constructor(userPointsRepository: UserPointsRepository) {
    this.userPointsRepository = userPointsRepository;
    this.transactionHistoryRepository = new TransactionHistoryRepository();
    this.transactionHistoryService = new TransactionHistoryService(
      this.transactionHistoryRepository,
    );
  }

  async getUserPoints(userId: number) {
    const userPoints =
      await this.userPointsRepository.getUserPointsByUserId(userId);
    return userPoints;
  }

  // TODO: Can we rename this to addUserPoints instead?
  // The difference between Update, add and deduct should be
  // Update : Does not care what the previous value is, just sets
  // Add: Has to be non negative
  // Deduct: Has to be non negative and less than the current value
  async creditUserPoints(userId: number, points: number) {
    const UserPoints =
      await this.userPointsRepository.getUserPointsByUserId(userId);

    if (UserPoints) {
      // TODO: Track User Points History
      // Implement this in the future OR we can use subscriber

      // Update User Points
      return await this.userPointsRepository.updateUserPoints(userId, {
        points: UserPoints.points + points,
      });
    }
  }

  async deductUserPoints(userId: number, points: number) {
    if (points <= 0) {
      throw new Error("Points to deduct must be a non zero positive number");
    }
    const UserPoints =
      await this.userPointsRepository.getUserPointsByUserId(userId);
    if (!UserPoints) {
      throw new Error("User does not have a points account.");
    }
    const currentPoints = UserPoints.points;
    if (currentPoints < points) {
      throw new Error("User does not have enough points for this transaction.");
    }
    return await this.userPointsRepository.deductUserPoints(userId, points);
  }
  /*
    A job that runs at 23:59 daily to for expiring userPoints
    a) If the user has points that expires on that day, the points should be expired
  */
  async expireUserPoints() {
    console.log("Screening for expiring user points...");

    const expiringUserPoints =
      await this.transactionHistoryRepository.getExpiringDateForEachUser();

    for (const record of expiringUserPoints) {
      const {
        user_points_id,
        user_id,
        expiry_date: expiry_date_with_tz,
        points,
      } = record;
      const today = new Date();

      if (isSameDay(new Date(expiry_date_with_tz), today) && points > 0) {
        console.log(`Expiring points for ${user_points_id} - ${points} points`);

        await this.userPointsRepository.updateUserPoints(user_id, {
          points: 0,
        });
        await this.transactionHistoryService.createTransactionHistory(
          Action.EXPIRED,
          points,
          user_points_id,
        );
      }
    }
  }
}
