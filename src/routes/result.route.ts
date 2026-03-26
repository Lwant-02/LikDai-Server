import { Router } from "express";
import { verifyAccessToken } from "../middleware/auth.middleware";
import { saveResults } from "../controller/result.controller";
import { createRateLimiter } from "../lib/rate.limit";

export const saveResultRouter: Router = Router();

const saveResultLimiter = createRateLimiter({ max: 3 });

saveResultRouter.post(
  "/save-results",
  saveResultLimiter,
  verifyAccessToken,
  saveResults,
);
