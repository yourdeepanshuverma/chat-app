import { createSlice } from "@reduxjs/toolkit";
import { saveOrGetLocalStorage } from "../../components/lib/features";
import { NEW_MESSAGE_ALERT } from "../../components/constants/event";

const initialState = {
  notificationCount: 0,
  newMessageAlert: saveOrGetLocalStorage({
    key: NEW_MESSAGE_ALERT,
    get: true,
  }) || [
    {
      chatId: "",
      count: 0,
    },
  ],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    increaseNotificationCount: (state) => {
      state.notificationCount += 1;
    },
    resetNotificationCount: (state) => {
      state.notificationCount = 0;
    },
    setNewNotificationAlert: (state, action) => {
      const chatId = action.payload.chatId;
      const index = state.newMessageAlert.findIndex(
        (item) => item.chatId === chatId
      );
      if (index !== -1) {
        state.newMessageAlert[index].count += 1;
      } else {
        state.newMessageAlert.push({ chatId, count: 1 });
      }
    },
    removeNewNotificationAlert: (state, action) => {
      const chatId = action.payload;
      state.newMessageAlert = state.newMessageAlert.filter(
        (item) => item.chatId !== chatId
      );
    },
  },
});

export const {
  increaseNotificationCount,
  resetNotificationCount,
  setNewNotificationAlert,
  removeNewNotificationAlert,
} = chatSlice.actions;

export default chatSlice;
