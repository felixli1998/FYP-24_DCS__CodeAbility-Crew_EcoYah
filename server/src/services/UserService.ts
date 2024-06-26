// External Imports
import { compare } from "bcrypt";

// Internal Imports
import { User } from "../entities/User";
import { UserRepository } from "../repositories/UserRepository";

export class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async login(email: User["email"], password: User["passwordDigest"]) {
    const user = await this.userRepository.getUserByEmail(email);

    // Defensive line; But unlikely since we check for email existence in the controller before calling this service
    if (!user) return false;

    const authenticated = await compare(password, user.passwordDigest);
    if (!authenticated) return false;

    return user;
  }

  async getAllUsers() {
    return this.userRepository.getAllUsers();
  }

  async getAllDonorEmails() {
    return this.userRepository.getAllDonorEmails();
  }

  async getAllAdminUsers() {
    return this.userRepository.getAllAdminUsers();
  }

  async getUserById(id: number) {
    return this.userRepository.getUserById(id);
  }

  async getUserByEmail(email: string) {
    return this.userRepository.getUserByEmail(email);
  }

  async createUser(user: User) {
    return this.userRepository.createUser(user);
  }

  async updateUser(email: string, payload: Partial<User>) {
    return this.userRepository.updateUser(email, payload);
  }

  async getAccountType(email: string) {
    return this.userRepository.getAccountType(email);
  }
}
