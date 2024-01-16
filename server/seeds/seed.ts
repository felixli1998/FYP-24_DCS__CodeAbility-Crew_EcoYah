// External imports
import { hashSync } from 'bcrypt';

// Users
import { User } from '../src/entities/User';
import { UserRepository } from '../src/repositories/UserRepository';
import { UserService } from '../src/services/UserService';

type UserSeedDataT = {
  name: string;
  email: string;
  passwordInput: string;
  contactNum: string;
  imageURL: string;
};

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

// TODO: Feel free to populate more into the seed data as we add more tables //
const generateSeedData = async () => {
  console.log("=== Generating seed data ===")

  // Create users seed data //
  console.log("=== Generating users seed data ... ===")
  const USER_SEED_DATA: UserSeedDataT[] = [
    {
      name: 'Michael Jackson',
      email: 'michaeljackson1@gmail.com',
      passwordInput: 'Testpassw0rd!',
      contactNum: '+6512345678',
      imageURL: 'https://picsum.photos/200/300'
    }
  ]
  USER_SEED_DATA.map(async (user) => {
    const newUser = new User();
    const passwordDigest = hashSync(user.passwordInput, 10); // 10 is the salt rounds

    newUser.name = user.name;
    newUser.email = user.email;
    newUser.password_digest = passwordDigest;
    newUser.contact_num = user.contactNum;
    newUser.image_id = user.imageURL;

    await userService.createUser(newUser);
  })

  console.log("=== Generating of seed data completed ===")
}

export default generateSeedData;