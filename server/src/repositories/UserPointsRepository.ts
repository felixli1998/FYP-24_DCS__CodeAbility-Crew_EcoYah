import { AppDataSource } from "../config/data-source";
import { UserPoints } from "../entities/UserPoints";

export class UserPointsRepository {
  async createUserPoints(userPoints: UserPoints) {
    return await AppDataSource.getRepository(UserPoints).save(userPoints);
  }

  async getUserPointsByUserId(userId: UserPoints["user"]["id"]) {
    return await AppDataSource.getRepository(UserPoints).findOne({
      where: { user: { id: userId } },
    });
  }

  async updateUserPoints(
    userId: UserPoints["user"]["id"],
    payload: Partial<UserPoints>,
  ) {
    await AppDataSource.getRepository(UserPoints).update(
      { user: { id: userId } },
      payload,
    );
  }

  async addUserPoints(userId: UserPoints["user"]["id"], points: number) {
    const userPointsRepository = AppDataSource.getRepository(UserPoints);
    return await userPointsRepository.increment(
      { user: { id: userId } },
      "points",
      points,
    );
  }

  async deductUserPoints(userId: UserPoints["user"]["id"], points: number) {
    const userPointsRepository = AppDataSource.getRepository(UserPoints);
    return await userPointsRepository.decrement(
      { user: { id: userId } },
      "points",
      points,
    );
  }
  
}
