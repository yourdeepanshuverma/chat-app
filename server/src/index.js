import dotenv from "dotenv";
import express from "express";
import connectDB from "./db/index.js";
import userRoutes from "./routes/userRoute.js";
import chatRoutes from "./routes/chatRoute.js";
import adminRoutes from "./routes/adminRoute.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import { v4 as uuid } from "uuid";
import { NEW_MESSAGE, NEW_MESSAGE_ALERT } from "./constants/event.js";
import { getUserSocket } from "./lib/helper.js";
import { Message } from "./models/messageModel.js";
import { log } from "console";

dotenv.config({
  path: "./.env",
});

export const adminSecretKey =
  process.env.ADMIN_SECRET_KEY || "ADMIN-SECRET-KEY";
const PORT = process.env.PORT || 3000;

export const userSocketIds = new Map();

// Connecting to database
connectDB();

// Create in an express app
const app = express();
const server = createServer(app);
const io = new Server(server, {});

// Using Middlewares Here
app.use(
  express.json({
    limit: "16kb",
  })
);
app.use(
  cookieParser({
    limit: "16kb",
  })
);

// All Routes Here
app.get("/", (req, res) => {
  res.send("hello world");
});

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/chats", chatRoutes);
app.use("/api/v1/admin", adminRoutes);

// socket
io.on("connection", async (socket) => {
  const user = {
    _id: "hashfjksh",
    name: "khfakhk",
  };
  userSocketIds.set(user._id, socket.id);
  console.log(userSocketIds);

  socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {
    const messageForRealTime = {
      content: message,
      id: uuid(),
      sender: {
        id: user.id,
        name: user.name,
      },
      chat: chatId,
      createdAt: new Date().toISOString(),
    };

    const messageForDB = {
      chatId: chatId,
      content: message,
      sender: user._id,
    };
    const membsersSocket = getUserSocket(members);
    io.to(membsersSocket).emit(NEW_MESSAGE, {
      chatId,
      message: messageForRealTime,
    });
    io.to(membsersSocket).emit(NEW_MESSAGE_ALERT, { chatId });
    try {
      await Message.create(messageForDB);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// Error Middleware
app.use(errorMiddleware);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV}`);
});
