import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/authSlice";
import apiSlice from "./api/apiSlice";
import miscSlice from "./reducers/miscSlice";
import chatSlice from "./reducers/chatSlice";

const store = configureStore({
  reducer: {
    [authSlice.name]: authSlice.reducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    [miscSlice.name]: miscSlice.reducer,
    [chatSlice.name]: chatSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export default store;
