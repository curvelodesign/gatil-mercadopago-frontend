import { compartilhar } from "@/features/landing-doacao/compartilhar";

// Quanto já foi arrecadado no mês: a linha embaixo da meta acompanha esse número
const META = 15000;
const ARRECADADO = 0;

/** Card da meta de arrecadação. ARRECADADO é atualizado à mão conforme as doações entram. */
export function Meta({ onDoar }: { onDoar: (valor?: number) => void }) {
  const progresso = Math.min(100, (ARRECADADO / META) * 100);

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
            {/* A linha acompanha a arrecadação: ajuste ARRECADADO no topo deste arquivo */}
            <progress className="meta__barra" max={100} value={progresso} aria-label="Progresso da meta"></progress>
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
