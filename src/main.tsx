import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "@/app/router";
import "@/styles/globals.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Elemento #root não encontrado em index.html");
}

function renderizar() {
  createRoot(rootElement!).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}

// Backend falso (npm run dev:mock). import.meta.env.DEV é false no build:
// o mock nem entra no bundle de produção.
if (import.meta.env.DEV && import.meta.env.VITE_API_MOCK === "true") {
  import("@/mocks/mockApi").then(({ instalarMockApi }) => {
    instalarMockApi();
    renderizar();
  });
} else {
  renderizar();
}
