/// <reference types="vitest/config" />

import { resolve } from "node:path";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import UnoCSS from "unocss/vite";
import AutoImport from "unplugin-auto-import/vite";
import SvgComponent from "unplugin-svg-component/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
import { defineConfig, loadEnv } from "vite";
import svgLoader from "vite-svg-loader";

export default defineConfig(({ mode }) => {
  const { VITE_PUBLIC_PATH } = loadEnv(
    mode,
    process.cwd(),
    ""
  ) as ImportMetaEnv;

  return {
    base: VITE_PUBLIC_PATH,
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
        "@@": resolve(__dirname, "src/common"),
      },
    },
    server: {
      host: true,
      port: 3333,
      strictPort: false,
      open: true,
      proxy: {
        "/api/v1": {
          target: "https://apifoxmock.com/m1/2930465-2145633-default",
          ws: false,
          changeOrigin: true,
        },
        cors: true,
      },
      warmup: {
        clientFiles: [
          "./src/layouts/**/*.*",
          "./src/pinia/**/*.*",
          "./src/router/**/*.*",
        ],
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vue: ["vue", "vue-router", "pinia"],
            element: ["element-plus", "@element-plus/icons-vue"],
            vxe: ["vxe-table"],
          },
        },
      },
      reportCompressedSize: false,
      chunkSizeWarningLimit: 2048,
    },
    esbuild:
      mode === "development"
        ? undefined
        : {
            pure: ["console.log"],
            drop: ["debugger"],
            legalComments: "none",
          },
    plugins: [
      vue(),
      vueJsx(),
      svgLoader({
        defaultImport: "url",
        svgoConfig: {
          plugins: [
            {
              name: "preset-default",
              params: {
                overrides: {
                  removeViewBox: false,
                },
              },
            },
          ],
        },
      }),
      SvgComponent({
        iconDir: [resolve(__dirname, "src/common/assets/icons")],
        preserveColor: resolve(
          __dirname,
          "src/common/assets/icons/preserve-color"
        ),
        dts: true,
        dtsDir: resolve(__dirname, "types/auto"),
      }),
      UnoCSS(),
      AutoImport({
        imports: ["vue", "vue-router", "pinia"],
        dts: "types/auto/auto-imports.d.ts",
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        dts: "types/auto/components.d.ts",
        resolvers: [ElementPlusResolver()],
      }),
    ],
    test: {
      include: ["tests/**/*.test.{ts,js}"],
      environment: "happy-dom",
      server: {
        deps: {
          inline: ["element-plus"],
        },
      },
    },
  };
});
