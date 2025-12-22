import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type UserConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig((): UserConfig => {
  // const apiProxyTarget = "http://localhost:8080/api";
  // const apiProxyTarget = "https://personal.komlosidev.net/api";
  return {
    plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
    // server: {
    //   proxy: {
    //     '^api/.*': {
    //       target: apiProxyTarget,
    //       changeOrigin: true,
    //     },
    //   },
    // },
  }
});
