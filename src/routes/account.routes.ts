import { Router } from "express";
import {
  deleteAccount,
  getAchievements,
  getHistory,
  getProfile,
  getStats,
  updatePassword,
  updateUsername,
} from "../controller/account.controllers";
import { verifyAccessToken } from "../middleware/auth.middleware";

export const accountRouter: Router = Router();

accountRouter.get("/me", verifyAccessToken, getProfile);
accountRouter.get("/achievements", verifyAccessToken, getAchievements);
accountRouter.get("/history", verifyAccessToken, getHistory);
accountRouter.get("/stats", verifyAccessToken, getStats);
accountRouter.patch("/update-username", verifyAccessToken, updateUsername);
accountRouter.patch("/update-password", verifyAccessToken, updatePassword);
accountRouter.delete("/delete-account", verifyAccessToken, deleteAccount);
