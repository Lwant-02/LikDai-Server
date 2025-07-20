"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WelcomeEmail = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
// @ts-nocheck
const components_1 = require("@react-email/components");
const WelcomeEmail = ({ username = "Typing Enthusiast", }) => {
    return ((0, jsx_runtime_1.jsxs)(components_1.Html, { children: [(0, jsx_runtime_1.jsx)(components_1.Head, {}), (0, jsx_runtime_1.jsx)(components_1.Tailwind, { config: {
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
                }, children: (0, jsx_runtime_1.jsxs)(components_1.Body, { className: "bg-background text-white mx-auto my-auto", children: [(0, jsx_runtime_1.jsx)(components_1.Preview, { children: "Welcome to LikDai-Pro - Master Shan Typing with Precision and Speed" }), (0, jsx_runtime_1.jsxs)(components_1.Container, { className: "max-w-xl p-8 mx-auto  bg-foreground/5 rounded-lg border border-foreground/10", children: [(0, jsx_runtime_1.jsxs)(components_1.Section, { children: [(0, jsx_runtime_1.jsxs)(components_1.Text, { className: "text-base mb-3", children: ["Hello", " ", (0, jsx_runtime_1.jsx)("span", { className: "text-yellow font-semibold", children: username }), ","] }), (0, jsx_runtime_1.jsxs)(components_1.Text, { className: "text-base mb-3", children: ["Thank you for joining", " ", (0, jsx_runtime_1.jsx)("span", { className: "text-yellow", children: "LikDai-Pro!" }), " We're excited to have you on board. Our platform is designed to help you master Shan language typing with a clean, distraction-free environment inspired by", " ", (0, jsx_runtime_1.jsx)("span", { className: "text-yellow", children: "monkeytype." })] }), (0, jsx_runtime_1.jsx)(components_1.Text, { className: "text-base mb-4", children: "With LikDai-Pro, you can:" }), (0, jsx_runtime_1.jsx)(components_1.Text, { className: "text-base pl-4 mb-2", children: "\u2022 Practice in both English and Shan languages" }), (0, jsx_runtime_1.jsx)(components_1.Text, { className: "text-base pl-4 mb-2", children: "\u2022 Track your WPM, accuracy, and consistency" }), (0, jsx_runtime_1.jsx)(components_1.Text, { className: "text-base pl-4 mb-2", children: "\u2022 Choose from different test types (timed, word count, quotes)" }), (0, jsx_runtime_1.jsx)(components_1.Text, { className: "text-base pl-4 mb-4", children: "\u2022 Compete with others on the leaderboard" })] }), (0, jsx_runtime_1.jsx)(components_1.Section, { className: "text-center mb-8 w-full mt-2", children: (0, jsx_runtime_1.jsx)(components_1.Link, { href: `http://localhost:3001`, className: "bg-yellow text-black px-6 py-3 rounded-lg  no-underline", children: "Start Typing Now" }) }), (0, jsx_runtime_1.jsxs)(components_1.Section, { className: "text-center text-xs text-primary/50 ", children: [(0, jsx_runtime_1.jsxs)(components_1.Text, { children: ["\u00A9 ", new Date().getFullYear(), " LikDai-Pro | All rights reserved."] }), (0, jsx_runtime_1.jsxs)(components_1.Text, { children: ["Inspired by", " ", (0, jsx_runtime_1.jsx)(components_1.Link, { href: "https://monkeytype.com/", className: "text-yellow no-underline", children: "monkeytype" })] }), (0, jsx_runtime_1.jsx)(components_1.Text, { children: "This is an automated email, please do not reply." })] })] })] }) })] }));
};
exports.WelcomeEmail = WelcomeEmail;
exports.default = exports.WelcomeEmail;
