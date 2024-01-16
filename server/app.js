import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";

const port = 3000;

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.get("/", (req, res) => {
  res.status(200).send("Hello world");
});

io.on("connection", (socket) => {
  console.log("User connected");
  console.log("Id", socket.id);
  //   socket.emit("welcome", `Welcome to the server with.`);
  //   socket.broadcast.emit("welcome", `${socket.id} joined the server.`);

  // socket.on("message", (data) => {
  socket.on("message", ({ message, Room }) => {
    console.log({ message, Room });
    // io.emit("receive-msg", data);
    // socket.broadcast.emit("receive-msg", data);
    // socket.broadcast.emit("receive-msg", { message, Room });
    socket.to(Room).emit("receive-msg", { message, Room });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });

  socket.on("join-room", (room) => {
    socket.join(room);
  });
});

server.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
