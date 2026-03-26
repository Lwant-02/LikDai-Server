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
  googleLogin,
} from "../controller/auth.controllers";
import { createRateLimiter } from "../lib/rate.limit";

const authRouter: Router = Router();

const authLimiter = createRateLimiter({});

authRouter.post("/register", authLimiter, register);
authRouter.post("/login", authLimiter, login);
authRouter.post("/logout", logout);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/change-password", changePassword);
authRouter.post("/resend-otp", authLimiter, resendOtp);
authRouter.post("/verify-otp", verifyOtp);
authRouter.get("/refresh-token", refreshToken);
authRouter.post("/google-login", authLimiter, googleLogin);

export default authRouter;
