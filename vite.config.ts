import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type UserConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { resolve } from "path";

export default defineConfig((): UserConfig => {
  // const apiProxyTarget = "http://localhost:3000/api";
  // const apiProxyTarget = "https://personal.komlosidev.net/api";
  return {
    plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
    resolve: {
      alias: {
        "~": resolve(__dirname, "app"),
      },
    },
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
