import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import http from "http";
import pg from "pg";
import { Server } from "socket.io";

import router from "./routers/authRouter";

const connectionString = `${process.env.DATABASE_URL}`;

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const app = express();
const port = process.env.PORT || 3000;

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
app.use("/auth", router);

io.on("connect", (socket) => {});

app.listen(port, async () => {
  console.log(`Server is running on http://localhost:${port}`);
  const result = await prisma.$connect();
  console.log("Result: ", result);
});
