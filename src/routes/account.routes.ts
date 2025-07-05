import { Router } from "express";
import {
  deleteAccount,
  getMe,
  updatePassword,
  updateUsername,
} from "../controller/account.controllers";
import { verifyAccessToken } from "../middleware/auth.middleware";

export const accountRouter: Router = Router();

accountRouter.get("/me", verifyAccessToken, getMe);
accountRouter.patch("/update-username", verifyAccessToken, updateUsername);
accountRouter.patch("/update-password", verifyAccessToken, updatePassword);
accountRouter.delete("/delete-account", verifyAccessToken, deleteAccount);
