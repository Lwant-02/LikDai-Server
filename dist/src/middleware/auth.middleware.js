"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAccessToken = void 0;
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const env_config_1 = require("../config/env.config");
const db_lib_1 = __importDefault(require("../lib/db.lib"));
const verifyAccessToken = async (req, res, next) => {
    try {
        const authHeader = typeof req.headers.authorization === "string"
            ? req.headers.authorization
            : undefined;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({
                isSuccess: false,
                message: "Unauthorized – missing or malformed Authorization header",
            });
            return;
        }
        const token = authHeader.split(" ")[1];
        const payload = jsonwebtoken_1.default.verify(token, env_config_1.JWT_ACCESS_SECRET);
        const user = await db_lib_1.default.user.findUnique({
            where: { id: payload.userId },
        });
        if (!user) {
            res.status(401).json({
                isSuccess: false,
                message: "Unauthorized – user no longer exists",
            });
            return;
        }
        req.userId = payload.userId;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.TokenExpiredError) {
            res.status(401).json({
                isSuccess: false,
                message: "Unauthorized – token expired",
            });
            return;
        }
        if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
            res.status(401).json({
                isSuccess: false,
                message: `Unauthorized – ${error.message}`,
            });
            return;
        }
        console.error("verifyAccessToken:", error);
        res.status(500).json({
            isSuccess: false,
            message: "Internal Server Error",
        });
    }
};
exports.verifyAccessToken = verifyAccessToken;
