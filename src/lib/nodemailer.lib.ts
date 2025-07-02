import nodemailer from "nodemailer";
import { MAIL_PASS, MAIL_USER } from "../config/env.config";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  },
});
