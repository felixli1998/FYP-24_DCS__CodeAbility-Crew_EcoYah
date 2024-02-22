// External Imports
import express from "express";
import { QueryFailedError } from "typeorm";
import { hashSync } from "bcrypt";
import jwt from 'jsonwebtoken';

// Internal Imports
import { generateResponse, strongParams } from "../common/methods";
import { User } from "../entities/User";
import { UserService } from "../services/UserService";
import { UserRepository } from "../repositories/UserRepository";

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

const router = express.Router();

const secretKey: string = process.env.JWT_SECRET_KEY || '';

// Get all users that are admin and staff
router.get("/allAdmins", async (req, res) => {
  try {
    const adminUsers = await userService.getAllAdminUsers();
    return generateResponse(res, 200, { action: true, message: adminUsers });
  } catch (error) {
    return generateResponse(res, 500, {
      action: false,
      message: "Internal Server Error. Please refresh and try again.",
    });
  }
});

// Get user by email
router.get("/:email", async (req, res) => {
  try {
    const { email } = req.params;

    const user = await userService.getUserByEmail(email);

    if (user === null) {
      return generateResponse(res, 200, {
        action: false,
        message: "User not found",
        data: null,
      });
    } else {
      const payload = {
        name: user.name,
        email: user.email,
        contactNum: user.contactNum,
        imageId: user.imageId,
        role: user.role,
      };
      return generateResponse(res, 200, {
        action: true,
        message: "User found",
        data: payload,
      });
    }
  } catch (error) {
    return generateResponse(res, 500, {
      action: false,
      message: "Internal Server Error. Please refresh and try again.",
      data: null,
    });
  }
});

// Create a new user
router.post("/create", async (req, res) => {
  const payload = req.body;
  payload["passwordDigest"] = hashSync(payload.password, 10); // hash password
  const allowedParams = ["name", "email", "contactNum", "passwordDigest"];
  const sanitisedPayload = strongParams(payload, allowedParams);

  const newUser = new User();
  newUser.name = sanitisedPayload.name;
  newUser.email = sanitisedPayload.email;
  newUser.contactNum = sanitisedPayload.contactNum;
  newUser.passwordDigest = sanitisedPayload.passwordDigest;

  try {
    const user = await userService.createUser(newUser);

    const accessTokenPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      imageId: user.imageId,
      role: user.role,
    };

    const accessToken = jwt.sign(accessTokenPayload, secretKey, { expiresIn: "1h" });
    const refreshToken = jwt.sign(accessTokenPayload, secretKey, { expiresIn: "1d" });

    res.cookie("token", refreshToken, {
      httpOnly: true,
      sameSite: "None" as any,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return generateResponse(res, 201, {
      action: true,
      message: "User created successfully.",
      token: accessToken
    });
  } catch (error) {
    if (
      error instanceof QueryFailedError &&
      error.driverError.code === "23505"
    ) {
      // Handle duplicate email error
      return generateResponse(res, 409, {
        action: false,
        message: "A user with this email already exists.",
      });
    } else {
      return generateResponse(res, 500, {
        action: false,
        message: "Internal Server Error.",
      });
    }
  }
});

// Update an existing user
router.put("/update", async (req, res) => {
  try {
    const payload = req.body;
    const allowedParams = ["name", "contactNum", "email"];
    const sanitisedPayload = strongParams(payload, allowedParams);
    const { email = "" } = sanitisedPayload;

    // Defensive Line - Check if email exists
    const user = await userService.getUserByEmail(email);
    if (!user) {
      generateResponse(res, 200, { action: false, message: "User not found" });
      return;
    }
    await userService.updateUser(email, sanitisedPayload);
    generateResponse(res, 200, {
      action: true,
      message: "User is updated successfully!",
    });
  } catch (error) {
    generateResponse(res, 500, {
      action: false,
      message: "An error occured while updating user",
    });
  }
});

export default router;
