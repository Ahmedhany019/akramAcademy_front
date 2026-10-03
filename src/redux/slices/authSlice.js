import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const storedUser = Cookies.get("user");
const storedToken = Cookies.get("accessToken");

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
          Cookies.set("user", JSON.stringify(user));
        } else {
          Cookies.remove("user");
        }
      }
      if (accessToken !== undefined) {
        state.accessToken = accessToken;
        if (accessToken) {
          Cookies.set("accessToken", accessToken);
        } else {
          Cookies.remove("accessToken");
        }
      }
      state.isAuthenticated = !!state.accessToken;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      Cookies.remove("user");
      Cookies.remove("accessToken");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
