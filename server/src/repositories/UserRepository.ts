import { User, UserRole } from "../entities/User";
import { AppDataSource } from "../config/data-source";
import { In } from "typeorm";

// Interacts database open close
export class UserRepository {
  async getAllUsers() {
    return await AppDataSource.getRepository(User).find();
  }

  async getAllDonorEmails() {
    return await AppDataSource.getRepository(User).find({
      select: ["email"],
      where: { role: UserRole.DONOR },
    });
  }

  async getAllAdminUsers() {
    return await AppDataSource.getRepository(User).find({
      select: ["id", "name", "email", "imageId"],
      where: { role: In([UserRole.ADMIN, UserRole.STAFF]) },
      order: { name: "ASC" },
      cache: {
        id: "all-admin-users", // Cache Key
        milliseconds: 1200000, // 2 minutes
      },
    });
  }

  async createUser(user: User) {
    return await AppDataSource.getRepository(User).save(user);
  }

  async getUserById(id: User["id"]) {
    return await AppDataSource.getRepository(User).findOne({ where: { id } });
  }

  async getUserByEmail(email: User["email"]) {
    return await AppDataSource.getRepository(User).findOne({
      where: { email },
      relations: ["userPoints"],
    });
  }

  async updateUser(email: string, payload: Partial<User>) {
    await AppDataSource.getRepository(User).update({ email: email }, payload);
  }

  async getAccountType(email: User["email"]) {
    const user = await AppDataSource.getRepository(User).findOne({
      where: { email },
    });

    return user?.role;
  }
}
