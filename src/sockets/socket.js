const { Server } = require("socket.io");
const Message = require("../models/Message");

// Store io instance for use in controllers
let ioInstance = null;

/**
 * Get Socket.io instance
 * @returns {Server} Socket.io server instance
 */
const getIO = () => {
  return ioInstance;
};

/**
 * Initialize Socket.io server
 * @param {http.Server} server - HTTP server instance
 * @returns {Server} Socket.io server instance
 */
const initSocket = (server) => {
  // Initialize Socket.io with CORS enabled
  const io = new Server(server, {
    cors: {
      origin: "*", // In production, specify allowed origins
      methods: ["GET", "POST"],
    },
  });

  // Handle socket connections
  io.on("connection", (socket) => {
    console.log(`✅ User connected: ${socket.id}`);

    /**
     * Handle join room event
     * Allows users to join a specific room/chat
     */
    socket.on("joinRoom", async (data) => {
      try {
        const { room } = data;

        if (room) {
          socket.join(room);
          console.log(`👤 Socket ${socket.id} joined room: ${room}`);
          socket.emit("joinedRoom", { room, message: `Joined room: ${room}` });
        }
      } catch (error) {
        console.error("Join room error:", error);
        socket.emit("error", { message: "Failed to join room" });
      }
    });

    /**
     * Handle send message event
     * Saves message to database and broadcasts to room
     */
    socket.on("sendMessage", async (data) => {
      try {
        const { sender, receiver, content, room } = data;

        // Validate required fields
        if (!sender || !content) {
          socket.emit("error", {
            message: "Sender and content are required",
          });
          return;
        }

        // Save message to database
        const message = await Message.create({
          sender: sender,
          receiver: receiver || null,
          content: content,
          room: room || null,
        });

        // Populate sender details
        await message.populate("sender", "name email");

        // Prepare message data for broadcast
        const messageData = {
          id: message._id,
          sender: message.sender,
          receiver: message.receiver,
          content: message.content,
          room: message.room,
          createdAt: message.createdAt,
        };

        // Broadcast message to room if room is specified
        if (room) {
          io.to(room).emit("newMessage", messageData);
          console.log(`📨 Message sent to room: ${room}`);
        } else if (receiver) {
          // If no room but has receiver, emit to sender and receiver
          socket.emit("newMessage", messageData);
          io.to(receiver.toString()).emit("newMessage", messageData);
          console.log(`📨 Message sent from ${sender} to ${receiver}`);
        } else {
          // Broadcast to all connected clients if no room or receiver
          io.emit("newMessage", messageData);
          console.log(`📨 Message broadcasted to all`);
        }
      } catch (error) {
        console.error("Send message error:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    /**
     * Handle disconnect event
     */
    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${socket.id}`);
    });
  });

  // Store io instance
  ioInstance = io;

  return io;
};

module.exports = { initSocket, getIO };

