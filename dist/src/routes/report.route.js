"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportRouter = void 0;
const express_1 = require("express");
const report_controller_1 = require("../controller/report.controller");
exports.reportRouter = (0, express_1.Router)();
exports.reportRouter.post("/submit", report_controller_1.submitReport);
