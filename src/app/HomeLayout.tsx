import { CampaignLayout } from "@/app/CampaignLayout";
import { DonationHeader } from "@/components/layout/DonationHeader";

// Layout da página provisória da raiz — sem Meta Pixel, pra visitas
// aqui não contarem como da campanha de doação.
export function HomeLayout() {
  return <CampaignLayout header={<DonationHeader />} footer={null} />;
}
