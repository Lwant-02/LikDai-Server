import { Request, Response } from "express";
import bcrypt from "bcrypt";

import { loginSchema, registerSchema } from "../schema/auth.schema";
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
        message: "User already exists!",
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

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const isValid = loginSchema.safeParse({ email, password });
    if (!isValid.success) {
      res.status(400).json({
        isSuccess: false,
        message: "Invalid request",
        errors: isValid.error.errors,
      });
      return;
    }
    //Check if user exists
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (!user) {
      res.status(404).json({
        isSuccess: false,
        message: "User not found!",
      });
      return;
    }
    //Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      res.status(401).json({
        isSuccess: false,
        message: "Incorrect password!",
      });
      return;
    }
    //Generate refresh and access token

    res.status(200).json({
      isSuccess: true,
      message: "Login successful",
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

export const logout = (req: Request, res: Response) => {
  res.send("Logout");
};

export const forgotPassword = (req: Request, res: Response) => {
  res.send("Forgot Password");
};
