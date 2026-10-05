import { useLocation } from "react-router-dom";
import { CampaignLayout } from "@/app/CampaignLayout";
import { DonationFooter } from "@/components/layout/DonationFooter";
import { DonationHeader } from "@/components/layout/DonationHeader";
import { CookieConsent } from "@/features/landing-doacao/CookieConsent";
import { useRastreamento } from "@/lib/analytics/rastreamento";
import "@/features/landing-doacao/landing.css";

// Páginas de retorno do pagamento. O rastreamento mede só a campanha de doação,
// por isso vive aqui e no LandingLayout, e não no RootLayout; e só depois do
// consentimento de cookies.
export function DonationLayout() {
  const { pathname } = useLocation();
  useRastreamento(pathname);

  return (
    <>
      <CampaignLayout header={<DonationHeader />} footer={<DonationFooter />} />
      <div className="lp">
        <CookieConsent />
      </div>
    </>
  );
}
