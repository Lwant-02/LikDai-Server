import { Router } from "express";
import {
  register,
  login,
  logout,
  forgotPassword,
  changePassword,
  refreshToken,
  resendOtp,
  verifyOtp,
} from "../controller/auth.controllers";

const authRouter: Router = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/change-password", changePassword);
authRouter.post("/resend-otp", resendOtp);
authRouter.post("/verify-otp", verifyOtp);
authRouter.get("/refresh-token", refreshToken);

export default authRouter;
