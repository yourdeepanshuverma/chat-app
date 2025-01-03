import { v2 as cloudinary } from "cloudinary";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { v4 as uuid } from "uuid";
import { corsOptions } from "./constants/config.js";
import {
  NEW_MESSAGE,
  NEW_MESSAGE_ALERT,
  START_TYPING,
  STOP_TYPING,
} from "./constants/event.js";
import connectDB from "./db/index.js";
import { getUserSocket } from "./lib/helper.js";
import { socketAuthenticator } from "./middlewares/authMiddleware.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import { Message } from "./models/messageModel.js";

import adminRoutes from "./routes/adminRoute.js";
import chatRoutes from "./routes/chatRoute.js";
import userRoutes from "./routes/userRoute.js";

dotenv.config({
  path: "./.env",
});

export const adminSecretKey =
  process.env.ADMIN_SECRET_KEY || "ADMIN-SECRET-KEY";
const PORT = process.env.PORT || 3000;

export const userSocketIds = new Map();

// Connecting to database
connectDB();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create in an express app
const app = express();
const server = createServer(app);
const io = new Server(server, { cors: corsOptions });

app.set("io", io);

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
app.use(cors(corsOptions));

// All Routes Here
app.get("/", (req, res) => {
  res.send("hello world");
});

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/chats", chatRoutes);
app.use("/api/v1/admin", adminRoutes);

// socket

io.use((socket, next) => {
  cookieParser()(
    socket.request,
    socket.request.res,
    async (err) => await socketAuthenticator(err, socket, next)
  );
});

io.on("connection", async (socket) => {
  const user = socket.user;

  userSocketIds.set(user._id.toString(), socket.id);
  console.log(userSocketIds);

  socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {
    const messageForRealTime = {
      content: message,
      _id: uuid(),
      sender: {
        _id: user.id,
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

  socket.on(START_TYPING, ({ members, chatId }) => {
    const membersSocket = getUserSocket(members);
    socket.to(membersSocket).emit(START_TYPING, { chatId });
  });

  socket.on(STOP_TYPING, ({ members, chatId }) => {
    const membersSocket = getUserSocket(members);
    socket.to(membersSocket).emit(STOP_TYPING, { chatId });
  });

  socket.on("disconnect", () => {
    userSocketIds.delete(user._id.toString());
    console.log("user disconnected");
  });
});

// Error Middleware
app.use(errorMiddleware);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV}`);
});
