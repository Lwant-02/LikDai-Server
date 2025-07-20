"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typingTestSchema = void 0;
const zod_1 = require("zod");
exports.typingTestSchema = zod_1.z.object({
    wpm: zod_1.z.number().min(0),
    accuracy: zod_1.z.number().min(0).max(100),
    raw: zod_1.z.number().min(0),
    consistency: zod_1.z.number().min(0).max(100),
    timeTaken: zod_1.z.number().min(0),
    mode: zod_1.z.enum(["eng", "shan"]),
    test_type: zod_1.z.enum(["time", "words", "quote", "custom"]),
    characters: zod_1.z.number().min(0),
    correct_chars: zod_1.z.number().min(0),
});
