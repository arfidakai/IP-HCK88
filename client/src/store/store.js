import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./chatSlice";
import userReducer from "./userSlice";

const store = configureStore({
  reducer: {
    chat: chatReducer,
    user: userReducer,
  },
});

export default store;
