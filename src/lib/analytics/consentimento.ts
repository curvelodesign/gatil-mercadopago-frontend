// Consentimento de cookies (LGPD): Meta Pixel e GA4 só carregam depois do aceite.
// A escolha fica guardada por 6 meses neste navegador.

export interface Consentimento {
  stats: boolean;
  marketing: boolean;
  timestamp: number;
}

const CHAVE = "gatil_cookie_consent";
const VALIDADE = 1000 * 60 * 60 * 24 * 30 * 6;
const EVENTO_MUDOU = "gatil:consentimento";
const EVENTO_ABRIR = "gatil:preferencias-cookies";

export function lerConsentimento(): Consentimento | null {
  try {
    const dados = JSON.parse(localStorage.getItem(CHAVE) ?? "null") as Consentimento | null;
    return dados && Date.now() - dados.timestamp < VALIDADE ? dados : null;
  } catch {
    return null;
  }
}

/** Guarda a escolha. Devolve true se alguma permissão foi retirada. */
export function salvarConsentimento(stats: boolean, marketing: boolean): boolean {
  const anterior = lerConsentimento();
  const atual: Consentimento = { stats, marketing, timestamp: Date.now() };
  try {
    localStorage.setItem(CHAVE, JSON.stringify(atual));
  } catch {
    // modo privado sem storage: a escolha vale só para esta visita
  }
  window.dispatchEvent(new Event(EVENTO_MUDOU));
  return Boolean(anterior && ((anterior.stats && !stats) || (anterior.marketing && !marketing)));
}

export function aoMudarConsentimento(acao: () => void) {
  window.addEventListener(EVENTO_MUDOU, acao);
  return () => window.removeEventListener(EVENTO_MUDOU, acao);
}

/** Abre a janela de preferências (usado pelo link "Gerenciar cookies"). */
export function abrirPreferenciasCookies() {
  window.dispatchEvent(new Event(EVENTO_ABRIR));
}

export function aoAbrirPreferencias(acao: () => void) {
  window.addEventListener(EVENTO_ABRIR, acao);
  return () => window.removeEventListener(EVENTO_ABRIR, acao);
}
