import { useEffect, useState } from "react";
import { compartilhar } from "@/features/landing-doacao/compartilhar";
import { buscarArrecadadoDoMes } from "@/lib/api/doacao";

const META = 15000;

/**
 * Card da meta de arrecadação. A linha de progresso acompanha o total do mês,
 * que vem do backend; enquanto ele não chega (ou se falhar), a linha não aparece,
 * para a página nunca mostrar uma meta vazia.
 */
export function Meta({ onDoar }: { onDoar: (valor?: number) => void }) {
  const [arrecadado, setArrecadado] = useState<number | null>(null);

  useEffect(() => {
    let ativo = true;
    buscarArrecadadoDoMes()
      .then((total) => {
        if (ativo) setArrecadado(total);
      })
      .catch(() => {
        if (ativo) setArrecadado(null);
      });
    return () => {
      ativo = false;
    };
  }, []);

  const progresso = arrecadado === null ? null : Math.min(100, (arrecadado / META) * 100);

  return (
    <>
      <section className="meta">
        <div className="container">
          <div className="meta__cartao">
            <p className="meta__rotulo">
              <span className="coracao"></span>Meta de&nbsp;arrecadação
            </p>
            <p className="meta__valor" id="meta-valor">
              R$15.000
            </p>
            <p className="meta__texto">
              Esse&nbsp;é&nbsp;o&nbsp;valor estimado para&nbsp;sustentar a&nbsp;vida dos&nbsp;cerca
              de&nbsp;300&nbsp;gatos do&nbsp;Gatil&nbsp;mensalmente
            </p>
            {progresso !== null && (
              <progress className="meta__barra" max={100} value={progresso} aria-label="Progresso da meta"></progress>
            )}
            <button className="botao botao-laranja botao-bloco" type="button" onClick={() => onDoar()}>
              Quero Ajudar o&nbsp;Gatil
            </button>
            <button className="link-botao" type="button" onClick={compartilhar}>
              🔗&nbsp;Compartilhar
            </button>
            <p className="meta__nota">
              🔒&nbsp;Você escolhe o&nbsp;valor, qualquer quantia ajuda a&nbsp;alcançar esse&nbsp;número.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
