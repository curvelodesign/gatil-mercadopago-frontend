import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { CampaignLayout } from "@/app/CampaignLayout";
import { DonationFooter } from "@/components/layout/DonationFooter";
import { DonationHeader } from "@/components/layout/DonationHeader";
import { initMetaPixel, trackPageView } from "@/lib/analytics/metaPixel";

export function DonationLayout() {
  const location = useLocation();

  // O Meta Pixel mede só a campanha de doação — por isso vive aqui e
  // não no RootLayout.
  useEffect(() => {
    initMetaPixel();
    trackPageView();
  }, [location.pathname]);

  return <CampaignLayout header={<DonationHeader />} footer={<DonationFooter />} />;
}
