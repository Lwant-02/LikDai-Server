"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPasswordSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    username: zod_1.z
        .string()
        .trim()
        .regex(/^(?=.*[a-z])(?=.*\d)[a-z0-9]+$/, {
        message: "Username must contain at least one lowercase letter and one number",
    }),
    email: zod_1.z.string().email({ message: "Invalid email address" }),
    password: zod_1.z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .regex(/^(?=.*[a-zA-Z])(?=.*\d).+$/, {
        message: "Password must contain at least one letter and one number",
    }),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email({ message: "Invalid email address" }),
    password: zod_1.z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .regex(/^(?=.*[a-zA-Z])(?=.*\d).+$/, {
        message: "Password must contain at least one letter and one number",
    }),
});
exports.forgotPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email({ message: "Invalid email address" }),
});
