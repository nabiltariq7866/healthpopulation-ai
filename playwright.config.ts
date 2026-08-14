import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  reporter: "line",
  use: {
    baseURL: "http://127.0.0.1:5199",
    browserName: "chromium",
    launchOptions: {
      executablePath:
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    },
    viewport: { width: 1440, height: 1000 },
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
});
