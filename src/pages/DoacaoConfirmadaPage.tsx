import { Link } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DONATION_INSTAGRAM_URL } from "@/features/donation/constants";

export function DoacaoConfirmadaPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-verde/15 text-3xl">
        🐾
      </div>
      <h1 className="mb-3 font-display text-3xl font-bold text-verde-escuro">
        Muito obrigado pela sua doação!
      </h1>
      <Card className="mb-6 w-full text-sm leading-relaxed text-carvao/80">
        Sua contribuição foi recebida e vai direto para o cuidado dos gatos
        do Gatil Irmã Francisca. Você receberá a confirmação do pagamento
        pelo Mercado Pago.
      </Card>
      <div className="flex w-full flex-col gap-2.5 sm:flex-row">
        <Link to="/doar" className="flex-1">
          <Button variant="secondary" className="w-full">
            Fazer outra doação
          </Button>
        </Link>
        <a
          href={DONATION_INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1"
        >
          <Button className="w-full">Voltar ao Instagram</Button>
        </a>
      </div>
    </div>
  );
}