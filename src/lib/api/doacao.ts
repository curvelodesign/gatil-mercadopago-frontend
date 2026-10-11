import { apiClient } from "@/lib/api/client";
import type {
  DonationPayload,
  CreateDonationPaymentResponse,
  PixCriado,
  PixPayload,
  StatusPix,
} from "@/features/donation/types";


export async function criarPagamentoDoacao(
  payload: DonationPayload
): Promise<CreateDonationPaymentResponse> {

  const response = await apiClient.post<{
    data: CreateDonationPaymentResponse;
  }>("/doacao/criar-pagamento", payload);

  return response.data;
}

/**
 * Total arrecadado no mês (doações do site aprovadas, valor líquido).
 * Usado pela barra da meta; se falhar, a barra simplesmente não aparece.
 */
export async function buscarArrecadadoDoMes(): Promise<number> {

  const response = await apiClient.get<{
    data: { total: number };
  }>("/doacao/arrecadado-mes");

  const total = Number(response.data?.total);
  if (!Number.isFinite(total) || total < 0) {
    throw new Error("Total do mês inválido");
  }
  return total;
}

/** Pix dentro do site: o backend cria o pagamento Pix no Mercado Pago e devolve o QR code. */
export async function criarPix(payload: PixPayload): Promise<PixCriado> {

  const response = await apiClient.post<{
    data: PixCriado;
  }>("/doacao/criar-pix", payload);

  return response.data;
}

/**
 * Status de um Pix criado pelo site. O ref (rastreioId) vai junto porque o
 * paymentId do Mercado Pago é sequencial: sem ele, daria pra consultar
 * pagamentos de outras pessoas.
 */
export async function consultarStatusPix(paymentId: string | number, ref: string): Promise<StatusPix> {

  const response = await apiClient.get<{
    data: { status: StatusPix };
  }>(`/doacao/status/${encodeURIComponent(String(paymentId))}?ref=${encodeURIComponent(ref)}`);

  return response.data.status;
}
