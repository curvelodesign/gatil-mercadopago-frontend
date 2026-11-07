import { apiClient } from "@/lib/api/client"
import type { PixCriado, StatusPix } from "@/features/pix/types"
import { consultarStatusPixRifa } from "@/lib/api/raffle"
import { chavePixTeste } from "@/features/pix/pixTeste"

/**
 * Fluxo completo da Ação de Natal: escolhe de 1 a 10 números, eles ficam
 * reservados por 15 minutos e a pessoa paga o total. Gerado o pagamento, o
 * Pix e o link do cartão valem 30 minutos (o mesmo instante para os dois).
 * TODAS as chamadas da reserva ao backend ficam aqui (contrato em
 * gatil-mercadopago-backend/api/services/pedido.service.ts).
 */

interface Origem {
  utmSource?: string | null
  utmMedium?: string | null
  utmCampaign?: string | null
}

export interface Contato {
  nome: string
  email: string
  phone: string
  /** Aceite do Regulamento e da Política de Privacidade (LGPD). */
  aceiteTermos: boolean
}

export interface Reserva {
  /** Identificador da reserva no backend (UUID aleatório: só quem reservou conhece). */
  reservaId: string
  /** Números que ficaram guardados (o backend pode recusar algum que já foi tirado) */
  numeros: number[]
  /** Números pedidos que já tinham dono (o front avisa a pessoa) */
  indisponiveis: number[]
  /** Fim da reserva (ISO). O front mostra a contagem e libera quando acabar. */
  expiraEm: string
  /** Total em reais, calculado no backend */
  valor: number
  /** Reserva do Pix de teste (R$ 0,01) */
  teste?: boolean
}

export type StatusPedido = "RESERVADO" | "AGUARDANDO_PAGAMENTO" | "PAGO" | "PAGO_PARCIAL" | "EXPIRADO" | "CANCELADO"

/** Estado da reserva/compra, sem dados pessoais. */
export interface ResumoCompra {
  reservaId: string
  status: StatusPedido
  numeros: number[]
  numerosConfirmados: number[]
  /** Números que se perderam antes do pagamento ser aprovado: a pessoa escolhe outros. */
  numerosAEscolher: number
  /** Links (caminhos do site) para escolher os números que se perderam. */
  linksEscolha: string[]
  valor: number
  expiraEm: string
  teste: boolean
  pagamento: {
    metodo: "pix" | "cartao"
    expiraEm: string
    paymentId: string | null
    rastreioId: string | null
    qrCode: string | null
    qrCodeBase64: string | null
    initPoint: string | null
  } | null
  /** Só na volta do cartão: status do pagamento no Mercado Pago. */
  statusPagamento?: "APROVADO" | "PENDENTE" | "CANCELADO" | null
}

/** Com o modo teste ligado (pixTeste.ts), a reserva e o Pix são de teste. */
const headersTeste = () => {
  const chave = chavePixTeste()
  return chave ? { headers: { "x-pix-teste": chave } } : undefined
}

/** Guarda os números escolhidos por 15 minutos. 409 = todos já foram tirados (o corpo traz `indisponiveis`). */
export async function reservarNumeros(numeros: number[], origem: Origem, turnstileToken: string | null): Promise<Reserva> {
  const resposta = await apiClient.post<{ message: string; data: Reserva }>(
    "/rifa/reservar",
    { numeros, utmSource: origem.utmSource ?? null, utmMedium: origem.utmMedium ?? null, ...(turnstileToken ? { turnstileToken } : {}) },
    headersTeste()
  )
  return resposta.data
}

/** Estado atual da reserva (retomar depois de recarregar a página ou voltar do cartão). */
export async function buscarReserva(reservaId: string): Promise<ResumoCompra> {
  const resposta = await apiClient.get<{ message: string; data: ResumoCompra }>(`/rifa/reserva/${encodeURIComponent(reservaId)}`)
  return resposta.data
}

/** Devolve os números ao quadro (troca de números ou desistência). */
export async function liberarReserva(reservaId: string): Promise<void> {
  await apiClient.post("/rifa/liberar-reserva", { reservaId })
}

/** Pix do valor total da reserva (R$ 100 × quantidade), gerado e acompanhado no site. */
export async function criarPixReserva(reservaId: string, contato: Contato): Promise<PixCriado & { reservaId: string; numeros: number[] }> {
  const resposta = await apiClient.post<{ message: string; data: PixCriado & { reservaId: string; numeros: number[] } }>(
    "/rifa/criar-pix",
    { reservaId, ...contato },
    headersTeste()
  )
  return resposta.data
}

/** Cartão (Checkout Pro) do valor total da reserva: devolve o link do Mercado Pago. */
export async function criarPagamentoCartaoReserva(reservaId: string, contato: Contato): Promise<{ initPoint: string; expiraEm: string }> {
  const resposta = await apiClient.post<{ initPoint: string; data: { initPoint: string; expiraEm: string } }>(
    "/rifa/criar-pagamento",
    { reservaId, ...contato }
  )
  return resposta.data ?? { initPoint: resposta.initPoint, expiraEm: "" }
}

/** Volta do cartão: confere o pagamento no Mercado Pago e devolve a compra. */
export async function consultarCompra(paymentId: string | null, ref: string): Promise<ResumoCompra> {
  const params = new URLSearchParams({ ref, ...(paymentId ? { payment_id: paymentId } : {}) })
  const resposta = await apiClient.get<{ message: string; data: ResumoCompra }>(`/rifa/compra?${params}`)
  return resposta.data
}

/** Status do Pix: o mesmo endpoint do fluxo antigo (aprovado, o backend já confirma os números). */
export function consultarStatusPixReserva(paymentId: string | number, ref: string): Promise<StatusPix> {
  return consultarStatusPixRifa(paymentId, ref)
}

// ---------- reserva guardada nesta aba (retomar depois de recarregar ou voltar do cartão) ----------

const CHAVE_RESERVA = "gatil_reserva_acao"

export function reservaGuardada(): string | null {
  try {
    return sessionStorage.getItem(CHAVE_RESERVA)
  } catch {
    return null
  }
}

export function guardarReserva(reservaId: string | null) {
  try {
    if (reservaId) sessionStorage.setItem(CHAVE_RESERVA, reservaId)
    else sessionStorage.removeItem(CHAVE_RESERVA)
  } catch {
    // Sem sessionStorage (aba anônima restrita): só não retoma depois.
  }
}
