import { Router } from "express";
import { getLeaderboard } from "../controller/leaderboard.controller";

export const leaderboardRouter: Router = Router();

leaderboardRouter.get("/get-leaderboard", getLeaderboard);
