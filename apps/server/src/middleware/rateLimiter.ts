import { NextFunction, Request, Response } from "express";
import { redisClient } from "../redis";

const LIMIT = 10;
const WINDOW = 60;

export const rateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ip = req.ip || "unknown";

  try {
    const resp = await redisClient.multi().incr(ip).expire(ip, WINDOW).exec();

    if (!resp) {
      console.error("Redis transaction aborted or returned null.");
      return res.status(500).json({ message: "Internal server error." });
    }

    const requestCount = resp[0][1] as number;

    if (requestCount > LIMIT) {
      return res
        .status(429)
        .json({ message: "Too many requests. Please try again later." });
    }

    next();
  } catch (error) {
    console.error("Error with rate limiting:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
