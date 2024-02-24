// External Imports
import express from 'express';

// Internal Imports
import { strongParams, generateResponse } from '../common/methods';
import { UserRepository } from '../repositories/UserRepository';
import { UserService } from '../services/UserService';

const router = express.Router();
const userRepository= new UserRepository();
const userService = new UserService(userRepository);

router.post('/login', async (req, res) => {
  try {
    const params = req.body;
    const allowedParams = ['email', 'password'];
    const filteredParams = strongParams(params, allowedParams);

    const { email = '', password = '' } = filteredParams; // In the event that these params are not properly supplied

    const isValidEmail = await userService.getUserByEmail(email);
    if(!isValidEmail) return generateResponse(res, 200, { action: false, message: 'wrong_email' });

    const user = await userService.login(email, password);
    if(!user) return generateResponse(res, 200, { action: false, message: 'wrong_credentials' });

    return generateResponse(res, 200, { action: true, data: user, message: 'login_success' });
  } catch (error) {
    return generateResponse(res, 500, "Something went wrong");
  }
});

export default router;