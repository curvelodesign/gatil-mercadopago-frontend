/**
 * Pix dentro do site (Checkout Transparente só pro Pix).
 *
 * Fica DESLIGADO até o backend ter os endpoints /doacao/criar-pix e
 * /doacao/status/:paymentId. Desligado, a janela de doação funciona como antes
 * (tudo pelo Checkout Pro). Pra ligar em produção: VITE_PIX_NO_SITE=true na Vercel.
 *
 * Pra testar sem mexer no ambiente (testes E2E, homologação), também liga com
 * localStorage.setItem("gatil_pix_no_site", "1").
 */
export function pixNoSiteAtivo(): boolean {
  if (import.meta.env.VITE_PIX_NO_SITE === "true") return true;
  try {
    return localStorage.getItem("gatil_pix_no_site") === "1";
  } catch {
    return false;
  }
}
