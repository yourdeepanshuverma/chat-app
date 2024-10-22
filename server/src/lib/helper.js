import { userSocketIds } from "../index.js";

export const getUserSocket = (users = []) =>
  users.map((user) => userSocketIds.get(user._id));
