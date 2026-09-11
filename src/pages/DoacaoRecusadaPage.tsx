import { Link } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function DoacaoRecusadaPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-carvao/10 text-3xl">
        🐾
      </div>
      <h1 className="mb-3 font-display text-3xl font-bold text-verde-escuro">
        Essa doação não foi concluída
      </h1>
      <Card className="w-full text-left text-sm leading-relaxed text-carvao/80">
        <p className="mb-5">
          Pode ter sido cartão recusado, saldo insuficiente ou alguma
          instabilidade momentânea do Mercado Pago. Nenhum valor foi
          cobrado.
        </p>
        <Link to="/doar">
          <Button className="w-full">Tentar novamente</Button>
        </Link>
      </Card>
    </div>
  );
}