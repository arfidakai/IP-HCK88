import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    resetChat: (state) => {
      state.messages = [];
    },
  },
});

export const { addMessage, resetChat } = chatSlice.actions;
export default chatSlice.reducer;
