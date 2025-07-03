import { Router } from "express";
import { getMe } from "../controller/account.controllers";

export const accountRouter: Router = Router();

accountRouter.get("/me", getMe);
