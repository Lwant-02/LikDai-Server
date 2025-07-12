declare namespace Express {
  export interface Request {
    userId: string;
  }
}

type TypingTest = z.infer<typeof typingTestSchema>;
