import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sidebarOpen: false, // mobile drawer
  desktopSidebarCollapsed: false, // desktop collapsible
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    toggleDesktopSidebar: (state) => {
      state.desktopSidebarCollapsed = !state.desktopSidebarCollapsed;
    },
    setDesktopSidebarCollapsed: (state, action) => {
      state.desktopSidebarCollapsed = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleDesktopSidebar,
  setDesktopSidebarCollapsed,
} = uiSlice.actions;
export default uiSlice.reducer;
