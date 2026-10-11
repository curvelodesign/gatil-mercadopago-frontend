import { useEffect } from "react";
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import { CookieConsent } from "@/features/landing-doacao/CookieConsent";
import { Rodape } from "@/features/landing-doacao/secoes/Rodape";
import { useRastreamento } from "@/lib/analytics/rastreamento";
import "@/features/landing-doacao/landing.css";

/** Layout da landing de doação, das páginas de retorno do pagamento e dos documentos (política e termos). */
export function LandingLayout() {
  const { pathname } = useLocation();
  useRastreamento(pathname);

  // Ao voltar do Mercado Pago pelo "voltar", o Safari do iPhone restaura a página
  // do cache (bfcache) do jeito que ela estava ao sair: com a janela de doação
  // aberta e as medidas da tela erradas, o que desloca a janela e a barra fixa.
  // Recarregar devolve a página limpa.
  useEffect(() => {
    function aoRestaurar(evento: PageTransitionEvent) {
      if (evento.persisted) window.location.reload();
    }
    window.addEventListener("pageshow", aoRestaurar);
    return () => window.removeEventListener("pageshow", aoRestaurar);
  }, []);

  return (
    <div className="lp">
      <Outlet />
      <Rodape />
      <CookieConsent />
      {/* Ao abrir outra página (ex.: links do rodapé), começa do topo; no "voltar", volta onde estava */}
      <ScrollRestoration />
    </div>
  );
}
