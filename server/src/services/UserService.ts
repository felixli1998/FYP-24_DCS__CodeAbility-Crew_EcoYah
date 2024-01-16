// services/ItemService.ts
import { User } from '../entities/User';
import { UserRepository } from '../repositories/UserRepository';


export class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async getAllUsers() {
    return this.userRepository.getAllUsers();
  }

  async getUserByEmail(email: string) {
    return this.userRepository.getUserByEmail(email);
  }

  async createUser(user: User) {
    return this.userRepository.createUser(user);
  }
}
