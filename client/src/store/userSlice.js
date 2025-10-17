import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    token: null,
    info: null,
  },
  reducers: {
    loginUser: (state, action) => {
      state.token = action.payload.token;
      state.info = action.payload.info;
    },
    logoutUser: (state) => {
      state.token = null;
      state.info = null;
    },
  },
});

export const { loginUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
