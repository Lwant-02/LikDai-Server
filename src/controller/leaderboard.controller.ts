import { Request, Response } from "express";

import prisma from "../lib/db.lib";
import { LanguageMode } from "../../generated/prisma";

export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const { mode, total, page } = req.query;
    const take = Number(total) || 10;
    const skip = (Number(page) - 1) * take;

    // Build dynamic where clause
    const whereClause: any = {
      mode: (mode as LanguageMode) || "eng",
    };

    const leaderboard = await prisma.leaderboard.findMany({
      where: whereClause,
      select: {
        id: true,
        wpm: true,
        accuracy: true,
        raw: true,
        consistency: true,
        tests_completed: true,
        mode: true,
        updatedAt: true,
        user: {
          select: {
            username: true,
          },
        },
      },
      orderBy: {
        wpm: "desc",
      },
      take: take,
      skip: skip,
    });
    const count = await prisma.leaderboard.count({
      where: whereClause,
    });
    if (!leaderboard) {
      res.status(404).json({
        isSuccess: false,
        message: "Leaderboard not found!",
      });
      return;
    }
    res.status(200).json({
      isSuccess: true,
      message: "Leaderboard found.",
      data: { leaderboard, totalPages: Math.ceil(count / take) },
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
