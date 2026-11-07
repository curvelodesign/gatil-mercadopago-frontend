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
   * VITE_FLUXO_COMPLETO=true: escolhe até 10 números, reserva por 15 min e paga
   * o total (api.ts). Vazio: paga primeiro e escolhe o número depois (fluxo antigo).
   */
  fluxoCompleto: import.meta.env.VITE_FLUXO_COMPLETO === "true",
  /** Máximo de números por compra (o backend confere: MAX_NUMEROS_POR_PEDIDO). */
  maxNumeros: 10,
  /** Minutos que os números ficam guardados enquanto a pessoa escolhe como pagar. */
  minutosReserva: 15,
  /** Minutos de validade do Pix e do link do cartão. */
  minutosPagamento: 30,
} as const
