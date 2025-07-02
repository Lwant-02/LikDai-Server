import jwt from "jsonwebtoken";
import {
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  JWT_RESET_SECRET,
} from "../config/env.config";

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

export const generateResetToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_RESET_SECRET as string, {
    expiresIn: "10m",
  });
};
