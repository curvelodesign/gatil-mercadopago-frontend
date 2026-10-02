import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { verificarPagamento } from "@/lib/api/mercadoPago";
import { useOrderParams } from "@/hooks/useOrderParams";
import { ApiRequestError } from "@/types/api";

export function PagamentoPendentePage() {
  const navigate = useNavigate();
  const { paymentId } = useOrderParams();
  const [isChecking, setIsChecking] = useState(false);
  const [checkError, setCheckError] = useState<string | null>(null);

  async function handleVerificarAgora() {
    if (!paymentId) return;
    setIsChecking(true);
    setCheckError(null);

    try {
      await verificarPagamento(paymentId);
      navigate(`/pagamento-aprovado?payment_id=${paymentId}`);
    } catch (err) {
      // 409 = esse pagamento já escolheu um número; a página de
      // aprovado mostra a confirmação em vez de tratar como erro.
      if (err instanceof ApiRequestError && err.status === 409) {
        navigate(`/pagamento-aprovado?payment_id=${paymentId}`);
        return;
      }
      setCheckError(
        "Ainda não identificamos a confirmação. Se você acabou de pagar no PIX, aguarda mais um minutinho e tenta de novo."
      );
    } finally {
      setIsChecking(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-laranja/15 text-3xl">
        ⏳
      </div>

      <h1 className="mb-3 font-display text-3xl font-bold text-verde-escuro">
        Recebemos seu pagamento
      </h1>

      <Card className="w-full text-left">
        <p className="mb-3 text-sm leading-relaxed text-carvao/80">
          Se você pagou com <strong>PIX</strong>, o Mercado Pago não traz você
          de volta sozinho — precisa clicar em <strong>"Voltar ao site"</strong>{" "}
          na tela dele. Se já fez isso e caiu aqui, é só a confirmação que
          ainda está a caminho.
        </p>
        <p className="mb-5 text-sm leading-relaxed text-carvao/80">
          Isso geralmente leva só alguns segundos. Toque no botão abaixo pra
          gente checar de novo.
        </p>

        <Button onClick={handleVerificarAgora} disabled={isChecking || !paymentId} className="w-full">
          {isChecking ? "Verificando..." : "Já paguei, verificar agora"}
        </Button>

        {checkError && (
          <p className="mt-3 text-xs text-carvao/60" role="status">
            {checkError}
          </p>
        )}

        {!paymentId && (
          <p className="mt-3 text-xs text-red-500" role="alert">
            Não encontramos os dados do seu pagamento nesta página. Volte pelo
            link original ou fale com a gente pelo Instagram do Gatil.
          </p>
        )}
      </Card>

      <p className="mt-6 text-xs text-carvao/40">
        Dúvidas? Fale com a gente pelo Instagram do Gatil.
      </p>
    </div>
  );
}