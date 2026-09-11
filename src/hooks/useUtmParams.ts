import { useSearchParams } from "react-router-dom";

export function useUtmParams() {
  const [searchParams] = useSearchParams();
  return {
    utmSource: searchParams.get("utm_source"),
    utmMedium: searchParams.get("utm_medium"),
    utmCampaign: searchParams.get("utm_campaign"),
  };
}