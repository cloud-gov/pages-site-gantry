// @ts-check
import { loadEnv } from "vite";
import { defineConfig, envField } from "astro/config";
import node from "@astrojs/node";

const env = loadEnv(process.env.NODE_ENV, process.cwd(), "");
const MODE = <"static" | "server" | undefined>env.RENDER_MODE;

let adapter;

if (MODE !== "static") {
  adapter = node({
    mode: "standalone",
  });
}

// Check if we're in a test environment or if required env vars are missing
const isTestEnvironment =
  process.env.NODE_ENV === "test" || process.env.VITEST === "true";
const hasRequiredEnvVars = env.EDITOR_APP_URL && env.PAYLOAD_API_KEY;
if (!isTestEnvironment && !hasRequiredEnvVars) {
  console.error("Unable to build site:");
  console.error(
    "Verify $EDITOR_APP_URL and $PAYLOAD_API_KEY are set in the environment.",
  );
  process.exit(1);
}

export default defineConfig({
  base: env.BASEURL,
  output: MODE || "server",
  adapter,
  outDir: "./_site",
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          loadPaths: ["./node_modules/@uswds/uswds/packages/"],
          quietDeps: true,
        },
      },
    },
    resolve: {
      alias: [
        {
          find: "@uswds-images",
          replacement: "/public/img",
        },
        {
          find: "@/env.d",
          replacement: "/src/env.d.ts",
        },
        {
          find: "@",
          replacement: "/src",
        },
        {
          find: "@theme",
          replacement: "@/styles/index.scss",
        },
      ],
    },
    assetsInclude: ["**/*.png", "**/*.svg"],
    build: {
      rollupOptions: {
        external: ["/pagefind/pagefind.js"],
      },
    },
  },
  devToolbar: {
    enabled: false,
  },
  env: {
    schema: {
      PREVIEW_MODE: envField.string({
        context: "client",
        access: "public",
        optional: true,
      }),
      EDITOR_APP_URL: envField.string({
        context: "client",
        access: "public",
        default: "http://localhost:3000",
      }),
    },
  },
});
