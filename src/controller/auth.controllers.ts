import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { loginSchema, registerSchema } from "../schema/auth.schema";
import prisma from "../lib/db.lib";
import {
  generateAccessToken,
  generateOTP,
  generateRefreshToken,
} from "../util/generateToken.util";
import { JWT_REFRESH_SECRET, MAIL_USER, NODE_ENV } from "../config/env.config";
import { transporter } from "../lib/nodemailer.lib";
import {
  generateWelcomeEmail,
  generateResetPasswordEmail,
} from "../templates/emailTemplates";
import { generateUsername } from "../util/generateUsername.util";

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
    const emailHtml = generateWelcomeEmail({ name: username, email });

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
      sameSite: NODE_ENV === "production" ? "none" : "strict",
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

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: NODE_ENV === "production" ? "none" : "strict",
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
    const newOtp = generateOTP();
    await prisma.oTP.upsert({
      where: { userId: user.id },
      update: {
        otp: newOtp,
        expiredAt: new Date(Date.now() + 30 * 60 * 1000), //30 minutes
      },
      create: {
        userId: user.id,
        otp: newOtp,
        expiredAt: new Date(Date.now() + 30 * 60 * 1000),
      },
    });

    //Send otp email
    const emailHtml = generateResetPasswordEmail({
      name: user.username,
      email: email,
      otp: newOtp,
    });

    const options = {
      from: MAIL_USER,
      to: email,
      subject: "Verify the OTP to reset your password",
      html: emailHtml,
    };
    await transporter.sendMail(options);

    //Send the response
    res.status(200).json({
      isSuccess: true,
      message: "OTP sent successfully. Please check your email to verify.",
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

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    //Check if user exists
    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      res.status(404).json({
        isSuccess: false,
        message: "This email is not registered!",
      });
      return;
    }
    //Check if otp is correct
    const storedOtp = await prisma.oTP.findFirst({
      where: {
        userId: user.id,
      },
    });
    if (!storedOtp) {
      res.status(401).json({
        isSuccess: false,
        message: "Invalid OTP!",
      });
      return;
    }
    //Check if otp is expired
    if (storedOtp.expiredAt < new Date()) {
      res.status(401).json({
        isSuccess: false,
        message: "OTP expired!",
      });
      return;
    }
    //Check if otp is correct
    if (storedOtp.otp !== otp) {
      res.status(401).json({
        isSuccess: false,
        message: "Invalid OTP!",
      });
      return;
    }
    //Delete otp
    await prisma.oTP.delete({
      where: {
        userId: user.id,
      },
    });
    //Send the response
    res.status(200).json({
      isSuccess: true,
      message: "OTP verified successfully.",
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
    const { email, password } = req.body;
    //Check if user exists
    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      res.status(404).json({
        isSuccess: false,
        message: "This email is not registered!",
      });
      return;
    }
    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    //Update user password
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
      },
    });
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

export const resendOtp = async (req: Request, res: Response) => {
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
    //Generate new otp
    const newOtp = generateOTP();
    await prisma.oTP.upsert({
      where: { userId: user.id },
      update: {
        otp: newOtp,
        expiredAt: new Date(Date.now() + 30 * 60 * 1000), //30 minutes
      },
      create: {
        userId: user.id,
        otp: newOtp,
        expiredAt: new Date(Date.now() + 30 * 60 * 1000),
      },
    });
    //Send otp email
    const emailHtml = generateResetPasswordEmail({
      name: user.username,
      email: email,
      otp: newOtp,
    });

    const options = {
      from: MAIL_USER,
      to: email,
      subject: "Verify the OTP to reset your password",
      html: emailHtml,
    };
    await transporter.sendMail(options);

    //Send the response
    res.status(200).json({
      isSuccess: true,
      message: "OTP sent successfully. Please check your email to verify.",
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
        message: "Unauthorized! No refresh token provided.",
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
        message: "Unauthorized! Invalid refresh token.",
      });
      return;
    }
    //Compare the token
    const isTokenValid = await bcrypt.compare(refreshToken, storedToken.token);
    if (!isTokenValid) {
      res.status(401).json({
        isSuccess: false,
        message: "Unauthorized! Token is not the same.",
      });
      return;
    }
    //Check if the token is expired
    if (storedToken.expiredAt < new Date()) {
      res.status(401).json({
        isSuccess: false,
        message: "Unauthorized! Token expired.",
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

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;

    if (!email || !name) {
      return res.status(400).json({
        isSuccess: false,
        message: "Email and name are required",
      });
    }

    //Try to find user by email
    let user = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (!user) {
      const finalUsername = await generateUsername(name);
      // Create new user
      user = await prisma.user.create({
        data: {
          email,
          username: finalUsername,
          password: `GoogleLogin-${Date.now()}`,
        },
      });
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
      sameSite: NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      isSuccess: true,
      message: "Login successful.",
      data: {
        accessToken,
      },
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
