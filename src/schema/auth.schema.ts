import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .regex(/^(?=.*[a-z])(?=.*\d)[a-z0-9]+$/, {
      message:
        "Username must contain at least one lowercase letter and one number",
    }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/^(?=.*[a-zA-Z])(?=.*\d).+$/, {
      message: "Password must contain at least one letter and one number",
    }),
});

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/^(?=.*[a-zA-Z])(?=.*\d).+$/, {
      message: "Password must contain at least one letter and one number",
    }),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});
