import { RedisStore } from "connect-redis";
import cors from "cors";
import express from "express";
import session from "express-session";
import helmet from "helmet";
import http from "http";
import { Redis } from "ioredis";
import { Server } from "socket.io";

import { prisma } from "./prisma";
import router from "./routers/authRouter";

const redisClient = new Redis({
  host: "127.0.0.1",
  port: 6379,
  reconnectOnError: (err) => {
    console.error("Reconnect on error:", err.message);
    return false;
  },
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => {
    console.error(`[ioredis] Retry attempt #${times}`);
    return null;
  },
  lazyConnect: true,
});

const redisStore = new RedisStore({
  client: redisClient,
  prefix: "myapp:",
});

const app = express();
const port = process.env.PORT || 3000;
const sessionSecret = process.env.COOKIE_SECRET || "TopSecret";

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(
  session({
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
  })
);
app.use("/auth", router);

io.on("connect", (socket) => {});

app.listen(port, async () => {
  console.log(`Server is running on http://localhost:${port}`);

  try {
    await prisma.$connect();
    console.log("Database connection successful");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1);
  }

  try {
    await redisClient.connect();
    console.log("Redis connection established.");
  } catch (error) {
    console.error("Error connecting to Redis");
  }
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("Database connection closed");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  console.log("Database connection closed");
  process.exit(0);
});
