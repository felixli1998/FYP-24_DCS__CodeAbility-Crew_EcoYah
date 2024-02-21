// External Imports
import express from 'express';
import jwt from 'jsonwebtoken';

// Internal Imports
import { strongParams, generateResponse } from '../common/methods';
import { UserRepository } from '../repositories/UserRepository';
import { UserService } from '../services/UserService';

const router = express.Router();
const userRepository= new UserRepository();
const userService = new UserService(userRepository);

const secretKey: string = process.env.JWT_SECRET_KEY || '';

router.post('/login', async (req, res) => {
  try { 
    const params = req.body;
    const allowedParams = ['email', 'password'];
    const filteredParams = strongParams(params, allowedParams);

    const { email = '', password = '' } = filteredParams; // In the event that these params are not properly supplied

    const isValidEmail = await userService.getUserByEmail(email);
    if(!isValidEmail) return generateResponse(res, 200, { action: false, message: 'wrong_email' });

    const authenticated = await userService.login(email, password);
    if(!authenticated) return generateResponse(res, 200, { action: false, message: 'wrong_credentials' });

    const accessToken = jwt.sign({ email }, secretKey, { expiresIn: '1h' });
    res.cookie('token', accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
    return generateResponse(res, 200, { action: true, message: 'login_success', token: accessToken});
  } catch (error) {
    return generateResponse(res, 500, "Something went wrong");
  }
});

export default router;