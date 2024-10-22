import asyncHandler from "express-async-handler";
import { Chat } from "../models/chatModel.js";
import { User } from "../models/userModel.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import { emitEvent } from "../utils/socket.js";
import { ALERT, NEW_ATTACHMENT, REFETCH_CHATS } from "../constants/event.js";
import { Message } from "../models/messageModel.js";
import deleteFromCloudinary from "../utils/cloudinary.js";

// Fetch my chats.
const fetchChats = asyncHandler(async (req, res) => {
  const chats = await Chat.find({
    members: { $elemMatch: { $eq: req.user._id } },
  })
    .populate("members")
    .populate("creator")
    .sort({ updatedAt: -1 });

  res.status(200).json({
    status: true,
    chats: chats.map(({ _id, name, groupChat, creator, members }) => {
      return {
        _id: _id,
        name: name,
        avatar: groupChat
          ? members.slice(0, 3).map((member) => member.avatar.url)
          : members.filter(
              (member) => member._id.toString() !== req.user._id.toString()
            ).avatar.url,
        groupChat: groupChat,
        members: members.filter(
          (member) => member._id.toString() !== req.user._id.toString()
        ),
        creator: creator,
      };
    }),
  });
});

// Fetch my groups.
const getMygroups = asyncHandler(async (req, res) => {
  const chats = await Chat.find({
    members: { $elemMatch: { $eq: req.user._id } },
    groupChat: true,
  })
    .populate("members")
    .populate("creator")
    .sort({ updatedAt: -1 });

  res.status(200).json({
    status: true,
    chats: chats.map(({ _id, name, groupChat, creator, members }) => {
      return {
        _id: _id,
        name: name,
        avatar: members.slice(0, 3).map((member) => member.avatar.url),
        groupChat: groupChat,
        members: members.filter(
          (member) => member._id.toString() !== req.user._id.toString()
        ),
        creator: creator,
      };
    }),
  });
});

// Create New Group.
const createGroupChat = asyncHandler(async (req, res, next) => {
  const { name, members } = req.body;

  if (!members || !name) {
    return next(new ErrorHandler("Please Fill all the fields"));
  }

  if (members.length < 2) {
    return next(
      new ErrorHandler(
        400,
        "More than 2 users are required to form a group chat"
      )
    );
  }

  const allMembers = [...members, req.user._id];

  await Chat.create({
    name: name,
    groupChat: true,
    creator: req.user,
    members: allMembers,
  });

  emitEvent(req, ALERT, allMembers, `Welcome to ${name} group.`);
  emitEvent(req, REFETCH_CHATS, members);

  res.status(200).json({ status: true, message: "Group Chat created" });
});

// Rename Group Name.
const renameGroup = asyncHandler(async (req, res, next) => {
  const { id: chatId } = req.params;
  const { name } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      name,
    },
    {
      new: true,
    }
  )
    .populate("members")
    .populate("creator");

  if (!updatedChat) {
    return next(new ErrorHandler(404, "Chat Not Found"));
  } else {
    res.status(200).json(updatedChat);
  }
});

// Delete Group
const deleteChat = asyncHandler(async (req, res, next) => {
  const { id: chatId } = req.params;

  const chat = await Chat.findById(chatId);

  if (!chat) {
    return next(new ErrorHandler(404, "Chat Not Found"));
  }

  if (!chat.members.includes(req.user._id)) {
    return next(new ErrorHandler(404, "You are not in the chat"));
  }

  const messagesWithAtatchments = await Message.find({
    chat: chatId,
    attachments: { $exists: true, $ne: [] },
  });

  const public_ids = [];

  messagesWithAtatchments.forEach(({ attachments }) =>
    attachments.forEach(({ public_id }) => public_ids.push(public_id))
  );

  await Promise.all([
    deleteFromCloudinary(),
    chat.deleteOne(),
    Message.deleteMany({ chat: chatId }),
  ]),
    emitEvent(req, REFETCH_CHATS, chat.members);

  res.status(200).json({ status: true, message: "Group Chat deleted" });
});

// Add new members to the group.
const addToGroup = asyncHandler(async (req, res, next) => {
  const { chatId, members } = req.body;

  const chat = await Chat.findById(chatId).populate("creator");

  // check if the requester is admin
  if (req.user._id.toString() !== chat.creator._id.toString()) {
    return next(new ErrorHandler(403, "You are not admin"));
  }

  if (!members || members.length < 1) {
    return next(new ErrorHandler(400, "Please add members"));
  }

  const uniqueMembers = members.filter(
    (member) => !chat.members.includes(member.toString())
  );

  if (uniqueMembers < 1) {
    return next(new ErrorHandler(400, "Users selected already in the group"));
  }

  chat.members.push(...uniqueMembers);

  if (chat.members.length > 100) {
    return next(new ErrorHandler(400, "Group members limit reached"));
  }

  await chat.save().then((chat) => chat.populate("members"));

  res.status(200).json(chat);
});

// Remove member from the group.
const removeFromGroup = asyncHandler(async (req, res, next) => {
  const { chatId, userId } = req.body;

  const chat = await Chat.findById(chatId);
  const user = await User.findById(userId, "name");

  // check if the requester is admin
  if (req.user._id.toString() !== chat.creator._id.toString()) {
    return next(new ErrorHandler(403, "You are not admin"));
  }

  if (!chat.members.includes(user._id)) {
    return next(new ErrorHandler(400, "User not in the group"));
  }

  chat.members = chat.members.filter(
    (member) => member.toString() !== user._id.toString()
  );

  await chat.save();

  emitEvent(
    req,
    ALERT,
    chat.members,
    `${user.name} has been removed from the group.`
  );
  res.send(`User ${user.name} removed from the group.`);
});

// Leave the group
const leaveGroup = asyncHandler(async (req, res, next) => {
  const chatId = req.params.id;

  const chat = await Chat.findById(chatId);
  const user = await User.findById(req.user._id, "name");

  if (!chat || !chat.members.includes(user._id)) {
    return next(new ErrorHandler(400, "User not in the group"));
  }

  const membersAfterRemoval = chat.members.filter(
    (member) => member.toString() !== user._id.toString()
  );

  // Change the creator if current creator left.
  if (chat.creator.toString() === user._id.toString()) {
    chat.creator =
      membersAfterRemoval[
        Math.floor(Math.random() * membersAfterRemoval.length)
      ];
  }

  chat.members = membersAfterRemoval;

  chat.save();

  emitEvent(req, ALERT, chat.members, `${user.name} has left the group.`);
  res.send(`User ${user.name} left the group.`);
});

// Send Attachments
const sendAtachment = asyncHandler(async (req, res, next) => {
  const { chatId } = req.body;

  const chat = await Chat.findById(chatId);

  if (!chat) {
    return next(new ErrorHandler(404, "Chat not found"));
  }

  const file = req.files;

  if (file.length < 1) {
    return next(new ErrorHandler(400, "Please select a file"));
  }

  const attachments = file.map((file) => {
    return {
      public_id: file.originalname,
      url: file.originalname,
    };
  });

  const messageForDB = {
    sender: req.user._id,
    content: "",
    chatId,
    attachments,
  };

  const messageForRealtime = {
    ...messageForDB,
    sender: {
      _id: req.user._id,
      name: req.user.name,
      avatar: req.user.avatar.url,
    },
  };

  await Message.create(messageForDB);

  emitEvent(req, NEW_ATTACHMENT, chat.members, {
    message: messageForRealtime,
    chatId: chatId,
  });

  res.status(200).json({
    status: true,
    message: "Attachment sent successfully",
  });
});

// Access chat
const accessChat = asyncHandler(async (req, res, next) => {
  const { id: chatId } = req.params;

  const chat = await Chat.findById(chatId)
    .populate("members", "name avatar")
    .lean();

  if (!chat) {
    return next(new ErrorHandler(404, "Chat not found"));
  }

  chat.members = await chat.members.map(({ _id, name, avatar }) => ({
    _id: _id,
    name: name,
    avatar: avatar.url,
  }));

  res.status(200).json({
    status: true,
    chat,
  });
});

// Get messages
const getMessages = asyncHandler(async (req, res, next) => {
  const { id: chatId } = req.params;
  const { page = 1, resultPerPage = 20 } = req.query;
  const skip = (page - 1) * resultPerPage;

  const [messages, totalMessageCount] = await Promise.all([
    Message.find({ chatId })
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(resultPerPage)
      .populate("sender", "name avatar"),
    Message.countDocuments({ chatId }),
  ]);

  const totalPages = Math.ceil(totalMessageCount / resultPerPage);

  res.status(200).json({
    status: true,
    totalPages,
    messages: messages.reverse(),
  });
});

export {
  accessChat,
  fetchChats,
  getMygroups,
  createGroupChat,
  renameGroup,
  deleteChat,
  addToGroup,
  removeFromGroup,
  leaveGroup,
  sendAtachment,
  getMessages,
};
