"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCertificate = exports.submitCertificate = exports.deleteAccount = exports.updatePassword = exports.updateBio = exports.updateUsername = exports.getStats = exports.getHistory = exports.getAchievements = exports.getProfile = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_lib_1 = __importDefault(require("../lib/db.lib"));
const env_config_1 = require("../config/env.config");
const getProfile = async (req, res) => {
    try {
        const { userId } = req;
        const user = await db_lib_1.default.user.findUnique({
            where: { id: userId },
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
                where: { userId },
                select: {
                    testsCompleted: true,
                },
            }),
            db_lib_1.default.stats.findUnique({
                where: { userId },
                select: {
                    averageWpm: true,
                },
            }),
        ]);
        res.status(200).json({
            isSuccess: true,
            message: "User found.",
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
exports.getProfile = getProfile;
const getAchievements = async (req, res) => {
    try {
        const { userId } = req;
        if (!userId) {
            res.status(401).json({
                isSuccess: false,
                message: "Unauthorized",
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
                where: { userId },
                select: { achievementId: true, unlockedAt: true },
            }),
            db_lib_1.default.certificate.findUnique({
                where: { userId },
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
exports.getAchievements = getAchievements;
const getHistory = async (req, res) => {
    try {
        const { userId } = req;
        if (!userId) {
            res.status(401).json({
                isSuccess: false,
                message: "Unauthorized",
            });
            return;
        }
        const recentTests = await db_lib_1.default.typingTest.findMany({
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
exports.getHistory = getHistory;
const getStats = async (req, res) => {
    try {
        const { userId } = req;
        if (!userId) {
            res.status(401).json({
                isSuccess: false,
                message: "Unauthorized",
            });
            return;
        }
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
        const totalTests = await db_lib_1.default.typingTest.count({
            where: { userId },
        });
        const engTests = await db_lib_1.default.typingTest.count({
            where: { userId, mode: "eng" },
        });
        const shanTests = await db_lib_1.default.typingTest.count({
            where: { userId, mode: "shan" },
        });
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
exports.getStats = getStats;
const updateUsername = async (req, res) => {
    try {
        const { username } = req.body;
        const { userId } = req;
        const user = await db_lib_1.default.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            res.status(404).json({
                isSuccess: false,
                message: "User not found!",
            });
            return;
        }
        //Check if the new username is the same as the old one
        const isSameAsOldOne = username === user.username;
        if (isSameAsOldOne) {
            res.status(400).json({
                isSuccess: false,
                message: "New username can not be the same as current one!",
            });
            return;
        }
        //Check if the username is already taken by other user
        const isUsernameExists = await db_lib_1.default.user.findFirst({
            where: {
                username,
                NOT: {
                    id: userId,
                },
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
        await db_lib_1.default.user.update({
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
exports.updateUsername = updateUsername;
const updateBio = async (req, res) => {
    try {
        const { bio } = req.body;
        const { userId } = req;
        const user = await db_lib_1.default.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            res.status(404).json({
                isSuccess: false,
                message: "User not found!",
            });
            return;
        }
        //Update  bio
        await db_lib_1.default.user.update({
            where: {
                id: userId,
            },
            data: {
                bio,
            },
        });
        res.status(200).json({
            isSuccess: true,
            message: "Bio updated successfully.",
        });
        return;
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
exports.updateBio = updateBio;
const updatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const { userId } = req;
        const user = await db_lib_1.default.user.findUnique({
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
        const isPasswordCorrect = await bcrypt_1.default.compare(oldPassword, user.password);
        if (!isPasswordCorrect) {
            res.status(400).json({
                isSuccess: false,
                message: "Old password is incorrect!",
            });
            return;
        }
        //Hash new password
        const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
        //Update user password
        await db_lib_1.default.user.update({
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
exports.updatePassword = updatePassword;
const deleteAccount = async (req, res) => {
    try {
        const { userId } = req;
        const user = await db_lib_1.default.user.findUnique({
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
        await db_lib_1.default.user.delete({
            where: {
                id: userId,
            },
        });
        //Clear cookies
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: env_config_1.NODE_ENV === "production",
            sameSite: "strict",
        });
        res.status(200).json({
            isSuccess: true,
            message: "Account deleted successfully.",
        });
        return;
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
exports.deleteAccount = deleteAccount;
const submitCertificate = async (req, res) => {
    try {
        const { fullName } = req.body;
        const { userId } = req;
        const user = await db_lib_1.default.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            res.status(404).json({
                isSuccess: false,
                message: "User not found!",
            });
            return;
        }
        //Submit certificate
        await db_lib_1.default.certificate.create({
            data: {
                userId,
                isSubmitted: true,
                fullName,
            },
        });
        res.status(200).json({
            isSuccess: true,
            message: "Certificate submitted successfully.",
        });
        return;
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
exports.submitCertificate = submitCertificate;
const getCertificate = async (req, res) => {
    try {
        const { userId } = req;
        const certificate = await db_lib_1.default.certificate.findUnique({
            where: { userId },
            select: {
                createdAt: true,
                fullName: true,
            },
        });
        if (!certificate) {
            res.status(404).json({
                isSuccess: false,
                message: "Certificate not found!",
            });
            return;
        }
        res.status(200).json({
            isSuccess: true,
            message: "Certificate found.",
            data: certificate,
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
exports.getCertificate = getCertificate;
