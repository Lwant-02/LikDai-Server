import { Request, Response } from "express";

import { DEVELOPER_EMAIL, MAIL_USER } from "../config/env.config";
import { transporter } from "../lib/nodemailer.lib";
import { generateBugReportEmail } from "../templates/emailTemplates";

export const submitReport = async (req: Request, res: Response) => {
  try {
    const { text, email } = req.body;
    if (!text || !email) {
      res.status(400).json({
        isSuccess: false,
        message: "Please provide a report and email.",
      });
      return;
    }

    //Send email to developer
    const emailHtml = generateBugReportEmail({ text, email });

    const options = {
      from: MAIL_USER,
      to: DEVELOPER_EMAIL,
      subject: "Report a Bug 🐞",
      html: emailHtml,
    };

    await transporter.sendMail(options);

    res.status(200).json({
      isSuccess: true,
      message: "Report submitted successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      isSuccess: false,
      message: "Internal Server Error",
    });
    return;
  }
};
