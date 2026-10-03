import { Link } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function PagamentoRecusadoPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-carvao/10 text-3xl">
        🐾
      </div>

      <h1 className="mb-3 font-display text-3xl font-bold text-verde-escuro">
        Esse pagamento não passou
      </h1>

      <Card className="w-full text-left">
        <p className="mb-3 text-sm leading-relaxed text-carvao/80">
          Acontece — geralmente é cartão recusado pelo banco, saldo
          insuficiente ou alguma instabilidade momentânea do Mercado Pago.
          Nenhum valor foi cobrado.
        </p>
        <p className="mb-5 text-sm leading-relaxed text-carvao/80">
          Você pode tentar de novo, com o mesmo cartão ou com PIX.
        </p>

        <Link to="/rifa">
          <Button className="w-full">Tentar novamente</Button>
        </Link>
      </Card>

      <p className="mt-6 text-xs text-carvao/40">
        Se o problema continuar, fale com a gente pelo Instagram
        do Gatil — a gente ajuda a resolver.
      </p>
    </div>
  );
}