const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const Message = require("./models/Message");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Middleware
app.use(cors());
app.use(express.json());

// DB Connection
const connectDB = require("./config/db");
connectDB();

// Routes
app.get("/", (req, res) => res.send("Alumni API running..."));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/alumni", require("./routes/alumni"));
app.use("/api/events", require("./routes/events"));
app.use("/api/chat", require("./routes/chat"));
app.use("/api/notification", require("./routes/notification"));
app.use("/api/guidance", require("./routes/guidance"));
app.use("/api/donation", require("./routes/donation"));
app.use("/api/dashboard", require("./routes/admin"));

// Socket.IO (chat/notifications placeholder)
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

    //For video call
   socket.on("joinVideoRoom", (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit("userJoined", socket.id);
  });

  socket.on("signal", ({ roomId, signalData }) => {
    socket.to(roomId).emit("signal", { socketId: socket.id, signalData });
  });

   // Join room
  socket.on("joinRoom", ({ userId, otherId }) => {
    const roomId = [userId, otherId].sort().join("-");
    socket.join(roomId);
    console.log(`${userId} joined chat with ${otherId}`);
  });

  // Send message
  socket.on("sendMessage", async ({ sender, receiver, text }) => {
    const newMessage = new Message({ sender, receiver, text });
    await newMessage.save();

    const roomId = [sender, receiver].sort().join("-");
    io.to(roomId).emit("receiveMessage", newMessage);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
