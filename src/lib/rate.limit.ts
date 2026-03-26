import rateLimit, { ipKeyGenerator } from "express-rate-limit";

export const createRateLimiter = ({
  windowMs = 60 * 1000,
  max = 5,
  message = "Too many requests, please try again later",
}: {
  windowMs?: number;
  max?: number;
  message?: string;
}) => {
  return rateLimit({
    windowMs,
    max,
    message,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
      if (req.userId) return req.userId;
      if (req.ip) return ipKeyGenerator(req.ip);
      return "anonymous";
    },
  });
};
