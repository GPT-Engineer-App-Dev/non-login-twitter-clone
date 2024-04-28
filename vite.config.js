import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: "8080",
  },
  plugins: [react()],
  base: "",
  resolve: {
    alias: {
      'lib': resolve(__dirname, 'lib'),
    },
  },
});
