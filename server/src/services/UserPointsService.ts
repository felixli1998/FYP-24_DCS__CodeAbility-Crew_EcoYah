// Internal Imports
import { UserPointsRepository } from "../repositories/UserPointsRepository";

export class UserPointsService {
  private userPointsRepository: UserPointsRepository;

  constructor(userPointsRepository: UserPointsRepository) {
    this.userPointsRepository = userPointsRepository;
  }

  async getUserPoints(userId: number){
    const userPoints = await this.userPointsRepository.getUserPointsByUserId(userId);
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
      const currentPoints = UserPoints.points;
      const newPoints = currentPoints + points;

      // TODO: Track User Points History
      // Implement this in the future OR we can use subscriber

      // Update User Points
      return await this.userPointsRepository.updateUserPoints(userId, {
        points: newPoints,
      });
    }
  }

  async deductUserPoints(userId: number, points: number) {
    if (points <= 0) {
      throw new Error("Points to deduct must be a non zero positive number");
    }
    const UserPoints = await this.userPointsRepository.getUserPointsByUserId(userId);
    if (!UserPoints){
      throw new Error("User does not have a points account.");
    }
    const currentPoints = UserPoints.points;
    if (currentPoints < points) {
      throw new Error("User does not have enough points for this transaction.");
    }
    return await this.userPointsRepository.deductUserPoints(userId, points);
  }
}
