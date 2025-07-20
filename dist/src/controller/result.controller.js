"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveResults = void 0;
const result_schema_1 = require("../schema/result.schema");
const db_lib_1 = __importDefault(require("../lib/db.lib"));
const saveResults = async (req, res) => {
    try {
        const { userId } = req;
        const { wpm, accuracy, raw, consistency, timeTaken, mode, test_type, characters, correct_chars, } = req.body;
        const isValid = result_schema_1.typingTestSchema.safeParse({
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
        const allAchievements = await db_lib_1.default.achievement.findMany();
        const unlocked = await db_lib_1.default.userAchievement.findMany({
            where: { userId },
            select: { achievementId: true },
        });
        const unlockedIds = unlocked.map((un) => un.achievementId);
        // Fetch counts before transaction
        const [engTotalTest, shanTotalTest] = await Promise.all([
            db_lib_1.default.typingTest.count({ where: { userId, mode: "eng" } }),
            db_lib_1.default.typingTest.count({ where: { userId, mode: "shan" } }),
        ]);
        //Do all the stuff here if the typing test pass
        await db_lib_1.default.$transaction(async (tx) => {
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
            const newTestCompleted = stats?.testsCompleted + 1 || 1;
            const totalWpm = stats?.averageWpm * stats?.testsCompleted || 0;
            const newAverageWpm = (totalWpm + wpm) / newTestCompleted;
            const newAverageAccuracy = stats?.averageAccuracy
                ? (stats.averageAccuracy + accuracy) / newTestCompleted
                : accuracy;
            const newBestWpm = stats?.bestWpm ? Math.max(stats.bestWpm, wpm) : wpm;
            await tx.stats.upsert({
                where: { userId: userId },
                update: {
                    averageWpm: newAverageWpm,
                    averageAccuracy: newAverageAccuracy,
                    bestWpm: newBestWpm,
                    testsCompleted: newTestCompleted,
                    totalTimePracticed: stats?.totalTimePracticed + timeTaken || timeTaken,
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
                if (unlockedIds.includes(ach.id))
                    return false;
                //Speed achievement
                if (ach.category === "speed" && wpm >= ach.threshold)
                    return true;
                //Accuray achievement
                if (ach.category === "accuracy" && accuracy >= ach.threshold)
                    return true;
                //Consistency achivement
                if (ach.category === "consistency" &&
                    engTotalTest === ach.threshold &&
                    shanTotalTest === ach.threshold)
                    return true;
                //Practice achievement
                const totalHours = stats?.totalTimePracticed / 3600;
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
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            isSuccess: false,
            message: "Internal Server Error",
        });
        return;
    }
};
exports.saveResults = saveResults;
