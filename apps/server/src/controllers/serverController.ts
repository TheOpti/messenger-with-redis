import { RedisStore } from "connect-redis";
import session from "express-session";
import { redisClient } from "../redis";

const sessionSecret = process.env.COOKIE_SECRET || "TopSecret";

const redisStore = new RedisStore({
  client: redisClient,
  prefix: "myapp:",
});

export const sessionMiddleware = session({
  secret: sessionSecret,
  name: "sid",
  store: redisStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.ENVIRONMENT === "prod",
    httpOnly: true,
    sameSite: process.env.ENVIRONMENT === "prod" ? "none" : "lax",
  },
});
