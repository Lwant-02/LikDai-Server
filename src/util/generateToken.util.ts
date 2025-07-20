import jwt from "jsonwebtoken";

import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from "../config/env.config";

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_REFRESH_SECRET as string, {
    expiresIn: "7d",
  });
};

export const generateAccessToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_ACCESS_SECRET as string, {
    expiresIn: "15m",
  });
};

export const generateOTP = (): string => {
  return Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0");
};
