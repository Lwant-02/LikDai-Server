import { Router } from "express";

import { submitReport } from "../controller/report.controller";
import { createRateLimiter } from "../lib/rate.limit";

export const reportRouter: Router = Router();

const reportLimiter = createRateLimiter({});

reportRouter.post("/submit", reportLimiter, submitReport);
