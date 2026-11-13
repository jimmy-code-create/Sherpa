import { defineConfig } from "@playwright/test";

/**
 * E2E specs for the 6 rubric criteria that need a real browser.
 * Run: npm i -D @playwright/test && npx playwright install chromium
 *      npx playwright test
 * (Browsers cannot be downloaded inside the Arena sandbox — egress is
 * limited to npm/pypi/github — so these run in CI; scripts/verify.mjs
 * covers the same flows over HTTP in the sandbox.)
 */
export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 60_000,
  use: {
    baseURL: process.env.BASE_URL ?? "http://localhost:3000",
    headless: true,
  },
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: "npm run start",
        url: "http://localhost:3000",
        reuseExistingServer: true,
        timeout: 120_000,
      },
});
