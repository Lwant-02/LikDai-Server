"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEVELOPER_EMAIL = exports.MAIL_PASS = exports.MAIL_USER = exports.NODE_ENV = exports.JWT_RESET_SECRET = exports.JWT_ACCESS_SECRET = exports.JWT_REFRESH_SECRET = exports.PORT = exports.FRONTEND_URL = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
_a = process.env, exports.FRONTEND_URL = _a.FRONTEND_URL, exports.PORT = _a.PORT, exports.JWT_REFRESH_SECRET = _a.JWT_REFRESH_SECRET, exports.JWT_ACCESS_SECRET = _a.JWT_ACCESS_SECRET, exports.JWT_RESET_SECRET = _a.JWT_RESET_SECRET, exports.NODE_ENV = _a.NODE_ENV, exports.MAIL_USER = _a.MAIL_USER, exports.MAIL_PASS = _a.MAIL_PASS, exports.DEVELOPER_EMAIL = _a.DEVELOPER_EMAIL;
