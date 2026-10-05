import { apiClient } from "@/lib/api/client";
import type {
  DonationPayload,
  CreateDonationPaymentResponse,
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
