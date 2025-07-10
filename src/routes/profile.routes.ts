import { Router } from "express";
import {
  getPublicProfile,
  getPublicAchievements,
  getPublicHistory,
  getPublicStats,
} from "../controller/profile.controllers";

export const profileRouter: Router = Router();

profileRouter.get("/me/:username", getPublicProfile);
profileRouter.get("/achievements/:username", getPublicAchievements);
profileRouter.get("/history/:username", getPublicHistory);
profileRouter.get("/stats/:username", getPublicStats);
