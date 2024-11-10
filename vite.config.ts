import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    css: true,
    coverage: {
      reporter: ["text", "json", "html"],
      include: ["src/**/*"],
    },
  },
  build: {
    outDir: "build", // Directorio de salida similar a CRA
  },
});