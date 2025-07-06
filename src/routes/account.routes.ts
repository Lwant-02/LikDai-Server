import { Router } from "express";
import {
  deleteAccount,
  getAchievements,
  getProfile,
  updatePassword,
  updateUsername,
} from "../controller/account.controllers";
import { verifyAccessToken } from "../middleware/auth.middleware";

export const accountRouter: Router = Router();

accountRouter.get("/me", verifyAccessToken, getProfile);
accountRouter.get("/achievements", verifyAccessToken, getAchievements);
accountRouter.patch("/update-username", verifyAccessToken, updateUsername);
accountRouter.patch("/update-password", verifyAccessToken, updatePassword);
accountRouter.delete("/delete-account", verifyAccessToken, deleteAccount);
