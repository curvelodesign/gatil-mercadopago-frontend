import { useEffect, useRef, useState } from "react";
import { DONATION_PRESET_AMOUNTS } from "@/features/donation/constants";
import { useDonationForm } from "@/features/donation/hooks/useDonationForm";
import { usePixDoacao } from "@/features/donation/hooks/usePixDoacao";
import { useUtmParams } from "@/hooks/useUtmParams";
import imgCatFami from "@/assets/doacao/cat-fami.webp";
import imgCatFamiDeitado from "@/assets/doacao/cat-fami-deitado.webp";
import imgCatAcerola from "@/assets/doacao/cat-acerola.webp";
import imgCatAxeTriste from "@/assets/doacao/cat-axe-triste.webp";

interface Props {
  aberta: boolean;
  valorInicial?: number;
  onFechar: () => void;
}

const brl = (valor: number) => `R$${Number.isInteger(valor) ? valor : valor.toFixed(2).replace(".", ",")}`;

function tempoRestante(segundos: number) {
  const m = Math.floor(segundos / 60);
  const s = segundos % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function AvisoResponsavel() {
  return (
    <p className="janela__aviso">
      <strong>No&nbsp;Pix, o&nbsp;recebedor aparece como Ana&nbsp;Paula de&nbsp;Sousa Farias,</strong>{" "}
      responsável legal pelo&nbsp;Gatil Irmã&nbsp;Francisca. Pode seguir tranquilo: a&nbsp;doação chega
      ao&nbsp;Gatil.
    </p>
  );
}

/**
 * Janela de doação. Escolhe o valor e:
 * - no cartão (e sempre, com o Pix dentro do site desligado): segue pro Checkout Pro do Mercado Pago;
 * - no Pix dentro do site: mostra o QR code aqui mesmo e acompanha até aprovar.
 */
export function JanelaDoacao({ aberta, valorInicial, onFechar }: Props) {
  const janela = useRef<HTMLDialogElement>(null);
  const utm = useUtmParams();
  const {
    selectedAmount,
    customAmount,
    isSubmitting,
    submitError,
    selectPreset,
    updateCustomAmount,
    submit,
    pixAtivo,
    forma,
    setForma,
    email,
    setEmail,
    podeEnviar,
    valor,
    pix,
    limparPix,
  } = useDonationForm({ utm });
  const { etapa, segundosRestantes } = usePixDoacao(pix, valor);
  const [copiado, setCopiado] = useState(false);
  const codigoPix = useRef<HTMLElement>(null);

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

  useEffect(() => setCopiado(false), [pix?.paymentId]);

  async function copiarCodigo() {
    if (!pix) return;
    try {
      await navigator.clipboard.writeText(pix.qrCode);
      setCopiado(true);
    } catch {
      // Sem acesso à área de transferência: seleciona o código pra pessoa copiar
      const el = codigoPix.current;
      if (el) {
        const faixa = document.createRange();
        faixa.selectNodeContents(el);
        const selecao = window.getSelection();
        selecao?.removeAllRanges();
        selecao?.addRange(faixa);
      }
    }
  }

  const qrSrc = pix
    ? pix.qrCodeBase64.startsWith("data:")
      ? pix.qrCodeBase64
      : `data:image/png;base64,${pix.qrCodeBase64}`
    : "";

  const fechar = (
    <button className="janela__fechar" type="button" aria-label="Fechar" onClick={onFechar}>
      ×
    </button>
  );

  let conteudo;

  if (pix && etapa === "aprovado") {
    conteudo = (
      <>
        <img className="janela__gato" src={imgCatAcerola} alt="" aria-hidden="true" />
        <div className="janela__corpo janela__resultado">
          {fechar}
          <p className="rotulo">Pix recebido</p>
          <h2 id="doacao-titulo">Sua doação de&nbsp;{valor ? brl(valor) : ""} chegou!</h2>
          <p className="janela__texto" role="status">
            Muito obrigado por&nbsp;cuidar dos&nbsp;gatos do&nbsp;Gatil. Levando você pro&nbsp;agradecimento...
          </p>
          <div className="janela__progresso" aria-hidden="true">
            <span />
          </div>
        </div>
      </>
    );
  } else if (pix && etapa === "expirado") {
    conteudo = (
      <>
        <img className="janela__gato" src={imgCatAxeTriste} alt="" aria-hidden="true" />
        <div className="janela__corpo janela__resultado">
          {fechar}
          <p className="rotulo">Pix expirado</p>
          <h2 id="doacao-titulo">Esse Pix expirou</h2>
          <p className="janela__texto">
            O&nbsp;código tem tempo de&nbsp;validade. Se&nbsp;ainda quiser doar, é&nbsp;só gerar outro, rapidinho.
          </p>
          {submitError && (
            <p className="janela__erro" role="alert">
              {submitError}
            </p>
          )}
          <button
            className="botao botao-laranja botao-bloco janela__acao"
            type="button"
            disabled={isSubmitting}
            onClick={() => submit()}
          >
            {isSubmitting ? "Gerando Pix..." : <>Gerar novo Pix de&nbsp;{valor ? brl(valor) : ""}</>}
          </button>
          <button className="link-botao janela__voltar" type="button" onClick={limparPix}>
            Mudar valor ou&nbsp;forma de&nbsp;pagamento
          </button>
        </div>
      </>
    );
  } else if (pix) {
    conteudo = (
      <>
        <img className="janela__gato janela__gato--deitado" src={imgCatFamiDeitado} alt="" aria-hidden="true" />
        <div className="janela__corpo">
          {fechar}
          <h2 id="doacao-titulo">Seu Pix de&nbsp;{valor ? brl(valor) : ""} está&nbsp;pronto</h2>
          <p className="janela__texto">
            Pague pelo app do&nbsp;seu banco. Assim que o&nbsp;Pix cair, a&nbsp;gente te&nbsp;leva pro&nbsp;agradecimento.
          </p>
          <div className="pix">
            <div className="pix__qr">
              <img src={qrSrc} alt="QR code do Pix" width={188} height={188} />
              <p>Aponte a&nbsp;câmera do&nbsp;app do&nbsp;banco</p>
            </div>
            <div className="pix__copia">
              <h3>Pix copia e&nbsp;cola</h3>
              <code className="pix__codigo" ref={codigoPix} tabIndex={0}>
                {pix.qrCode}
              </code>
              <button
                className={copiado ? "botao botao-laranja botao-bloco copiado" : "botao botao-laranja botao-bloco"}
                type="button"
                onClick={copiarCodigo}
              >
                {copiado ? "Código copiado ✓" : "Copiar código"}
              </button>
            </div>
            <div className="pix__status" role="status">
              <span className="ponto" aria-hidden="true" />
              Aguardando seu&nbsp;pagamento
              {segundosRestantes !== null && (
                <span className="pix__tempo">expira em&nbsp;{tempoRestante(segundosRestantes)}</span>
              )}
            </div>
            <AvisoResponsavel />
          </div>
          <button className="link-botao janela__voltar" type="button" onClick={limparPix}>
            Mudar valor ou&nbsp;forma de&nbsp;pagamento
          </button>
        </div>
      </>
    );
  } else {
    const usaPix = pixAtivo && forma === "pix";
    conteudo = (
      <>
        <img className="janela__gato" src={imgCatFami} alt="" aria-hidden="true" />
        <div className="janela__corpo">
          {fechar}
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
                {DONATION_PRESET_AMOUNTS.map((v) => (
                  <button
                    key={v}
                    type="button"
                    className={selectedAmount === v ? "preset ativo" : "preset"}
                    onClick={() => selectPreset(v)}
                  >
                    <span className="coracao" />
                    R${v}
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

            {pixAtivo && (
              <>
                <span className="rotulo-campo" id="rotulo-forma">
                  Como você quer&nbsp;doar?
                </span>
                <div className="formas" role="radiogroup" aria-labelledby="rotulo-forma">
                  <button
                    type="button"
                    className="forma"
                    role="radio"
                    aria-checked={forma === "pix"}
                    onClick={() => setForma("pix")}
                  >
                    <span className="forma__marca" aria-hidden="true">
                      ✓
                    </span>
                    <span className="forma__topo">
                      <span className="forma__nome">Pix</span>
                      <span className="forma__selo">na hora</span>
                    </span>
                    <span className="forma__desc">QR code ou copia e&nbsp;cola, aqui mesmo no&nbsp;site</span>
                  </button>
                  <button
                    type="button"
                    className="forma"
                    role="radio"
                    aria-checked={forma === "cartao"}
                    onClick={() => setForma("cartao")}
                  >
                    <span className="forma__marca" aria-hidden="true">
                      ✓
                    </span>
                    <span className="forma__topo">
                      <span className="forma__nome">Cartão</span>
                    </span>
                    <span className="forma__desc">Crédito em&nbsp;até 2x, pelo Mercado&nbsp;Pago</span>
                  </button>
                </div>
              </>
            )}

            {usaPix && (
              <>
                <label className="rotulo-campo" htmlFor="email-doacao">
                  Seu e-mail
                </label>
                <div className="campo campo--email">
                  <span aria-hidden="true">✉️</span>
                  <input
                    id="email-doacao"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="voce@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <p className="dica">O&nbsp;Mercado Pago envia o&nbsp;comprovante pra&nbsp;esse e-mail.</p>
              </>
            )}

            {submitError && (
              <p className="janela__erro" role="alert">
                {submitError}
              </p>
            )}
            <button
              className="botao botao-laranja botao-bloco janela__acao"
              type="submit"
              disabled={!podeEnviar || isSubmitting}
            >
              {usaPix ? (
                isSubmitting ? (
                  "Gerando Pix..."
                ) : (
                  <>Gerar Pix de&nbsp;{valor ? brl(valor) : "R$..."} 💛</>
                )
              ) : isSubmitting ? (
                "Abrindo pagamento..."
              ) : (
                "Doar agora 💛"
              )}
            </button>
          </form>
          {usaPix ? (
            <p className="janela__seguranca">
              🔒&nbsp;O&nbsp;Pix é&nbsp;gerado pelo Mercado Pago só pra&nbsp;a&nbsp;sua doação.
            </p>
          ) : (
            <p className="janela__seguranca">
              🔒&nbsp;Você será redirecionado ao&nbsp;ambiente seguro do&nbsp;Mercado Pago pra&nbsp;concluir
              sua&nbsp;doação.
            </p>
          )}
          {(usaPix || !pixAtivo) && <AvisoResponsavel />}
        </div>
      </>
    );
  }

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
      {conteudo}
    </dialog>
  );
}
