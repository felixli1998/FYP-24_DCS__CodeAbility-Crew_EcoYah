// Internal Imports
import { UserPointsRepository } from '../repositories/UserPointsRepository';


export class UserPointsService {
  private userPointsRepository: UserPointsRepository;

  constructor(userPointsRepository: UserPointsRepository) {
    this.userPointsRepository = userPointsRepository;
  }

  async creditUserPoints(userId: number, points: number) {
    const UserPoints = await this.userPointsRepository.getUserPointsByUserId(userId);

    if(UserPoints) {
      const currentPoints = UserPoints.points;
      const newPoints = currentPoints + points;

      // TODO: Track User Points History
      // Implement this in the future OR we can use subscriber

      // Update User Points
      await this.userPointsRepository.updateUserPoints(userId, { points: newPoints });
    }
  }
}
