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

    const { email, password } = filteredParams;

    if(email.length === 0 || password.length === 0) {
      return generateResponse(res, 200, { action: false, message: 'Email and password fields must not be blank!' });
    }

    const isValidEmail = await userService.getUserByEmail(email);
    if(!isValidEmail) return generateResponse(res, 200, { action: false, message: 'Email does not exist!' });

    const authenticated = await userService.login(email, password);
    if(!authenticated) return generateResponse(res, 200, { action: true, message: 'Email or password is incorrect!' });

    return generateResponse(res, 200, { action: true, message: 'Login successful' });
  } catch (error) {
    return generateResponse(res, 500, "Something went wrong");
  }
});

export default router;