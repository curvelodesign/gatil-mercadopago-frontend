import { CampaignLayout } from "@/app/CampaignLayout";
import { RaffleFooter } from "@/components/layout/RaffleFooter";
import { RaffleHeader } from "@/components/layout/RaffleHeader";

export function RaffleLayout() {
  return <CampaignLayout header={<RaffleHeader />} footer={<RaffleFooter />} />;
}