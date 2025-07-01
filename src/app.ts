import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import { FRONTEND_URL } from "./config/env.config";

const app = express();

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(helmet());
app.use(cookieParser());

export default app;
