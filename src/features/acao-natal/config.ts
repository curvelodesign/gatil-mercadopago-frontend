/** Ação Solidária de Natal: links, textos fixos e caminhos dos arquivos da landing. */
export const A = "/acao-natal"
export const IMG = "/acao-natal"

export const ACAO = {
  links: {
    instagram: "https://www.instagram.com/gatilirmafrancisca",
    doacao: "/termos#doacao",
    privacidade: "/politica-de-privacidade",
    regulamento: "/regulamento-acao",
  },
  email: "gatilirmafrancisca@gmail.com",
  horario: "20h",
  prazo: "24/12, às 23h59, ou até acabarem os números",
  meta: "R$ 50.000",
  totalNumeros: 500,
  /**
   * false (hoje): paga primeiro, escolhe o número depois (fluxo que já está no ar).
   * true: escolhe vários números, reserva por 15 min e paga o total (api.ts).
   * Daniel: ligue depois que os endpoints de reserva estiverem no backend.
   */
  fluxoCompleto: false,
} as const
