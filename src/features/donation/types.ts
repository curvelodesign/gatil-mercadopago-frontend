export interface DonationPayload {
  valor: number;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
}

export interface CreateDonationPaymentResponse {
  initPoint: string;
}