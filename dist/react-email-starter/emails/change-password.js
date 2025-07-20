"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangePasswordEmail = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
// @ts-nocheck
const components_1 = require("@react-email/components");
const ChangePasswordEmail = ({ username, resetLink, expiryTime, }) => {
    return ((0, jsx_runtime_1.jsxs)(components_1.Html, { children: [(0, jsx_runtime_1.jsx)(components_1.Head, {}), (0, jsx_runtime_1.jsxs)(components_1.Tailwind, { config: {
                    theme: {
                        extend: {
                            colors: {
                                background: "#040303",
                                foreground: "#2b2e31",
                                primary: "#ffffff",
                                yellow: "#dcb743",
                                blue: "#3674b5",
                                red: "#ea2f14",
                                green: "#1f7d53",
                                orange: "#ff7601",
                                purple: "#7965c1",
                            },
                        },
                    },
                }, children: [(0, jsx_runtime_1.jsx)(components_1.Preview, { children: "Reset your LikDai-Pro password" }), (0, jsx_runtime_1.jsx)(components_1.Body, { className: "bg-background text-white mx-auto my-auto", children: (0, jsx_runtime_1.jsxs)(components_1.Container, { className: "max-w-xl p-8 mx-auto  bg-foreground/5 rounded-lg border border-foreground/10", children: [(0, jsx_runtime_1.jsxs)(components_1.Section, { children: [(0, jsx_runtime_1.jsxs)(components_1.Text, { className: "text-base mb-4", children: ["Hello", " ", (0, jsx_runtime_1.jsx)("span", { className: "text-yellow font-semibold", children: username }), ","] }), (0, jsx_runtime_1.jsx)(components_1.Text, { className: "text-base mb-4", children: "Nobody likes being locked out of their account. We're coming to your rescue - just click the button below to get started. If you didn't request a password reset, you can safely ignore this email." })] }), (0, jsx_runtime_1.jsx)(components_1.Section, { className: "my-4 py-3 w-full", children: (0, jsx_runtime_1.jsx)(components_1.Link, { href: resetLink, className: "bg-yellow text-black px-6 w-full py-3 rounded-lg  no-underline ", children: "Reset Your Password" }) }), (0, jsx_runtime_1.jsxs)(components_1.Section, { children: [(0, jsx_runtime_1.jsx)(components_1.Text, { className: " mb-2 opacity-50 text-sm", children: "Alternatively, you can copy and paste the link below into your browser:" }), (0, jsx_runtime_1.jsx)(components_1.Text, { className: "text-sm text-yellow bg-foreground/30 p-3 rounded-md break-all", children: resetLink }), (0, jsx_runtime_1.jsxs)(components_1.Text, { className: " mb-2 opacity-80 text-sm", children: ["Noted that the reset link is valid for ", expiryTime, " and you will need to request a new one if it expires."] })] }), (0, jsx_runtime_1.jsxs)(components_1.Section, { className: "border-t border-foreground/10 pt-3 text-sm text-primary/70", children: [(0, jsx_runtime_1.jsx)(components_1.Text, { className: "mb-4 font-bold", children: "Secure typing!" }), (0, jsx_runtime_1.jsx)(components_1.Text, { className: "font-bold", children: "The LikDai-Pro Team" })] }), (0, jsx_runtime_1.jsxs)(components_1.Section, { className: "text-center text-xs text-primary/50 ", children: [(0, jsx_runtime_1.jsxs)(components_1.Text, { children: ["\u00A9 ", new Date().getFullYear(), " LikDai-Pro | All rights reserved."] }), (0, jsx_runtime_1.jsxs)(components_1.Text, { children: ["Inspired by", " ", (0, jsx_runtime_1.jsx)(components_1.Link, { href: "https://monkeytype.com/", className: "text-yellow no-underline", children: "monkeytype" })] }), (0, jsx_runtime_1.jsx)(components_1.Text, { children: "This is an automated email, please do not reply." })] })] }) })] })] }));
};
exports.ChangePasswordEmail = ChangePasswordEmail;
exports.default = exports.ChangePasswordEmail;
