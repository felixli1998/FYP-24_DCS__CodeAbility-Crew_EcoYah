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

    const user = await userService.login(email, password);
    if (!user)
      return generateResponse(res, 200, {
        action: false,
        message: "wrong_credentials",
      });

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

    return generateResponse(res, 200, { action: true, message: 'login_success', token: accessToken});
  } catch (error) {
    return generateResponse(res, 500, "Something went wrong");
  }
});

router.post('/refresh-token', async (req, res) => {
  if (req.cookies?.token) {
    const refreshToken = req.cookies.token;

    jwt.verify(refreshToken, secretKey, (err: any, decoded: any) => {
      if (err) {
        // Wrong Refresh Token
        return generateResponse(res, 406, { action: false, message: 'Unauthorized' });
      } else {
        // Correct token, send a new access token
        const accessToken = jwt.sign(
          {
            id: decoded.id, 
            email: decoded.email,
            name: decoded.name,
            imageId: decoded.imageId,
            role: decoded.role,
          },
          secretKey,
          { expiresIn: '1d' }
        );
        return generateResponse(res, 200, { action: true, token: accessToken });
      }
    });
  } else {
    return generateResponse(res, 406, { action: false, message: 'Unauthorized' });
  }
});

export default router;