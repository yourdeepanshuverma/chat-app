import asyncHandler from "express-async-handler";
import { User } from "../models/userModel.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import generateToken from "../utils/generateToken.js";
import { Request } from "../models/request.js";
import { emitEvent } from "../utils/socket.js";
import { Chat } from "../models/chatModel.js";

// Create a new user if not exists.
const registerUser = asyncHandler(async (req, res, next) => {
  const { name, username, password, bio } = req.body;

  if (!name || !username || !password)
    return next(new ErrorHandler(400, "Please Enter all the Feilds"));

  const existingUser = await User.findOne({ username });

  if (existingUser)
    return ErrorHandler(new ErrorHandler(400, "User Already Exist."));

  const avatar = {
    public_id: "sample_id",
    url: "sample_url",
  };

  const user = await User.create({
    name,
    username,
    password,
    bio,
    avatar,
  });

  if (user) {
    res
      .status(201)
      .cookie("Chat", generateToken(user._id), {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true,
      })
      .json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
      });
  } else {
    next(new ErrorHandler(400, "User not created"));
  }
});

// Login User if already exists
const loginUser = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password)
    return next(new ErrorHandler(400, "Please Enter all the Feilds"));

  const user = await User.findOne({ username }).select("+password");

  if (user && (await user.isPasswordCorrect(password))) {
    res
      .status(200)
      .cookie("Chat", generateToken(user._id), {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true,
      })
      .json({
        _id: user._id,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
      });
  } else {
    return next(new ErrorHandler(404, "Invalid Credentials"));
  }
});

// Logout user
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("Chat", "", { maxAge: 0 }).json("Logged out successfully.");
});

// Get user profile
const getProfile = asyncHandler(async (req, res, next) => {
  const user = await User.find({ username: req.query.username });

  if (!user) return next(new ErrorHandler(404, "User not found"));
  return res.status(200).send(user);
});

// Get Searhed users
const allUsers = asyncHandler(async (req, res, next) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { username: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  console.log(req.query.search);

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });

  if (!users) return next(new ErrorHandler(404, "User not found"));

  res.send(users);
});

// Send Friend request.
const sendRequest = asyncHandler(async (req, res, next) => {
  const { userId } = req.body;
  const request = await Request.findOne({
    $or: [
      { sender: req.user._id, receiver: userId },
      { sender: userId, receiver: req.user._id },
    ],
  });

  if (request && request.status === "pending") {
    return next(new ErrorHandler(400, "Request already sent"));
  }

  await Request.create({
    sender: req.user._id,
    receiver: userId,
    status: "pending",
  });

  emitEvent.emit(ALERT, userId, req.user._id, "request");

  res.status(200).json({
    success: true,
    message: "Request sent successfully",
  });
});

// Accept Friend request.
const acceptRequest = asyncHandler(async (req, res, next) => {
  const { requestId, accept } = req.body;
  const request = await Request.findById(requestId);
  if (!request) {
    return next(new ErrorHandler(400, "Request not found"));
  }

  if (request.receiver.toString() !== req.user._id.toString()) {
    return next(
      new ErrorHandler(400, "You are not authorized to accept this request")
    );
  }

  if (accept) {
    request.status = "accepted";
    await request.save();
  }

  if (!accept) {
    request.deleteOne();
    await request.save();
  }

  res.status(200).json({
    success: true,
    message: "Request accepted successfully",
  });
});

const getNotifications = asyncHandler(async (req, res, next) => {
  const requests = await Request.find({
    receiver: req.user._id,
    status: "pending",
  }).populate("sender", "name avatar");

  res.status(200).json({
    success: true,
    requests: requests,
  });
});

const getMyFriends = asyncHandler(async (req, res, next) => {
  const { chatId } = req.query;

  const chats = await Chat.find({
    _id: chatId,
    members: req.user._id,
    groupChat: false,
  }).populate("members", "name avatar");

  if (!chats) return next(new ErrorHandler(404, "Chat not found"));

  const friends = chats.members.map((member) => {
    const otherMember = member.filter(
      (mem) => mem._id.toString() !== req.user._id.toString()
    );
    return {
      _id: otherMember._id,
      name: otherMember.name,
      avatar: otherMember.avatar.url,
    };
  });

  if (chatId) {
    const availableFriends = friends.filter(
      (friend) => !chats.members.includes(friend._id)
    );

    res.status(200).json({
      success: true,
      friends: availableFriends,
    });
  } else {
    res.status(200).json({
      success: true,
      friends,
    });
  }
});

export {
  allUsers,
  loginUser,
  logoutUser,
  getProfile,
  registerUser,
  sendRequest,
  acceptRequest,
  getNotifications,
  getMyFriends,
};
