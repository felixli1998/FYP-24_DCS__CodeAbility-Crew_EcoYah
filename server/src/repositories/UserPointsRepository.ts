import { AppDataSource } from "../config/data-source";
import { UserPoints } from "../entities/UserPoints";

export class UserPointsRepository {
  async createUserPoints(userPoints: UserPoints) {
    return await AppDataSource.getRepository(UserPoints).save(userPoints);
  }

  async getUserPointsByUserId(userId: UserPoints['user']['id']) {
    return await AppDataSource.getRepository(UserPoints).findOne({ where: { user: { id: userId } } });
  }

  async updateUserPoints(userId: UserPoints['user']['id'], payload: Partial<UserPoints>) {
    await AppDataSource.getRepository(UserPoints).update({ user: { id: userId } }, payload);
  }
}