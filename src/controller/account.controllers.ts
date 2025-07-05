import { Request, Response } from "express";
import prisma from "../lib/db.lib";

//TODO: Add averageWpm to user
export const getMe = async (req: Request, res: Response) => {
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
    const totalTests = await prisma.typingTest.count({
      where: { userId },
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
        totalTests,
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
