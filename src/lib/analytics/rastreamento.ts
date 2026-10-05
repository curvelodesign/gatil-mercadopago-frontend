// Ponto único de rastreamento das páginas de doação: respeita o consentimento.
import { useEffect } from "react";
import { aoMudarConsentimento, lerConsentimento } from "@/lib/analytics/consentimento";
import { initMetaPixel, trackEvent, trackPageView } from "@/lib/analytics/metaPixel";
import { gaEvent, gaPageView, initGA4 } from "@/lib/analytics/ga4";

function carregarAutorizados() {
  const consentimento = lerConsentimento();
  if (consentimento?.marketing) initMetaPixel();
  if (consentimento?.stats) initGA4();
}

/** Carrega o que foi autorizado e registra a visita a cada troca de página. */
export function useRastreamento(pathname: string) {
  useEffect(() => {
    carregarAutorizados();
    trackPageView();
    gaPageView();
  }, [pathname]);

  // Se a pessoa aceitar durante a visita, a página atual também é registrada
  useEffect(
    () =>
      aoMudarConsentimento(() => {
        carregarAutorizados();
        trackPageView();
        gaPageView();
      }),
    [],
  );
}

/** Início da doação: só chega às ferramentas que a pessoa autorizou. */
export function registrarInicioDoacao(valor: number) {
  trackEvent("InitiateCheckout", { value: valor, currency: "BRL" });
  gaEvent("generate_lead", { value: valor, currency: "BRL" });
}
