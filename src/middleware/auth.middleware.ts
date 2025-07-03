import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { JWT_ACCESS_SECRET } from "../config/env.config";

export const verifyAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    if (!token) {
      res.status(401).json({
        isSuccess: false,
        message: "Unauthorized. Access token is missing!",
      });
      return;
    }
    //Verify the access token and attach the userId to req
    const payload = jwt.verify(token, JWT_ACCESS_SECRET as string) as {
      userId: string;
    };
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      isSuccess: false,
      message: "Internal Server Error",
    });
    return;
  }
};
