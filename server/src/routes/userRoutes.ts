import express from "express";
import { UserService } from "../services/UserService";
import { UserRepository } from "../repositories/UserRepository";
import { QueryFailedError } from "typeorm";
import { hashSync } from "bcrypt";
import { generateResponse, strongParams } from "../common/methods";

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

const router = express.Router();

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

router.get("/get-account-type", async (req, res) => {
  try {
    const params = req.query;
    const filterParams = strongParams(params, ["email"]);
    const { email } = filterParams;

    const accountType = await userService.getAccountType(email);
    generateResponse(res, 200, {
      action: true,
      message: "User account type found",
      data: accountType,
    });
  } catch (error) {
    generateResponse(res, 500, {
      action: false,
      message: "An error occured while getting user account type",
    });
  }
});

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
        id: user.id,
        name: user.name,
        email: user.email,
        contactNum: user.contactNum,
        imageId: user.imageId,
        role: user.role,
        points: user.userPoints.points,
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

router.post("/", async (req, res) => {
  // Create user
  try {
    // Hash password
    req.body.passwordDigest = hashSync(req.body.passwordDigest, 10);
    req.body.imageId = "DefaultProfilePicture.jpg";
    const user = await userService.createUser(req.body);
    res
      .status(201)
      .json({ id: user.id, message: "User created successfully." });
  } catch (error) {
    if (
      error instanceof QueryFailedError &&
      error.driverError.code === "23505"
    ) {
      // Handle duplicate email error
      res
        .status(409)
        .json({ message: "A user with this email already exists." });
    } else {
      res
        .status(500)
        .json({
          message: "Internal Server Error. Please refresh and try again.",
        });
    }
  }
});

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
