import { Router } from "express";

import { submitReport } from "../controller/report.controller";

export const reportRouter: Router = Router();

reportRouter.post("/submit", submitReport);
