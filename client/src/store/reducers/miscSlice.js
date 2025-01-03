import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isMobile: false,
  isAddMembers: false,
  isNewGroup: false,
  isNotification: false,
  isSearch: false,
  isFileMenu: false,
  isDeleteChat: false,
  isDeleteMenu: false,
  uploadingLoader: false,
  selectedDeleteChat: {
    chatId: "",
    groupChat: false,
  },
};

const miscSlice = createSlice({
  name: "misc",
  initialState,
  reducers: {
    setMobile: (state, action) => {
      state.isMobile = action.payload;
    },
    setAddMembers: (state, action) => {
      state.isAddMembers = action.payload;
    },
    setNewGroup: (state, action) => {
      state.isNewGroup = action.payload;
    },
    setNotification: (state, action) => {
      state.isNotification = action.payload;
    },
    setSearch: (state, action) => {
      state.isSearch = action.payload;
    },
    setFileMenu: (state, action) => {
      state.isFileMenu = action.payload;
    },
    setDeleteMenu: (state, action) => {
      state.isDeleteMenu = action.payload;
    },
    setDeleteChat: (state, action) => {
      state.isDeleteChat = action.payload;
    },
    setUploadingLoader: (state, action) => {
      state.uploadingLoader = action.payload;
    },
    setSelectedDeleteChat: (state, action) => {
      state.selectedDeleteChat = action.payload;
    },
  },
});

export const {
  setMobile,
  setAddMembers,
  setNewGroup,
  setNotification,
  setSearch,
  setFileMenu,
  setDeleteMenu,
  setDeleteChat,
  setUploadingLoader,
  setSelectedDeleteChat,
} = miscSlice.actions;

export default miscSlice;
