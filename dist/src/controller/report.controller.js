"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitReport = void 0;
const components_1 = require("@react-email/components");
const report_bug_1 = __importDefault(require("../../react-email-starter/emails/report-bug"));
const env_config_1 = require("../config/env.config");
const nodemailer_lib_1 = require("../lib/nodemailer.lib");
const submitReport = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            res.status(400).json({
                isSuccess: false,
                message: "Please provide a report.",
            });
            return;
        }
        //Send email to developer
        const emailHtml = await (0, components_1.render)((0, report_bug_1.default)({ text }));
        const options = {
            from: env_config_1.MAIL_USER,
            to: env_config_1.DEVELOPER_EMAIL,
            subject: "Report a Bug 🐞",
            html: emailHtml,
        };
        await nodemailer_lib_1.transporter.sendMail(options);
        res.status(200).json({
            isSuccess: true,
            message: "Report submitted successfully.",
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
exports.submitReport = submitReport;
