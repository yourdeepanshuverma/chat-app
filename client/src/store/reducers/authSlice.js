import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: false,
  user: [],
  isLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userExists: (state, action) => {
      state.status = true;
      state.user = action.payload;
    },
    userNotExists: (state, action) => {
      state.status = false;
      state.user = action.payload;
    },
    logout: (state) => {
      state.status = false;
      state.user = [];
    },
  },
});

export const { userExists, userNotExists, logout } = authSlice.actions;

export default authSlice;
