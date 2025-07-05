import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { render } from "@react-email/components";

import { loginSchema, registerSchema } from "../schema/auth.schema";
import prisma from "../lib/db.lib";
import {
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
} from "../util/generateToken.util";
import {
  FRONTEND_URL,
  JWT_REFRESH_SECRET,
  JWT_RESET_SECRET,
  MAIL_USER,
  NODE_ENV,
} from "../config/env.config";
import WelcomeEmail from "../../react-email-starter/emails/welcome-email";
import { transporter } from "../lib/nodemailer.lib";
import ChangePasswordEmail from "../../react-email-starter/emails/change-password";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const isValid = registerSchema.safeParse({ username, email, password });
    if (!isValid.success) {
      res.status(400).json({
        isSuccess: false,
        message: "Invalid request! Please check your input.",
        errors: isValid.error.errors,
      });
      return;
    }
    //Check if the username is already taken
    const isUsernameExists = await prisma.user.findFirst({
      where: {
        username,
      },
    });
    if (isUsernameExists) {
      res.status(409).json({
        isSuccess: false,
        message: "Username already taken! Please choose another one.",
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
        message: "User already exists! Please login instead.",
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
        message: "User not found! Please register first.",
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
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    const accessToken = generateAccessToken(user.id);

    //Store refresh token in database
    await prisma.refreshToken.upsert({
      where: { userId: user.id },
      update: {
        token: hashedRefreshToken,
        expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      create: {
        userId: user.id,
        token: hashedRefreshToken,
        expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
    //Set refresh token as httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      isSuccess: true,
      message: "Login successful.",
      data: {
        accessToken,
      },
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
      sameSite: "strict",
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

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    //Check if user exists
    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      res.status(404).json({
        isSuccess: false,
        message: "This email is not registered!",
      });
      return;
    }

    //Generate reset token and Store reset token in database
    const resetToken = generateResetToken(user.id);
    const hashedResetToken = await bcrypt.hash(resetToken, 10);

    await prisma.resetToken.upsert({
      where: { userId: user.id },
      update: {
        token: hashedResetToken,
        expiredAt: new Date(Date.now() + 10 * 60 * 1000),
      },
      create: {
        userId: user.id,
        token: hashedResetToken,
        expiredAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    //Send reset email
    const emailHtml = await render(
      ChangePasswordEmail({
        username: user.username,
        resetLink: `${FRONTEND_URL}/change-password?token=${resetToken}`,
        expiryTime: "10 minutes",
      })
    );

    const options = {
      from: MAIL_USER,
      to: email,
      subject: "Reset your LikDai-Pro password",
      html: emailHtml,
    };
    await transporter.sendMail(options);

    //Send the response
    res.status(200).json({
      isSuccess: true,
      message:
        "Password reset email sent successfully. Please check your email!",
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({
      isSuccess: false,
      message: "Internal Server Error",
    });
    return;
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;
    //Verify the token
    const payload = jwt.verify(token, JWT_RESET_SECRET as string) as {
      userId: string;
    };
    const resetToken = await prisma.resetToken.findFirst({
      where: {
        userId: payload.userId,
      },
    });
    if (!resetToken) {
      res.status(401).json({
        isSuccess: false,
        message: "Invalid token!",
      });
      return;
    }
    //Check if token is expired
    if (resetToken.expiredAt < new Date()) {
      res.status(401).json({
        isSuccess: false,
        message: "Token expired!",
      });
      return;
    }
    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    //Update user password
    await prisma.user.update({
      where: {
        id: resetToken.userId,
      },
      data: {
        password: hashedPassword,
      },
    });
    //Delete reset token
    await prisma.resetToken.delete({
      where: {
        id: resetToken.id,
      },
    });
    //Send the response
    res.status(200).json({
      isSuccess: true,
      message: "Password changed successfully.",
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({
      isSuccess: false,
      message: "Internal Server Error",
    });
    return;
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      res.status(401).json({
        isSuccess: false,
        message: "Unauthorized",
      });
      return;
    }
    //Verify the token
    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET as string) as {
      userId: string;
    };
    //Check if the token is in the database
    const storedToken = await prisma.refreshToken.findFirst({
      where: {
        userId: payload.userId,
      },
    });
    if (!storedToken) {
      res.status(401).json({
        isSuccess: false,
        message: "Unauthorized",
      });
      return;
    }
    //Compare the token
    const isTokenValid = await bcrypt.compare(refreshToken, storedToken.token);
    if (!isTokenValid) {
      res.status(401).json({
        isSuccess: false,
        message: "Unauthorized",
      });
      return;
    }
    //Check if the token is expired
    if (storedToken.expiredAt < new Date()) {
      res.status(401).json({
        isSuccess: false,
        message: "Unauthorized",
      });
      return;
    }
    //Generate new access token
    const accessToken = generateAccessToken(payload.userId);
    res.status(200).json({
      isSuccess: true,
      message: "Token refreshed.",
      accessToken,
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({
      isSuccess: false,
      message: "Internal Server Error",
    });
    return;
  }
};
