"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeaderboard = void 0;
const db_lib_1 = __importDefault(require("../lib/db.lib"));
const getLeaderboard = async (req, res) => {
    try {
        const { mode, total, page } = req.query;
        const take = Number(total);
        const skip = (Number(page) - 1) * take;
        const leaderboard = await db_lib_1.default.leaderboard.findMany({
            where: { mode: mode || "eng" },
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
        const count = await db_lib_1.default.leaderboard.count({
            where: {
                mode: mode === "shan" ? "shan" : "eng",
            },
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
exports.getLeaderboard = getLeaderboard;
