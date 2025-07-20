// Email template types
interface WelcomeEmailProps {
  name: string;
  email: string;
}

interface ResetPasswordProps {
  name: string;
  email: string;
  otp: string;
}

interface ReportBugProps {
  text: string;
}

// Welcome Email Template
export const generateWelcomeEmail = ({ name, email }: WelcomeEmailProps) => `
<div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 0;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08); border: 1px solid #eaeaea;">
        <tr>
            <td style="padding: 40px 32px; text-align: center; background: linear-gradient(135deg, #1e40af 0%, #dcb743 100%);">
                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    Welcome to LikDai-Pro! 🎉
                </h1>
                <p style="margin: 8px 0 0 0; color: #f1f5f9; font-size: 16px; opacity: 0.9;">
                    Master Shan Language Typing
                </p>
            </td>
        </tr>
        <tr>
            <td style="padding: 32px;">
                <p style="margin: 0 0 16px 0; font-size: 16px; color: #374151;">
                    Hello <strong style="color: #1e40af;">${name}</strong>,
                </p>
                <p style="margin: 0 0 24px 0; font-size: 16px; color: #374151;">
                    Thank you for joining LikDai-Pro! We're excited to help you master Shan language typing skills.
                </p>
                <p style="margin: 0 0 16px 0; font-size: 16px; color: #374151; font-weight: 600;">
                    With LikDai-Pro, you can:
                </p>
                <ul style="margin: 0 0 24px 0; padding-left: 20px; color: #374151;">
                    <li style="margin-bottom: 8px;">🎯 Practice typing in both English and Shan languages</li>
                    <li style="margin-bottom: 8px;">📊 Track your progress with detailed statistics</li>
                    <li style="margin-bottom: 8px;">🏆 Unlock achievements as you improve</li>
                    <li style="margin-bottom: 8px;">🎨 Customize your typing experience</li>
                </ul>
                <div style="text-align: center; margin: 32px 0;">
                    <a href="https://likdai-pro.com/typing-test" style="display: inline-block; background: linear-gradient(135deg, #dcb743 0%, #f59e0b 100%); color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(220, 183, 67, 0.3); transition: all 0.3s ease;">
                        Start Typing Now →
                    </a>
                </div>
            </td>
        </tr>
        <tr>
            <td style="padding: 24px 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0;">
                <p style="margin: 0 0 8px 0; font-size: 12px; color: #64748b; text-align: center;">
                    This email was sent to ${email}
                </p>
                <p style="margin: 0 0 8px 0; font-size: 12px; color: #64748b; text-align: center;">
                    Visit us at <a href="https://likdai-pro.com" style="color: #1e40af; text-decoration: none;">likdai-pro.com</a>
                </p>
                <p style="margin: 0; font-size: 12px; color: #64748b; text-align: center;">
                    This is an automated email, please do not reply.
                </p>
            </td>
        </tr>
    </table>
</div>
`;

// Reset Password Email Template
export const generateResetPasswordEmail = ({
  name,
  email,
  otp,
}: ResetPasswordProps) => `
<div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 0;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08); border: 1px solid #eaeaea;">
        <tr>
            <td style="padding: 40px 32px; text-align: center; background: linear-gradient(135deg, #dc2626 0%, #f59e0b 100%);">
                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    🔐 Password Reset
                </h1>
                <p style="margin: 8px 0 0 0; color: #f1f5f9; font-size: 16px; opacity: 0.9;">
                    LikDai-Pro Security
                </p>
            </td>
        </tr>
        <tr>
            <td style="padding: 32px;">
                <p style="margin: 0 0 16px 0; font-size: 16px; color: #374151;">
                    Hello <strong style="color: #1e40af;">${name}</strong>,
                </p>
                <p style="margin: 0 0 24px 0; font-size: 16px; color: #374151;">
                    We received a request to reset your password for your LikDai-Pro account.
                </p>
                <div style="text-align: center; margin: 32px 0;">
                    <a href="https://likdai-pro.com/reset-password?token=${otp}" style="display: inline-block; background: linear-gradient(135deg, #dcb743 0%, #f59e0b 100%); color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(220, 183, 67, 0.3);">
                        Reset Password
                    </a>
                </div>
                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 24px 0;">
                    <p style="margin: 0 0 8px 0; font-size: 14px; color: #64748b; text-align: center;">
                        Or use this verification code:
                    </p>
                    <p style="margin: 0; font-size: 24px; font-weight: 700; color: #dcb743; text-align: center; font-family: 'Courier New', monospace; letter-spacing: 2px;">
                        ${otp}
                    </p>
                </div>
                <p style="margin: 24px 0 0 0; font-size: 14px; color: #64748b;">
                    If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
                </p>
            </td>
        </tr>
        <tr>
            <td style="padding: 24px 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0;">
                <p style="margin: 0 0 8px 0; font-size: 12px; color: #64748b; text-align: center;">
                    Secure typing!
                </p>
                <p style="margin: 0 0 8px 0; font-size: 12px; color: #64748b; text-align: center; font-weight: 600;">
                    The LikDai-Pro Team
                </p>
                <p style="margin: 0 0 8px 0; font-size: 12px; color: #64748b; text-align: center;">
                    This email was sent to ${email}
                </p>
                <p style="margin: 0 0 8px 0; font-size: 12px; color: #64748b; text-align: center;">
                    Visit us at <a href="https://likdai-pro.com" style="color: #1e40af; text-decoration: none;">likdai-pro.com</a>
                </p>
                <p style="margin: 0; font-size: 12px; color: #64748b; text-align: center;">
                    This is an automated email, please do not reply.
                </p>
            </td>
        </tr>
    </table>
</div>
`;

// Bug Report Email Template
export const generateBugReportEmail = ({ text }: ReportBugProps) => `
<div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 0;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08); border: 1px solid #eaeaea;">
        <tr>
            <td style="padding: 40px 32px; text-align: center; background: linear-gradient(135deg, #7c3aed 0%, #dc2626 100%);">
                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    🐛 Bug Report
                </h1>
                <p style="margin: 8px 0 0 0; color: #f1f5f9; font-size: 16px; opacity: 0.9;">
                    LikDai-Pro Support
                </p>
            </td>
        </tr>
        <tr>
            <td style="padding: 32px;">
                <p style="margin: 0 0 16px 0; font-size: 16px; color: #374151;">
                    Hello there,
                </p>
                <p style="margin: 0 0 24px 0; font-size: 16px; color: #374151;">
                    Thank you for reporting a bug! Your feedback helps us improve LikDai-Pro for everyone.
                </p>
                <div style="background-color: #1f2937; border-radius: 8px; padding: 20px; margin: 24px 0;">
                    <p style="margin: 0; font-size: 16px; color: #ffffff; white-space: pre-wrap;">${text}</p>
                </div>
            </td>
        </tr>
        <tr>
            <td style="padding: 24px 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0;">
                <p style="margin: 0 0 8px 0; font-size: 12px; color: #64748b; text-align: center;">
                    Bug report submitted via LikDai-Pro
                </p>
                <p style="margin: 0 0 8px 0; font-size: 12px; color: #64748b; text-align: center;">
                    Visit us at <a href="https://likdai-pro.com" style="color: #1e40af; text-decoration: none;">likdai-pro.com</a>
                </p>
                <p style="margin: 0; font-size: 12px; color: #64748b; text-align: center;">
                    This is an automated email, please do not reply.
                </p>
            </td>
        </tr>
    </table>
</div>
`;
