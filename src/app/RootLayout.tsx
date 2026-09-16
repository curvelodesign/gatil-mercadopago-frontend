import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { trackPageView } from "@/lib/analytics/metaPixel";

export function RootLayout() {

  const location = useLocation();

  useEffect(() => {
    trackPageView();
  }, [location.pathname]);


  return (
    <Outlet />
  );
}
