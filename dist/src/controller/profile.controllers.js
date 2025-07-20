"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicStats = exports.getPublicHistory = exports.getPublicAchievements = exports.getPublicProfile = void 0;
const db_lib_1 = __importDefault(require("../lib/db.lib"));
const getPublicProfile = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await db_lib_1.default.user.findUnique({
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
            db_lib_1.default.stats.findUnique({
                where: { userId: user.id },
                select: {
                    testsCompleted: true,
                },
            }),
            db_lib_1.default.stats.findUnique({
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
exports.getPublicProfile = getPublicProfile;
const getPublicAchievements = async (req, res) => {
    try {
        const { username } = req.params;
        if (!username) {
            res.status(401).json({
                isSuccess: false,
                message: "Unauthorized",
            });
            return;
        }
        const user = await db_lib_1.default.user.findUnique({
            where: { username },
        });
        if (!user) {
            res.status(404).json({
                isSuccess: false,
                message: "User not found!",
            });
            return;
        }
        const [allAchievements, unlockedAchievements, certificate] = await Promise.all([
            db_lib_1.default.achievement.findMany({
                select: {
                    id: true,
                    name: true,
                    requirement: true,
                    threshold: true,
                    category: true,
                },
            }),
            db_lib_1.default.userAchievement.findMany({
                where: { userId: user.id },
                select: { achievementId: true, unlockedAt: true },
            }),
            db_lib_1.default.certificate.findUnique({
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
exports.getPublicAchievements = getPublicAchievements;
const getPublicHistory = async (req, res) => {
    try {
        const { username } = req.params;
        if (!username) {
            res.status(401).json({
                isSuccess: false,
                message: "Unauthorized",
            });
            return;
        }
        const user = await db_lib_1.default.user.findUnique({
            where: { username },
        });
        if (!user) {
            res.status(404).json({
                isSuccess: false,
                message: "User not found!",
            });
            return;
        }
        const recentTests = await db_lib_1.default.typingTest.findMany({
            where: { userId: user.id },
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
            take: 10,
        });
        res.status(200).json({
            isSuccess: true,
            message: "History found.",
            data: recentTests,
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
exports.getPublicHistory = getPublicHistory;
const getPublicStats = async (req, res) => {
    try {
        const { username } = req.params;
        if (!username) {
            res.status(401).json({
                isSuccess: false,
                message: "Unauthorized",
            });
            return;
        }
        const user = await db_lib_1.default.user.findUnique({
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
        const stats = await db_lib_1.default.stats.findUnique({
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
            db_lib_1.default.typingTest.count({
                where: { userId },
            }),
            db_lib_1.default.typingTest.count({
                where: { userId, mode: "eng" },
            }),
            db_lib_1.default.typingTest.count({
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
exports.getPublicStats = getPublicStats;
