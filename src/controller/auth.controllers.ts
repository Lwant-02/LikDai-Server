import { Request, Response } from "express";
import bcrypt from "bcrypt";

import { registerSchema } from "../schema/auth.schema";
import prisma from "../lib/db.lib";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const isValid = registerSchema.safeParse({ username, email, password });
    if (!isValid.success) {
      res.status(400).json({
        isSuccess: false,
        message: "Invalid request",
        errors: isValid.error.errors,
      });
      return;
    }
    //Check if user already exists
    const isUserExists = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (isUserExists) {
      res.status(409).json({
        isSuccess: false,
        message: "User already exists",
      });
      return;
    }
    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    //Create user
    await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
    res.status(201).json({
      isSuccess: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      isSuccess: false,
      message: "Internal Server Error",
    });
    return;
  }
};

export const login = (req: Request, res: Response) => {
  res.send("Login");
};

export const logout = (req: Request, res: Response) => {
  res.send("Logout");
};

export const forgotPassword = (req: Request, res: Response) => {
  res.send("Forgot Password");
};
