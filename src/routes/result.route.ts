import { Router } from "express";
import { verifyAccessToken } from "../middleware/auth.middleware";
import { saveResults } from "../controller/result.controller";

export const saveResultRouter: Router = Router();

saveResultRouter.post("/save-results", verifyAccessToken, saveResults);
