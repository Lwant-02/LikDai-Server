"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitReport = void 0;
const env_config_1 = require("../config/env.config");
const nodemailer_lib_1 = require("../lib/nodemailer.lib");
const emailTemplates_1 = require("../templates/emailTemplates");
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
        const emailHtml = (0, emailTemplates_1.generateBugReportEmail)({ text });
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
