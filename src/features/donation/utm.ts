// Valores de UTM que o backend aceita hoje (espelho de api/types/origem.types.ts).
// Qualquer outro valor vai como null: sem isso, um anúncio com utm_medium=cpc ou
// o utm_source=ig que o Instagram coloca no link da bio fariam o backend recusar
// a criação do pagamento.
const UTM_SOURCE = ["LANDING_PAGE", "INSTAGRAM", "FACEBOOK", "FEIRA_ADOCAO"];
const UTM_MEDIUM = ["ORGANICO", "PAGO"];
const UTM_CAMPAIGN = ["CAMPANHA_ESPECIFICA", "RIFA_SOLIDARIA"];

function aceito(valor: string | null, permitidos: string[]): string | null {
  if (!valor) return null;
  return permitidos.includes(valor.trim().toUpperCase()) ? valor : null;
}

export function utmsAceitas(utm: { utmSource: string | null; utmMedium: string | null; utmCampaign: string | null }) {
  return {
    utmSource: aceito(utm.utmSource, UTM_SOURCE),
    utmMedium: aceito(utm.utmMedium, UTM_MEDIUM),
    utmCampaign: aceito(utm.utmCampaign, UTM_CAMPAIGN),
  };
}
