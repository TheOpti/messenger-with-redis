import express from "express";
import helmet from "helmet";
import http from "http";
import { Server } from "socket.io";

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
app.use(express.json());

io.on("connect", (socket) => {});

app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
