import { defineConfig, devices } from "@playwright/test";
import { defineBddConfig } from "playwright-bdd";

const testDir = defineBddConfig({
  features: "tests/features/*.feature",
  steps: "tests/steps/*.steps.ts",
});

/**
 * Três servidores do mesmo app, um por modo:
 * - 5173: padrão (paga primeiro, escolhe o número depois) — cenários sem tag;
 * - 5174: VITE_FLUXO_COMPLETO=true (escolhe os números antes de pagar) — @reserva;
 * - 5175: npm run dev:mock (backend falso em memória) — @mock.
 * Em todos, o backend de verdade nunca é chamado.
 */
const servidor = (porta: number, comando: string, env: Record<string, string> = {}) => ({
  command: comando,
  url: `http://localhost:${porta}`,
  reuseExistingServer: !process.env.CI,
  env: { VITE_API_URL: "/api", ...env },
});

export default defineConfig({
  testDir,

  workers: process.env.CI ? 1 : undefined,
  webServer: [
    servidor(5173, "npm run dev"),
    servidor(5174, "npx vite --port 5174 --strictPort", { VITE_FLUXO_COMPLETO: "true", VITE_PIX_NO_SITE: "true" }),
    servidor(5175, "npx vite --mode mock --port 5175 --strictPort"),
  ],
  use: {
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    // Opcional: usar um Chromium já instalado (PW_CHROMIUM_PATH) em vez do
    // baixado pelo `npx playwright install`. Sem a variável, nada muda.
    ...(process.env.PW_CHROMIUM_PATH ? { launchOptions: { executablePath: process.env.PW_CHROMIUM_PATH } } : {}),
  },
  projects: [
    { name: "chromium", grepInvert: /@reserva|@mock/, use: { ...devices["Desktop Chrome"], baseURL: "http://localhost:5173" } },
    { name: "reserva", grep: /@reserva/, use: { ...devices["Desktop Chrome"], baseURL: "http://localhost:5174" } },
    { name: "mock", grep: /@mock/, use: { ...devices["Desktop Chrome"], baseURL: "http://localhost:5175" } },
  ],
});
