import { User } from "../entities/User";
import { AppDataSource } from "../config/data-source";

// Interacts database open close
export class UserRepository {
  async getAllUsers() {
    return await AppDataSource.getRepository(User).find();
  }

  async createUser(user: User) {
    return await AppDataSource.getRepository(User).save(user);
  }

  async getUserById(id: User['id']) {
    return await AppDataSource.getRepository(User).findOne({ where: { id } });
  }

  async getUserByEmail(email: User['email']) {
    return await AppDataSource.getRepository(User).findOne({ where: { email } });
  }
}