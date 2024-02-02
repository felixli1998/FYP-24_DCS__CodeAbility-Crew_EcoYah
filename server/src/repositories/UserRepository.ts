import { User, UserRole } from "../entities/User";
import { AppDataSource } from "../config/data-source";
import { In } from "typeorm";

// Interacts database open close
export class UserRepository {
  async getAllUsers() {
    return await AppDataSource.getRepository(User).find();
  }

  async getAllAdminUsers() {
    return await AppDataSource.getRepository(User)
      .createQueryBuilder("user")
      .select(["user.id", "user.name", "user.email", "user.imageId"])
      .where({ role: In([UserRole.ADMIN, UserRole.STAFF]) })
      .orderBy("user.name", "ASC")
      .getMany();
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

  async updateUser(email: string, payload: Partial<User>) {
    await AppDataSource.getRepository(User).update({ email: email }, payload)
  }
}