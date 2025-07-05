import { Request, Response, NextFunction } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { JWT_ACCESS_SECRET } from "../config/env.config";
import prisma from "../lib/db.lib";

export const verifyAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader =
      typeof req.headers.authorization === "string"
        ? req.headers.authorization
        : undefined;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        isSuccess: false,
        message: "Unauthorized – missing or malformed Authorization header",
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    const payload = jwt.verify(token, JWT_ACCESS_SECRET!) as {
      userId: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      res.status(401).json({
        isSuccess: false,
        message: "Unauthorized – user no longer exists",
      });
      return;
    }
    req.userId = payload.userId;
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      res.status(401).json({
        isSuccess: false,
        message: "Unauthorized – token expired",
      });
      return;
    }

    if (error instanceof JsonWebTokenError) {
      res.status(401).json({
        isSuccess: false,
        message: `Unauthorized – ${error.message}`,
      });
      return;
    }

    console.error("verifyAccessToken:", error);
    res.status(500).json({
      isSuccess: false,
      message: "Internal Server Error",
    });
  }
};
