import { defineConfig, devices } from "@playwright/test";
import { defineBddConfig } from "playwright-bdd";

const testDir = defineBddConfig({
  features: "tests/features/*.feature",
  steps: "tests/steps/*.steps.ts",
});

export default defineConfig({
  testDir,

  workers: process.env.CI ? 1 : undefined,
  webServer: {

    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: "http://localhost:5173",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    // Opcional: usar um Chromium já instalado (PW_CHROMIUM_PATH) em vez do
    // baixado pelo `npx playwright install`. Sem a variável, nada muda.
    ...(process.env.PW_CHROMIUM_PATH ? { launchOptions: { executablePath: process.env.PW_CHROMIUM_PATH } } : {}),
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});