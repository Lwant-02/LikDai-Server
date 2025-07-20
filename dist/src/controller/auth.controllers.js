"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.changePassword = exports.forgotPassword = exports.logout = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const components_1 = require("@react-email/components");
const auth_schema_1 = require("../schema/auth.schema");
const db_lib_1 = __importDefault(require("../lib/db.lib"));
const generateToken_util_1 = require("../util/generateToken.util");
const env_config_1 = require("../config/env.config");
const welcome_email_1 = __importDefault(require("../../react-email-starter/emails/welcome-email"));
const nodemailer_lib_1 = require("../lib/nodemailer.lib");
const change_password_1 = __importDefault(require("../../react-email-starter/emails/change-password"));
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const isValid = auth_schema_1.registerSchema.safeParse({ username, email, password });
        if (!isValid.success) {
            res.status(400).json({
                isSuccess: false,
                message: "Invalid request! Please check your input.",
                errors: isValid.error.errors,
            });
            return;
        }
        //Check if the username is already taken
        const isUsernameExists = await db_lib_1.default.user.findFirst({
            where: {
                username,
            },
        });
        if (isUsernameExists) {
            res.status(409).json({
                isSuccess: false,
                message: "Username already taken! Please choose another one.",
            });
            return;
        }
        //Check if user already exists
        const isUserExists = await db_lib_1.default.user.findFirst({
            where: {
                email,
            },
        });
        if (isUserExists) {
            res.status(409).json({
                isSuccess: false,
                message: "User already exists! Please login instead.",
            });
            return;
        }
        //Hash password
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        //Create user
        await db_lib_1.default.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });
        //Send welcome email
        const emailHtml = await (0, components_1.render)((0, welcome_email_1.default)({ username }));
        const options = {
            from: env_config_1.MAIL_USER,
            to: email,
            subject: "Welcome to LikDai-Pro!",
            html: emailHtml,
        };
        await nodemailer_lib_1.transporter.sendMail(options);
        //Send the response
        res.status(201).json({
            isSuccess: true,
            message: "User created successfully",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            isSuccess: false,
            message: "Internal Server Error",
        });
        return;
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const isValid = auth_schema_1.loginSchema.safeParse({ email, password });
        if (!isValid.success) {
            res.status(400).json({
                isSuccess: false,
                message: "Invalid request",
                errors: isValid.error.errors,
            });
            return;
        }
        //Check if user exists
        const user = await db_lib_1.default.user.findFirst({
            where: {
                email,
            },
        });
        if (!user) {
            res.status(404).json({
                isSuccess: false,
                message: "User not found! Please register first.",
            });
            return;
        }
        //Check if password is correct
        const isPasswordCorrect = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordCorrect) {
            res.status(401).json({
                isSuccess: false,
                message: "Incorrect password!",
            });
            return;
        }
        //Generate refresh and access token
        const refreshToken = (0, generateToken_util_1.generateRefreshToken)(user.id);
        const hashedRefreshToken = await bcrypt_1.default.hash(refreshToken, 10);
        const accessToken = (0, generateToken_util_1.generateAccessToken)(user.id);
        //Store refresh token in database
        await db_lib_1.default.refreshToken.upsert({
            where: { userId: user.id },
            update: {
                token: hashedRefreshToken,
                expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
            create: {
                userId: user.id,
                token: hashedRefreshToken,
                expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });
        //Set refresh token as httpOnly cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: env_config_1.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({
            isSuccess: true,
            message: "Login successful.",
            data: {
                accessToken,
            },
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            isSuccess: false,
            message: "Internal Server Error",
        });
        return;
    }
};
exports.login = login;
const logout = (req, res) => {
    try {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: env_config_1.NODE_ENV === "production",
            sameSite: "strict",
        });
        res.status(200).json({
            isSuccess: true,
            message: "Logout successful.",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            isSuccess: false,
            message: "Internal Server Error",
        });
        return;
    }
};
exports.logout = logout;
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        //Check if user exists
        const user = await db_lib_1.default.user.findFirst({ where: { email } });
        if (!user) {
            res.status(404).json({
                isSuccess: false,
                message: "This email is not registered!",
            });
            return;
        }
        //Generate reset token and Store reset token in database
        const resetToken = (0, generateToken_util_1.generateResetToken)(user.id);
        const hashedResetToken = await bcrypt_1.default.hash(resetToken, 10);
        await db_lib_1.default.resetToken.upsert({
            where: { userId: user.id },
            update: {
                token: hashedResetToken,
                expiredAt: new Date(Date.now() + 10 * 60 * 1000),
            },
            create: {
                userId: user.id,
                token: hashedResetToken,
                expiredAt: new Date(Date.now() + 10 * 60 * 1000),
            },
        });
        //Send reset email
        const emailHtml = await (0, components_1.render)((0, change_password_1.default)({
            username: user.username,
            resetLink: `${env_config_1.FRONTEND_URL}/change-password?token=${resetToken}`,
            expiryTime: "10 minutes",
        }));
        const options = {
            from: env_config_1.MAIL_USER,
            to: email,
            subject: "Reset your LikDai-Pro password",
            html: emailHtml,
        };
        await nodemailer_lib_1.transporter.sendMail(options);
        //Send the response
        res.status(200).json({
            isSuccess: true,
            message: "Password reset email sent successfully. Please check your email!",
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            isSuccess: false,
            message: "Internal Server Error",
        });
        return;
    }
};
exports.forgotPassword = forgotPassword;
const changePassword = async (req, res) => {
    try {
        const { token, password } = req.body;
        //Verify the token
        const payload = jsonwebtoken_1.default.verify(token, env_config_1.JWT_RESET_SECRET);
        const resetToken = await db_lib_1.default.resetToken.findFirst({
            where: {
                userId: payload.userId,
            },
        });
        if (!resetToken) {
            res.status(401).json({
                isSuccess: false,
                message: "Invalid token!",
            });
            return;
        }
        //Check if token is expired
        if (resetToken.expiredAt < new Date()) {
            res.status(401).json({
                isSuccess: false,
                message: "Token expired!",
            });
            return;
        }
        //Hash password
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        //Update user password
        await db_lib_1.default.user.update({
            where: {
                id: resetToken.userId,
            },
            data: {
                password: hashedPassword,
            },
        });
        //Delete reset token
        await db_lib_1.default.resetToken.delete({
            where: {
                id: resetToken.id,
            },
        });
        //Send the response
        res.status(200).json({
            isSuccess: true,
            message: "Password changed successfully.",
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            isSuccess: false,
            message: "Internal Server Error",
        });
        return;
    }
};
exports.changePassword = changePassword;
const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            res.status(401).json({
                isSuccess: false,
                message: "Unauthorized",
            });
            return;
        }
        //Verify the token
        const payload = jsonwebtoken_1.default.verify(refreshToken, env_config_1.JWT_REFRESH_SECRET);
        //Check if the token is in the database
        const storedToken = await db_lib_1.default.refreshToken.findFirst({
            where: {
                userId: payload.userId,
            },
        });
        if (!storedToken) {
            res.status(401).json({
                isSuccess: false,
                message: "Unauthorized",
            });
            return;
        }
        //Compare the token
        const isTokenValid = await bcrypt_1.default.compare(refreshToken, storedToken.token);
        if (!isTokenValid) {
            res.status(401).json({
                isSuccess: false,
                message: "Unauthorized",
            });
            return;
        }
        //Check if the token is expired
        if (storedToken.expiredAt < new Date()) {
            res.status(401).json({
                isSuccess: false,
                message: "Unauthorized",
            });
            return;
        }
        //Generate new access token
        const accessToken = (0, generateToken_util_1.generateAccessToken)(payload.userId);
        res.status(200).json({
            isSuccess: true,
            message: "Token refreshed.",
            accessToken,
        });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            isSuccess: false,
            message: "Internal Server Error",
        });
        return;
    }
};
exports.refreshToken = refreshToken;
