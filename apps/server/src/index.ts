import cors from "cors";
import express from "express";
import helmet from "helmet";
import http from "http";
import { Server } from "socket.io";

import { sessionMiddleware } from "./controllers/serverController";
import { addFriend, authorizeUser } from "./controllers/socketController";
import { prisma } from "./prisma";
import { redisClient } from "./redis";
import router from "./routers/authRouter";

const app = express();
const port = process.env.PORT || 3000;

const corsConfig = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(helmet());
app.use(cors(corsConfig));
app.use(express.json());
app.use(sessionMiddleware);

app.use("/auth", router);

const server = http.createServer(app);
const io = new Server(server, {
  cors: corsConfig,
});

io.engine.use(sessionMiddleware);
io.on("connect", (socket) => {
  socket.on("add_friend", addFriend);
});

io.use(authorizeUser);

server.listen(port, async () => {
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
