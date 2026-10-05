import { Outlet, useLocation } from "react-router-dom";
import { CookieConsent } from "@/features/landing-doacao/CookieConsent";
import { Rodape } from "@/features/landing-doacao/secoes/Rodape";
import { useRastreamento } from "@/lib/analytics/rastreamento";
import "@/features/landing-doacao/landing.css";

/** Layout da landing de doação e das páginas de documento (política e termos). */
export function LandingLayout() {
  const { pathname } = useLocation();
  useRastreamento(pathname);

  return (
    <div className="lp">
      <Outlet />
      <Rodape />
      <CookieConsent />
    </div>
  );
}
