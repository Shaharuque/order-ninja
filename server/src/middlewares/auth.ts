import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { config } from '../configs/config';
import { CustomRequest, IUserPayload } from '../Interfaces/CustomRequest';

const { JWT_KEY } = config;

export async function checkAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const cookies = req.cookies;
    const token = cookies.jwt;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decodeData = jwt.verify(token, JWT_KEY);
    (req as CustomRequest).user = decodeData as IUserPayload;

    next();
  } catch (error) {
    return res.sendStatus(401);
  }
}




