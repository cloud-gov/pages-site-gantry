/// <reference types="vitest" />
import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    // Vitest configuration options
    environment: "happy-dom",
    coverage: {
      provider: "v8",
      reporter: ["text", "text-summary", "html", "json"],
      include: ["src/**/*.{ts,tsx,astro}"],
      exclude: [
        "**/*.test.ts",
        "**/*.spec.ts",
        "**/node_modules/**",
        "**/_site/**",
        "**/dist/**",
        "**/.astro/**",
        "**/*.config.ts",
        "**/*.config.js",
        "**/env.d.ts",
        "**/payload-types.ts",
      ],
    },
  },
});
