"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ReportBugEmail;
const jsx_runtime_1 = require("react/jsx-runtime");
// @ts-nocheck
const components_1 = require("@react-email/components");
function ReportBugEmail({ text }) {
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
                }, children: [(0, jsx_runtime_1.jsx)(components_1.Preview, { children: "Reset your LikDai-Pro password" }), (0, jsx_runtime_1.jsx)(components_1.Body, { className: "bg-background text-white mx-auto my-auto", children: (0, jsx_runtime_1.jsxs)(components_1.Container, { className: "max-w-xl p-8 mx-auto  bg-foreground/5 rounded-lg border border-foreground/10", children: [(0, jsx_runtime_1.jsxs)(components_1.Section, { children: [(0, jsx_runtime_1.jsxs)(components_1.Text, { className: "text-base mb-4 text-white", children: ["Hello", " ", (0, jsx_runtime_1.jsx)("span", { className: "text-yellow font-semibold", children: "Developer Team," })] }), (0, jsx_runtime_1.jsx)(components_1.Text, { className: "text-base mb-4 text-white", children: "A user has reported an issue with the app. The report is as follows:" })] }), (0, jsx_runtime_1.jsx)(components_1.Section, { className: "bg-foreground px-4 rounded-lg ", children: (0, jsx_runtime_1.jsx)(components_1.Text, { className: "text-base mb-4 text-white", children: text }) }), (0, jsx_runtime_1.jsxs)(components_1.Section, { className: "text-center text-xs text-primary/50 ", children: [(0, jsx_runtime_1.jsxs)(components_1.Text, { children: ["\u00A9 ", new Date().getFullYear(), " LikDai-Pro | All rights reserved."] }), (0, jsx_runtime_1.jsxs)(components_1.Text, { children: ["Inspired by", " ", (0, jsx_runtime_1.jsx)(components_1.Link, { href: "https://monkeytype.com/", className: "text-yellow no-underline", children: "monkeytype" })] }), (0, jsx_runtime_1.jsx)(components_1.Text, { children: "This is an automated email, please do not reply." })] })] }) })] })] }));
}
