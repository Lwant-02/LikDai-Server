"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaderboardRouter = void 0;
const express_1 = require("express");
const leaderboard_controller_1 = require("../controller/leaderboard.controller");
exports.leaderboardRouter = (0, express_1.Router)();
exports.leaderboardRouter.get("/get-leaderboard", leaderboard_controller_1.getLeaderboard);
