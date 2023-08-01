import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    eslint({
      include: ["src/**/*.js", "src/**/*.jsx"], // Adjust the glob pattern to match your source files
      overrideConfig: {
        rules: {
          "react/prop-types": "off", // Disable the react/prop-types rule
        },
      },
    }),
  ],
});
