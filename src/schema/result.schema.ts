import { z } from "zod";

export const typingTestSchema = z.object({
  wpm: z.number().min(0),
  accuracy: z.number().min(0).max(100),
  raw: z.number().min(0),
  consistency: z.number().min(0).max(100),
  timeTaken: z.number().min(0),
  mode: z.enum(["eng", "shan"]),
  lessonLevel: z.enum([
    "beginner",
    "intermediate",
    "advanced",
    "quotes",
    "music",
  ]),
  characters: z.number().min(0),
  correct_chars: z.number().min(0),
});
