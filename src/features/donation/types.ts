import type { RastreioDoacao } from "@/lib/analytics/identificadores";

export interface DonationPayload {
  valor: number;
  rastreio?: RastreioDoacao;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
}

export interface CreateDonationPaymentResponse {
  initPoint: string;
}

/** Pix dentro do site: o mesmo payload da doação, mais o e-mail (o Mercado Pago exige). */
export interface PixPayload extends DonationPayload {
  email: string;
}

/** Resposta de POST /doacao/criar-pix */
export interface PixCriado {
  paymentId: string | number;
  /** external_reference do pagamento; também é o event_id da conversão na Meta */
  rastreioId: string;
  /** Código "copia e cola" */
  qrCode: string;
  /** Imagem PNG do QR code em base64 (com ou sem o prefixo data:) */
  qrCodeBase64: string;
  /** Data de expiração do Pix (ISO) */
  expiraEm: string;
}

/** Resposta de GET /doacao/status/:paymentId (o mapearStatusMP do backend, mais EXPIRADO) */
export type StatusPix = "APROVADO" | "PENDENTE" | "CANCELADO" | "EXPIRADO";
