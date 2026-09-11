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