import express from 'express';
import { UserService } from '../services/UserService';
import { UserRepository } from '../repositories/UserRepository';
import { QueryFailedError } from 'typeorm';
import { hashSync } from 'bcrypt';

const router = express.Router();
const userRepository = new UserRepository();
const userService = new UserService(userRepository);

router.get("/", async (req, res) => {
  // Get all users
  res.json("Successfully accessed user routes");

});

router.post('/', async (req, res) => {
  // Create user
  try {
    // Hash password
    req.body.password_digest = hashSync(req.body.password_digest, 10);
    const user = await userService.createUser(req.body);
    res.status(201).json({ id: user.id, message: "User created successfully." });
  } catch (error) {
    if (error instanceof QueryFailedError && error.driverError.code === '23505') {
      // Handle duplicate email error
      res.status(409).json({ message: "A user with this email already exists. Did you forget your password?" });
    } else {
      res.status(500).json({ message: "Internal Server Error. Please refresh and try again" });
    }
  }
});

router.post('/get_user_by_email', (req, res) => {
  const user = userService.getUserByEmail(req.body.email)
  if (!user){
    res.send({message: "Email does not exist!"})
  } else {
    res.send(user)
  }
})

export default router;