import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";

interface CampaignLayoutProps {
  header: ReactNode;
  footer: ReactNode;
}

export function CampaignLayout({ header, footer }: CampaignLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      {header}
      <main className="flex-1">
        <Outlet />
      </main>
      {footer}
    </div>
  );
}