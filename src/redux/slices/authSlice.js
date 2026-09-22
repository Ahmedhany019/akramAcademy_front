import { createSlice } from "@reduxjs/toolkit";

const storedUser = localStorage.getItem("user");
const storedToken = localStorage.getItem("accessToken");

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  accessToken: storedToken || null,
  isAuthenticated: !!storedToken,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      { payload: { user, accessToken } }
    ) => {
      if (user !== undefined) {
        state.user = user;
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
        } else {
          localStorage.removeItem("user");
        }
      }
      if (accessToken !== undefined) {
        state.accessToken = accessToken;
        if (accessToken) {
          localStorage.setItem("accessToken", accessToken);
        } else {
          localStorage.removeItem("accessToken");
        }
      }
      state.isAuthenticated = !!state.accessToken;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
