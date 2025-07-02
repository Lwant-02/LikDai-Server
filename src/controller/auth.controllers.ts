import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { render } from "@react-email/components";

import { loginSchema, registerSchema } from "../schema/auth.schema";
import prisma from "../lib/db.lib";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../util/generateToken.util";
import { MAIL_USER, NODE_ENV } from "../config/env.config";
import WelcomeEmail from "../../react-email-starter/emails/welcome-email";
import { transporter } from "../lib/nodemailer.lib";

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

    //Send welcome email
    const emailHtml = await render(WelcomeEmail({ username }));

    const options = {
      from: MAIL_USER,
      to: email,
      subject: "Welcome to LikDai-Pro!",
      html: emailHtml,
    };
    await transporter.sendMail(options);

    //Send the response
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
    const refreshToken = generateRefreshToken(user.id);
    const accessToken = generateAccessToken(user.id);

    //Store refresh token in database
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
    //Set refresh token as httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      isSuccess: true,
      message: "Login successful.",
      accessToken,
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
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "none",
    });
    res.status(200).json({
      isSuccess: true,
      message: "Logout successful.",
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

export const forgotPassword = (req: Request, res: Response) => {
  res.send("Forgot Password");
};
