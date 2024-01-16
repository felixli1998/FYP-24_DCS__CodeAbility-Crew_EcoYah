// External imports
import { compare } from 'bcrypt';

// services/ItemService.ts
import { User } from '../entities/User';
import { UserRepository } from '../repositories/UserRepository';


export class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async getUserByEmail(email: User['email']) {
    const user = await this.userRepository.getUserByEmail(email);

    return user;
  }

  async login(email: User['email'], password: User['password_digest']) {
    const user = await this.userRepository.getUserByEmail(email);

    // Defensive line; But unlikely since we check for email existence in the controller before calling this service
    if(!user) return false;

    const authenticated = await compare(password, user.password_digest);

    return authenticated;
  }

  async getAllUsers() {
    return this.userRepository.getAllUsers();
  }

  async createUser(user: User) {
    return this.userRepository.createUser(user);
  }
}
