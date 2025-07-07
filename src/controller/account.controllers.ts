import { Request, Response } from "express";
import bcrypt from "bcrypt";

import prisma from "../lib/db.lib";
import { NODE_ENV } from "../config/env.config";

//TODO: Add averageWpm to user
export const getProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        joinedAt: true,
      },
    });
    //Get total typing tests
    const totalTests = await prisma.stats.findUnique({
      where: { userId },
      select: {
        testsCompleted: true,
      },
    });
    if (!user) {
      res.status(404).json({
        isSuccess: false,
        message: "User not found!",
      });
      return;
    }
    res.status(200).json({
      isSuccess: true,
      message: "User found.",
      data: {
        ...user,
        totalTests: totalTests?.testsCompleted || 0,
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

//Need to fix
export const getAchievements = async (req: Request, res: Response) => {
  try {
    const { userId } = req;
    if (!userId) {
      res.status(401).json({
        isSuccess: false,
        message: "Unauthorized",
      });
      return;
    }
    const [allAchievements, unlockedAchievements] = await Promise.all([
      prisma.achievement.findMany(),
      prisma.userAchievement.findMany({
        where: { userId },
        select: { achievementId: true, unlockedAt: true },
      }),
    ]);
    res.status(200).json({
      isSuccess: true,
      message: "Achievements found.",
      data: { allAchievements, unlockedAchievements },
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

export const getHistory = async (req: Request, res: Response) => {
  try {
    const { userId } = req;
    if (!userId) {
      res.status(401).json({
        isSuccess: false,
        message: "Unauthorized",
      });
      return;
    }
    const recentTests = await prisma.typingTest.findMany({
      where: { userId },
      select: {
        id: true,
        wpm: true,
        accuracy: true,
        mode: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });
    res.status(200).json({
      isSuccess: true,
      message: "History found.",
      data: recentTests,
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

export const updateUsername = async (req: Request, res: Response) => {
  try {
    const { username } = req.body;
    const { userId } = req;
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      res.status(404).json({
        isSuccess: false,
        message: "User not found!",
      });
      return;
    }
    //Check if username is already taken
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
    //Update username
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        username,
      },
    });
    res.status(200).json({
      isSuccess: true,
      message: "Username updated successfully.",
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

export const updatePassword = async (req: Request, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const { userId } = req;
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      res.status(404).json({
        isSuccess: false,
        message: "User not found!",
      });
      return;
    }
    //Check if old password is correct
    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordCorrect) {
      res.status(400).json({
        isSuccess: false,
        message: "Old password is incorrect!",
      });
      return;
    }
    //Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    //Update user password
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
      },
    });
    res.status(200).json({
      isSuccess: true,
      message: "Password updated successfully.",
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

export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const { userId } = req;
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      res.status(404).json({
        isSuccess: false,
        message: "User not found!",
      });
      return;
    }
    //Delete user
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });
    //Clear cookies
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).json({
      isSuccess: true,
      message: "Account deleted successfully.",
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
