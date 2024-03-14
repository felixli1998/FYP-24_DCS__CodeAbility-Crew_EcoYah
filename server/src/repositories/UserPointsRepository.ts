import { AppDataSource } from "../config/data-source";
import { UserPoints } from "../entities/UserPoints";

export class UserPointsRepository {
  async createUserPoints(userPoints: UserPoints) {
    return await AppDataSource.getRepository(UserPoints).save(userPoints);
  }

  async getUserPointsByUserId(userId: UserPoints["user"]["id"]) {
    const selectOptions = {
      id: true,
      points: true,
      user: {
        id: true, 
        name: true
      }
    };
    return await AppDataSource.getRepository(UserPoints).findOne({
      select: selectOptions,
      where: { user: { id: userId } },
      relations: [ 'user' ]
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
