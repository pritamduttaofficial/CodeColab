import express from "express";
import { Server } from "socket.io";
import http from "http";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();

const app = express();

const server = http.createServer(app);

const io = new Server(server);

// Define __dirname in ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static("dist"));

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// mapping username with socketId
let socketUserInfo = {};

// To store the host of each room
let roomHost = {};

// get list of connected clients
function getAllConnectedClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: socketUserInfo[socketId],
      };
    }
  );
}

io.on("connection", (socket) => {
  socket.on("join", ({ roomId, username }) => {
    socketUserInfo[socket.id] = username;

    // If first user to join the room, set as host
    if (!roomHost[roomId]) {
      roomHost[roomId] = username;
    }

    // new room or existing room
    socket.join(roomId);

    // details of connected clients
    const clients = getAllConnectedClients(roomId);

    // send the newly joined client to the rest of the clients
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit("joined", {
        clients,
        host: roomHost[roomId],
        username,
        socketId: socket.id,
      });
    });
  });

  // Handle code changes
  socket.on("code_change", ({ roomId, code }) => {
    socket.in(roomId).emit("code_change", { code });
  });

  socket.on("chat_message", ({ roomId, username, message }) => {
    // Broadcast the message to everyone in the room
    io.to(roomId).emit("chat_message", {
      username,
      message,
    });
  });

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit("disconnected", {
        socketId: socket.id,
        username: socketUserInfo[socket.id],
      });
    });
    delete socketUserInfo[socket.id];
    socket.leave();
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening at PORT: ${PORT}`);
});
