import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    include: ["src/**/*.test.{ts,tsx}"],
  },
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: "charts",
              test: /node_modules[\\/]recharts|node_modules[\\/]d3-/,
            },
            {
              name: "react-vendor",
              test: /node_modules[\\/](react|react-dom|react-router-dom)/,
            },
          ],
        },
      },
    },
  },
});
