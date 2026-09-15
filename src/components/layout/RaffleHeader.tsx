import { BrandLogo } from "@/components/layout/BrandLogo";

export function RaffleHeader() {
  return (
    <header className="flex items-center justify-between bg-verde-escuro px-5 py-3 text-creme">
      <BrandLogo />
      <span className="rounded-full bg-laranja px-3 py-1.5 text-xs font-bold text-carvao">
        Ação Solidária · 10 anos
      </span>
    </header>
  );
}