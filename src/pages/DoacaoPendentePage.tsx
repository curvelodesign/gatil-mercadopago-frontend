import { Card } from "@/components/ui/Card";

export function DoacaoPendentePage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-laranja/15 text-3xl">
        ⏳
      </div>
      <h1 className="mb-3 font-display text-3xl font-bold text-verde-escuro">
        Recebemos sua doação
      </h1>
      <Card className="w-full text-left text-sm leading-relaxed text-carvao/80">
        <p className="mb-3">
          Se você pagou com <strong>PIX</strong> ou <strong>boleto</strong>,
          a confirmação pode levar alguns instantes. Não é necessário fazer
          nada — assim que o pagamento for aprovado, ele será processado
          automaticamente.
        </p>
        <p>Muito obrigado por apoiar o Gatil Irmã Francisca!</p>
      </Card>
    </div>
  );
}