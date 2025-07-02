import { Router } from "express";
import {
  register,
  login,
  logout,
  forgotPassword,
  changePassword,
} from "../controller/auth.controllers";

const authRouter: Router = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/change-password", changePassword);

export default authRouter;
