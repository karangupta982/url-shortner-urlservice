import rateLimit from "express-rate-limit";

export const createUrlLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,             // Max 20 requests per minute per IP
  message: "Too many URL shortening requests. Please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});
