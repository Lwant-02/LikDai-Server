import { z } from "zod";

export const typingTestSchema = z
  .object({
    wpm: z.number().min(0).max(250),
    accuracy: z.number().min(0).max(100),
    raw: z.number().min(0).max(300),
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
  })
  .refine(
    (data) => {
      // Formula: WPM = (characters / 5) / (timeTaken / 60)
      // If timeTaken is 0, we can't calculate WPM (usually 0 is only possible if characters is 0)
      if (data.timeTaken === 0) return data.wpm === 0;

      const calculatedWpm = data.characters / 5 / (data.timeTaken / 60);
      const diff = Math.abs(data.wpm - calculatedWpm);

      // Allow 20% margin + 5 WPM buffer for different calculation methods/rounding
      return diff <= calculatedWpm * 0.2 + 5;
    },
    {
      message: "WPM and time data are inconsistent",
      path: ["wpm"],
    }
  );

