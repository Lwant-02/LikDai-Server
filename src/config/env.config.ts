import { config } from "dotenv";

config();

export const {
  FRONTEND_URL,
  PORT,
  JWT_REFRESH_SECRET,
  JWT_ACCESS_SECRET,
  NODE_ENV,
} = process.env;
