import { Request, Response } from "express";

import prisma from "../lib/db.lib";

export const getPublicProfile = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        email: true,
        joinedAt: true,
        bio: true,
      },
    });
    if (!user) {
      res.status(404).json({
        isSuccess: false,
        message: "User not found!",
      });
      return;
    }
    //Get total tests and average wpm
    const [totalTests, averageWpm] = await Promise.all([
      prisma.stats.findUnique({
        where: { userId: user.id },
        select: {
          testsCompleted: true,
        },
      }),
      prisma.stats.findUnique({
        where: { userId: user.id },
        select: {
          averageWpm: true,
        },
      }),
    ]);
    res.status(200).json({
      isSuccess: true,
      message: "User profile found.",
      data: {
        ...user,
        totalTests: totalTests?.testsCompleted || 0,
        averageWpm: averageWpm?.averageWpm || 0,
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

export const getPublicAchievements = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    if (!username) {
      res.status(401).json({
        isSuccess: false,
        message: "Unauthorized",
      });
      return;
    }
    const user = await prisma.user.findUnique({
      where: { username },
    });
    if (!user) {
      res.status(404).json({
        isSuccess: false,
        message: "User not found!",
      });
      return;
    }
    const [allAchievements, unlockedAchievements, certificate] =
      await Promise.all([
        prisma.achievement.findMany({
          select: {
            id: true,
            name: true,
            requirement: true,
            threshold: true,
            category: true,
          },
        }),
        prisma.userAchievement.findMany({
          where: { userId: user.id },
          select: { achievementId: true, unlockedAt: true },
        }),
        prisma.certificate.findUnique({
          where: { userId: user.id },
          select: { isSubmitted: true },
        }),
      ]);
    res.status(200).json({
      isSuccess: true,
      message: "Achievements found.",
      data: {
        allAchievements,
        unlockedAchievements,
        isSubmitted: certificate?.isSubmitted || false,
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

export const getPublicHistory = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    if (!username) {
      res.status(401).json({
        isSuccess: false,
        message: "Unauthorized",
      });
      return;
    }
    const user = await prisma.user.findUnique({
      where: { username },
    });
    if (!user) {
      res.status(404).json({
        isSuccess: false,
        message: "User not found!",
      });
      return;
    }
    const recentTests = await prisma.typingTest.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        wpm: true,
        accuracy: true,
        mode: true,
        createdAt: true,
        lessonLevel: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
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

export const getPublicStats = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    if (!username) {
      res.status(401).json({
        isSuccess: false,
        message: "Unauthorized",
      });
      return;
    }
    const user = await prisma.user.findUnique({
      where: { username },
    });
    if (!user) {
      res.status(404).json({
        isSuccess: false,
        message: "User not found!",
      });
      return;
    }
    const userId = user.id;
    const stats = await prisma.stats.findUnique({
      where: { userId },
      select: {
        averageWpm: true,
        bestWpm: true,
        averageAccuracy: true,
        testsCompleted: true,
        totalTimePracticed: true,
      },
    });
    //Get language distribution
    const [totalTests, engTests, shanTests] = await Promise.all([
      prisma.typingTest.count({
        where: { userId },
      }),
      prisma.typingTest.count({
        where: { userId, mode: "eng" },
      }),
      prisma.typingTest.count({
        where: { userId, mode: "shan" },
      }),
    ]);
    const engDistribution = (engTests / totalTests) * 100;
    const shanDistribution = (shanTests / totalTests) * 100;
    res.status(200).json({
      isSuccess: true,
      message: "Stats found.",
      data: {
        ...stats,
        engDistribution,
        shanDistribution,
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
