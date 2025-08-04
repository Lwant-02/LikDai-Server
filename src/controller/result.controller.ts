import { Request, Response } from "express";
import { typingTestSchema } from "../schema/result.schema";
import prisma from "../lib/db.lib";

// Function to recalculate correct averages from all test data
const recalculateAverages = async (tx: any, userId: string) => {
  const allTests = await tx.typingTest.findMany({
    where: { userId },
    select: { wpm: true, accuracy: true },
  });

  if (allTests.length === 0) {
    return { averageWpm: 0, averageAccuracy: 0, testsCompleted: 0 };
  }

  const totalWpm = allTests.reduce(
    (sum: number, test: any) => sum + test.wpm,
    0
  );
  const totalAccuracy = allTests.reduce(
    (sum: number, test: any) => sum + test.accuracy,
    0
  );

  return {
    averageWpm: totalWpm / allTests.length,
    averageAccuracy: totalAccuracy / allTests.length,
    testsCompleted: allTests.length,
  };
};

export const saveResults = async (req: Request, res: Response) => {
  try {
    const { userId } = req;
    const {
      wpm,
      accuracy,
      raw,
      consistency,
      timeTaken,
      mode,
      test_type,
      characters,
      correct_chars,
    } = req.body;
    const isValid = typingTestSchema.safeParse({
      wpm,
      accuracy,
      raw,
      consistency,
      timeTaken,
      mode,
      test_type,
      characters,
      correct_chars,
    });
    if (!userId) {
      res.status(401).json({
        isSuccess: false,
        message: "Unauthorized",
      });
      return;
    }
    if (!isValid.success) {
      res.status(400).json({
        isSuccess: false,
        message: "Invalid request! Please check your input.",
        errors: isValid.error.errors,
      });
      return;
    }

    // Fetch achievements and unlocked before transaction
    const allAchievements = await prisma.achievement.findMany();
    const unlocked = await prisma.userAchievement.findMany({
      where: { userId },
      select: { achievementId: true },
    });
    const unlockedIds = unlocked.map((un) => un.achievementId);

    // Fetch counts before transaction
    const [engTotalTest, shanTotalTest] = await Promise.all([
      prisma.typingTest.count({ where: { userId, mode: "eng" } }),
      prisma.typingTest.count({ where: { userId, mode: "shan" } }),
    ]);

    //Do all the stuff here if the typing test pass
    await prisma.$transaction(async (tx) => {
      //1-Save the typing test result
      await tx.typingTest.create({
        data: {
          userId,
          ...isValid.data,
        },
      });

      //2-Update  or create leaderboard
      await tx.leaderboard.upsert({
        where: {
          userId_mode: {
            userId,
            mode: mode,
          },
        },
        update: {
          wpm: wpm,
          accuracy: accuracy,
          raw: raw,
          consistency: consistency,
          tests_completed: {
            increment: 1,
          },
          updatedAt: new Date(),
        },
        create: {
          userId,
          wpm: wpm,
          accuracy: accuracy,
          raw: raw,
          consistency: consistency,
          mode: mode,
          tests_completed: 1,
        },
      });

      //3-Update or create stats
      const stats = await tx.stats.findUnique({ where: { userId: userId } });

      // Recalculate correct averages from all test data
      const recalculatedStats = await recalculateAverages(tx, userId);

      const newTestCompleted = recalculatedStats.testsCompleted + 1;
      const newAverageWpm =
        (recalculatedStats.averageWpm * recalculatedStats.testsCompleted +
          wpm) /
        newTestCompleted;
      const newAverageAccuracy =
        (recalculatedStats.averageAccuracy * recalculatedStats.testsCompleted +
          accuracy) /
        newTestCompleted;

      const newBestWpm = stats?.bestWpm ? Math.max(stats.bestWpm, wpm) : wpm;

      const totalTime = (stats?.totalTimePracticed ?? 0) + timeTaken;

      await tx.stats.upsert({
        where: { userId: userId },
        update: {
          averageWpm: newAverageWpm,
          averageAccuracy: newAverageAccuracy,
          bestWpm: newBestWpm,
          testsCompleted: newTestCompleted,
          totalTimePracticed: totalTime,
        },
        create: {
          userId,
          averageWpm: newAverageWpm,
          averageAccuracy: newAverageAccuracy,
          bestWpm: newBestWpm,
          testsCompleted: newTestCompleted,
          totalTimePracticed: timeTaken,
        },
      });
      //4-Check for new achivements unlock
      const newAchievement = allAchievements.filter((ach) => {
        if (unlockedIds.includes(ach.id)) return false;
        //Speed achievement
        if (ach.category === "speed" && wpm >= ach.threshold) return true;
        //Accuray achievement
        if (ach.category === "accuracy" && accuracy >= ach.threshold)
          return true;
        //Consistency achivement
        if (
          ach.category === "consistency" &&
          engTotalTest === ach.threshold &&
          shanTotalTest === ach.threshold
        )
          return true;
        //Practice achievement
        const totalHours = stats?.totalTimePracticed! / 3600;
        if (ach.category === "practice" && totalHours >= ach.threshold)
          return true;
        //Certificate achivement
        if (ach.category === "certificate" && unlocked.length >= ach.threshold)
          return true;
        return false;
      });
      //5-Insert newly unlocked
      await tx.userAchievement.createMany({
        data: newAchievement.map((ach) => ({
          userId,
          achievementId: ach.id,
          unlockedAt: new Date(),
        })),
        skipDuplicates: true,
      });
    });
    res.status(200).json({
      isSuccess: true,
      message: "Results saved successfully.",
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
