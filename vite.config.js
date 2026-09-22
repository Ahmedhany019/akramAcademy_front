import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [react(),VitePWA({
    registerType: "autoUpdate",

    manifest: {
      name: "EduPress",
      short_name: "EduPress",
      description: "Educational Platform",
      theme_color: "#ffffff",
      background_color: "#ffffff",
      display: "standalone",
      start_url: "/",

      icons: [
        {
          src: "/icons/icon-192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/icons/icon-512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
  }),],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server:{
    host:true,
  }
  
});
