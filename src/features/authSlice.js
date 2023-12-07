import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  authAccess: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setGlobalAccess: (state, action) => {
      state.authAccess = action.payload;
    },
  },
});

export const { setGlobalAccess } = authSlice.actions;

export default authSlice.reducer;
