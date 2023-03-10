import { defineConfig } from "vite";
import glslify from "vite-plugin-glslify";

export default defineConfig({
  root: "src",
  publicDir: "../public",
  plugins: [glslify.glslify()],
});
