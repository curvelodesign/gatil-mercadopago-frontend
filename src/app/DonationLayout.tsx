import { CampaignLayout } from "@/app/CampaignLayout";
import { DonationFooter } from "@/components/layout/DonationFooter";
import { DonationHeader } from "@/components/layout/DonationHeader";

export function DonationLayout() {
  return <CampaignLayout header={<DonationHeader />} footer={<DonationFooter />} />;
}