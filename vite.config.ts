import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "@styles/variables" as *;
          @use "@styles/mixins" as *;
        `,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@app": path.resolve(__dirname, "./src/app"),
      "@entities": path.resolve(__dirname, "./src/entities"),
      "@features": path.resolve(__dirname, "./src/features"),
      "@images": path.resolve(__dirname, "./src/shared/assets/images"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@shared": path.resolve(__dirname, "./src/shared"),
      "@store": path.resolve(__dirname, "./src/store"),
      "@styles": path.resolve(__dirname, "./src/styles"),
      "@widgets": path.resolve(__dirname, "./src/widgets"),
    },
  },
  server: {
    proxy: {
      "/api/jsonbin": {
        target: "https://api.jsonbin.io",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/jsonbin/, ""),
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            console.log("proxy error", err);
          });
        },
      },
      // Прокси для API чтобы избежать Mixed Content при разработке
      // Используем прокси только если VITE_API_BASE_URL указывает на HTTP
      "/api": {
        target: process.env.VITE_API_BASE_URL || "http://188.116.40.23:3001",
        changeOrigin: true,
        secure: false, // Разрешаем самоподписанные сертификаты для HTTPS
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            console.log("API proxy error", err);
          });
        },
      },
    },
  },
});
