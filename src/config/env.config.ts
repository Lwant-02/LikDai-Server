import { config } from "dotenv";

config();

export const { FRONTEND_URL, PORT, JWT_SECRET } = process.env;
