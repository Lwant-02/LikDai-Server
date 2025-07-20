"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveResultRouter = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const result_controller_1 = require("../controller/result.controller");
exports.saveResultRouter = (0, express_1.Router)();
exports.saveResultRouter.post("/save-results", auth_middleware_1.verifyAccessToken, result_controller_1.saveResults);
