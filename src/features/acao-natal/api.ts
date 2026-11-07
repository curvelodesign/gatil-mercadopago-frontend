import { apiClient } from "@/lib/api/client"
import type { PixCriado, StatusPix } from "@/features/pix/types"
import { consultarStatusPixRifa } from "@/lib/api/raffle"

/**
 * Fluxo completo da Ação de Natal: escolhe vários números, reserva por
 * 15 minutos e paga o total. TODAS as chamadas novas ao backend ficam aqui.
 *
 * ⚠️ Daniel: os caminhos e formatos abaixo são uma proposta. Ajuste-os ao
 * que o backend expõe e depois ligue ACAO.fluxoCompleto em config.ts.
 * Enquanto a chave estiver desligada, nada daqui é chamado.
 */

interface Origem {
  utmSource?: string | null
  utmMedium?: string | null
  utmCampaign?: string | null
}

export interface Reserva {
  /** Identificador da reserva no backend */
  reservaId: string
  /** Números que ficaram guardados (o backend pode recusar algum que já foi tirado) */
  numeros: number[]
  /** Números pedidos que já tinham dono (o front avisa a pessoa) */
  indisponiveis: number[]
  /** Fim da reserva (ISO). O front mostra a contagem e libera quando acabar. */
  expiraEm: string
}

/** Guarda os números escolhidos por 15 minutos. 409 = todos já foram tirados. */
export async function reservarNumeros(numeros: number[], origem: Origem): Promise<Reserva> {
  const resposta = await apiClient.post<{ message: string; data: Reserva }>("/rifa/reservar", { numeros, ...origem })
  return resposta.data
}

/** Devolve os números ao quadro (troca de números ou desistência). */
export async function liberarReserva(reservaId: string): Promise<void> {
  await apiClient.post("/rifa/liberar-reserva", { reservaId })
}

/** Pix do valor total da reserva (R$ 100 × quantidade), gerado e acompanhado no site. */
export async function criarPixReserva(reservaId: string, email: string, origem: Origem): Promise<PixCriado> {
  const resposta = await apiClient.post<{ message: string; data: PixCriado }>("/rifa/criar-pix", { reservaId, email, ...origem })
  return resposta.data
}

/** Cartão (Checkout Pro) do valor total da reserva: devolve o link do Mercado Pago. */
export async function criarPagamentoCartaoReserva(reservaId: string, origem: Origem): Promise<{ initPoint: string }> {
  return apiClient.post<{ initPoint: string }>("/rifa/criar-pagamento", { reservaId, ...origem })
}

/** Status do Pix: o mesmo endpoint que já existe. */
export function consultarStatusPixReserva(paymentId: string | number, ref: string): Promise<StatusPix> {
  return consultarStatusPixRifa(paymentId, ref)
}
