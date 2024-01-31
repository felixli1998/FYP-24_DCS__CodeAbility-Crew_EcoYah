import express from 'express';
import { UserService } from '../services/UserService';
import { UserRepository } from '../repositories/UserRepository';
import { QueryFailedError } from 'typeorm';
import { hashSync } from 'bcrypt';
import { generateResponse, strongParams } from '../common/methods';

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

const router = express.Router();

router.get("/", async (req, res) => {
  // Get all users
  res.json("Successfully accessed user routes");
});

// Get all users that are admin and staff
router.get("/allAdmins", async (req, res) => {
  console.log("BACKEND /allAdmins userRoutes")
  const adminUsers = await userService.getAllAdminUsers();
  // console.log(adminUsers);
  res.status(200).json({adminUsers});

});

router.post('/', async (req, res) => {
  // Create user
  try {
    // Hash password
    req.body.passwordDigest = hashSync(req.body.passwordDigest, 10);
    const user = await userService.createUser(req.body);
    res.status(201).json({ id: user.id, message: "User created successfully." });
  } catch (error) {
    if (error instanceof QueryFailedError && error.driverError.code === '23505') {
      // Handle duplicate email error
      res.status(409).json({ message: "A user with this email already exists." });
    } else {
      res.status(500).json({ message: "Internal Server Error. Please refresh and try again." });
    }
  }
});

router.get("/:email", async (req, res) => {
  try {
    const { email } = req.params;

    const user = await userService.getUserByEmail(email);

    if (user === null) {
      generateResponse(res, 200, { action: false, message: "User not found", data: null });
    } else {
      const payload = {
        name: user.name,
        email: user.email,
        contactNum: user.contactNum,
        imageId: user.imageId,
        role: user.role,
      };
      generateResponse(res, 200, { action: true, message: "User found", data: payload });
    }
  } catch (error) {
    generateResponse(res, 500, { action: false, message: "Internal Server Error. Please refresh and try again.", data: null });
  }
});

export default router;