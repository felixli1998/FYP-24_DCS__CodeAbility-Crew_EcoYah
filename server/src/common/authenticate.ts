import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const secretKey: string = process.env.JWT_SECRET_KEY || '';

type JwtPayload = {
    email: string;
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.headers['authorization'] as string;
    const refreshToken = req.cookies['refreshToken'] as string;
  
    if (!accessToken && !refreshToken) {
      return res.status(401).send('Access Denied. No token provided.');
    }
  
    try {
      const decoded = jwt.verify(accessToken, secretKey) as JwtPayload;
      (req as any).email = decoded.email;
      next();
    } catch (error) {
      if (!refreshToken) {
        return res.status(401).send('Access Denied. No refresh token provided.');
      }
  
      try {
        const decoded = jwt.verify(refreshToken, secretKey);
        const accessToken = jwt.sign( decoded , secretKey, { expiresIn: '1h' });
  
        res
          .cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' })
          .header('Authorization', accessToken)
          .send(decoded);
      } catch (error) {
        return res.status(400).send('Invalid Token.');
      }
    }
};

export default authenticate;
