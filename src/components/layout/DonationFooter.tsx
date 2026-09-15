import { DONATION_INSTAGRAM_URL } from "@/features/donation/constants";

export function DonationFooter() {
  return (
    <footer className="px-4 py-9 text-center text-xs leading-relaxed text-carvao/60">
      <p> <strong className="text-verde-escuro">Gatil Irmã Francisca</strong> · 10
        anos cuidando de quem não tem voz.</p>
    <p>
        Sua doação vai direto para o cuidado diário dos gatos - alimentação, saúde e abrigo. Dúvidas? Fale com a gente pelo{" "}
        <a href={DONATION_INSTAGRAM_URL} className="underline">
          Instagram
        </a>
        .
    </p>
      <p>
        Esta é uma ação oficial do Gatil Irmã Francisca — CNPJ 25.382.038/0001-05.
      </p>
    </footer>
  );
}