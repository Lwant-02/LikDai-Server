import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import { FRONTEND_URL } from "./config/env.config";
import authRouter from "./routes/auth.routes";

const app = express();

//Middlewares
app.use(express.json());
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(helmet());
app.use(cookieParser());

//API Routes
app.use("/api/auth", authRouter);

export default app;
