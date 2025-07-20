"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateResetToken = exports.generateAccessToken = exports.generateRefreshToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_config_1 = require("../config/env.config");
const generateRefreshToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, env_config_1.JWT_REFRESH_SECRET, {
        expiresIn: "7d",
    });
};
exports.generateRefreshToken = generateRefreshToken;
const generateAccessToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, env_config_1.JWT_ACCESS_SECRET, {
        expiresIn: "15m",
    });
};
exports.generateAccessToken = generateAccessToken;
const generateResetToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, env_config_1.JWT_RESET_SECRET, {
        expiresIn: "10m",
    });
};
exports.generateResetToken = generateResetToken;
