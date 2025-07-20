"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const env_config_1 = require("./config/env.config");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const account_routes_1 = require("./routes/account.routes");
const report_route_1 = require("./routes/report.route");
const leaderboard_route_1 = require("./routes/leaderboard.route");
const profile_routes_1 = require("./routes/profile.routes");
const result_route_1 = require("./routes/result.route");
const app = (0, express_1.default)();
//Middlewares
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: env_config_1.FRONTEND_URL,
    credentials: true,
}));
app.use((0, morgan_1.default)("dev"));
app.use((0, helmet_1.default)());
app.use((0, cookie_parser_1.default)());
//API Routes
app.use("/api/auth", auth_routes_1.default);
app.use("/api/account", account_routes_1.accountRouter);
app.use("/api/report", report_route_1.reportRouter);
app.use("/api/leaderboard", leaderboard_route_1.leaderboardRouter);
app.use("/api/profile", profile_routes_1.profileRouter);
app.use("/api/test", result_route_1.saveResultRouter);
exports.default = app;
