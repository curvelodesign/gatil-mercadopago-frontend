import { useEffect, useRef } from "react";
import { DONATION_PRESET_AMOUNTS } from "@/features/donation/constants";
import { useDonationForm } from "@/features/donation/hooks/useDonationForm";
import { useUtmParams } from "@/hooks/useUtmParams";
import imgCatFami from "@/assets/doacao/cat-fami.webp";

interface Props {
  aberta: boolean;
  valorInicial?: number;
  onFechar: () => void;
}

/** Janela de doação: escolhe o valor e segue para o Mercado Pago (via backend). */
export function JanelaDoacao({ aberta, valorInicial, onFechar }: Props) {
  const janela = useRef<HTMLDialogElement>(null);
  const utm = useUtmParams();
  const {
    selectedAmount,
    customAmount,
    isAmountValid,
    isSubmitting,
    submitError,
    selectPreset,
    updateCustomAmount,
    submit,
  } = useDonationForm({ utm });

  useEffect(() => {
    const el = janela.current;
    if (!el) return;
    if (aberta && !el.open) {
      if (valorInicial && DONATION_PRESET_AMOUNTS.includes(valorInicial)) selectPreset(valorInicial);
      else if (valorInicial) updateCustomAmount(String(valorInicial));
      el.showModal();
    }
    if (!aberta && el.open) el.close();
    // selectPreset/updateCustomAmount mudam a cada render; só a abertura importa aqui
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aberta, valorInicial]);

  return (
    <dialog
      className="janela"
      ref={janela}
      aria-labelledby="doacao-titulo"
      onClose={onFechar}
      onClick={(e) => {
        if (e.target === janela.current) onFechar();
      }}
    >
      <img className="janela__gato" src={imgCatFami} alt="" aria-hidden="true" />
      <div className="janela__corpo">
        <button className="janela__fechar" type="button" aria-label="Fechar" onClick={onFechar}>
          ×
        </button>
        <h2 id="doacao-titulo">Qual valor deseja&nbsp;doar?</h2>
        <p className="janela__texto">
          Toda contribuição ajuda a&nbsp;sustentar a&nbsp;vida dos&nbsp;gatos do&nbsp;Gatil Irmã&nbsp;Francisca.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <div className="painel-valor">
            <div className="presets">
              {DONATION_PRESET_AMOUNTS.map((valor) => (
                <button
                  key={valor}
                  type="button"
                  className={selectedAmount === valor && customAmount === "" ? "preset ativo" : "preset"}
                  onClick={() => selectPreset(valor)}
                >
                  <span className="coracao" />
                  R${valor}
                </button>
              ))}
            </div>
            <p className="ou">ou digite outro&nbsp;valor</p>
            <label className="sr-only" htmlFor="outro-valor">
              Outro valor
            </label>
            <div className="campo">
              <span aria-hidden="true">R$</span>
              <input
                id="outro-valor"
                type="text"
                inputMode="decimal"
                placeholder="Outro valor"
                value={customAmount}
                onChange={(e) => updateCustomAmount(e.target.value)}
              />
            </div>
          </div>
          {submitError && (
            <p className="janela__erro" role="alert">
              {submitError}
            </p>
          )}
          <button className="botao botao-laranja botao-bloco" type="submit" disabled={!isAmountValid || isSubmitting}>
            {isSubmitting ? "Abrindo pagamento..." : "Doar agora 💛"}
          </button>
        </form>
        <p className="janela__seguranca">
          🔒&nbsp;Você será redirecionado ao&nbsp;ambiente seguro do&nbsp;Mercado Pago pra&nbsp;concluir
          sua&nbsp;doação.
        </p>
      </div>
    </dialog>
  );
}
