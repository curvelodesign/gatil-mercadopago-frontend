import { Outlet, ScrollRestoration } from "react-router-dom";
import "@/features/acao-natal/acao.css";

/** Ação Solidária de Natal (/rifa) e o regulamento: cabeçalho e rodapé próprios, dentro das páginas. */
export function AcaoLayout() {
  return (
    <>
      <Outlet />
      <ScrollRestoration />
    </>
  );
}
