import { useEffect, useRef, useState } from "react"
import { useRifaPagamento } from "@/features/raffle/hooks/useRifaPagamento"
import { TICKET_PRICE_BRL } from "@/features/raffle/constants"
import { useUtmParams } from "@/hooks/useUtmParams"
import { formatCurrencyBRL } from "@/lib/utils/format"
import { A } from "@/features/acao-natal/config"

function tempoRestante(segundos: number) {
  return `${Math.floor(segundos / 60)}:${String(segundos % 60).padStart(2, "0")}`
}

/**
 * Card de compra da landing de Natal. Usa o pagamento real da rifa
 * (useRifaPagamento): Pix gerado e acompanhado aqui, ou cartão pelo
 * Mercado Pago. Um número por pagamento; aprovado, a pessoa vai pra
 * /rifa/pagamento-aprovado escolher o número.
 *
 * Fase 2: quando o backend tiver reserva de vários números, este card
 * volta a ser o checkout de "escolhe primeiro, paga depois".
 */
export function CheckoutAcao() {
  const utm = useUtmParams()
  const {
    pixAtivo, modoTeste, valorPix, forma, setForma, usaPix, email, setEmail,
    podeEnviar, isSubmitting, submitError, submit, pix, etapa, segundosRestantes, limparPix,
  } = useRifaPagamento({ utm })
  const [copiado, setCopiado] = useState(false)
  const codigoPix = useRef<HTMLElement>(null)
  const valor = formatCurrencyBRL(usaPix || pix ? valorPix : TICKET_PRICE_BRL)

  useEffect(() => setCopiado(false), [pix?.paymentId])

  async function copiarCodigo() {
    if (!pix) return
    try {
      await navigator.clipboard.writeText(pix.qrCode)
      setCopiado(true)
    } catch {
      // Sem acesso à área de transferência: seleciona o código pra pessoa copiar
      const el = codigoPix.current
      if (!el) return
      const faixa = document.createRange()
      faixa.selectNodeContents(el)
      const selecao = window.getSelection()
      selecao?.removeAllRanges()
      selecao?.addRange(faixa)
    }
  }

  const passo = pix && etapa === "aprovado" ? 2 : 1
  const erro = submitError && <div className="cart-warning" role="alert"><p>{submitError}</p></div>
  const aviso = modoTeste && (
    <div className="cart-warning" role="note"><p>🧪 Modo teste: Pix de {formatCurrencyBRL(valorPix)}. Pra sair, rode gatilPixTeste(null) no console.</p></div>
  )

  let conteudo
  if (pix && etapa === "aprovado") {
    conteudo = (
      <>
        <h3>Pagamento confirmado! 🎄</h3>
        <p role="status">Seu Pix de {valor} chegou. Levando você pra escolher o seu número da sorte…</p>
        <div className="progress" aria-hidden="true"><span style={{ width: "100%" }} /></div>
      </>
    )
  } else if (pix && etapa === "expirado") {
    conteudo = (
      <>
        <h3>Esse Pix expirou</h3>
        <p>Nenhum valor foi cobrado. Se ainda quiser participar, é só gerar outro.</p>
        <button className="button cart-button" disabled={isSubmitting} onClick={() => submit()}>
          {isSubmitting ? "Gerando Pix…" : `Gerar novo Pix de ${valor}`}
        </button>
        {erro}
        <button type="button" className="link-button" onClick={limparPix}>Mudar forma de pagamento</button>
      </>
    )
  } else if (pix) {
    const qrSrc = pix.qrCodeBase64.startsWith("data:") ? pix.qrCodeBase64 : `data:image/png;base64,${pix.qrCodeBase64}`
    conteudo = (
      <>
        {aviso}
        <h3>Escaneie e pronto</h3>
        <img className="qr-img" src={qrSrc} alt="QR code do Pix" width={188} height={188} />
        <button className={`copy-button ${copiado ? "copied" : ""}`} onClick={copiarCodigo}>{copiado ? "Código copiado ✓" : "Copiar código Pix"}</button>
        <code className="pix-code" ref={codigoPix} tabIndex={0}>{pix.qrCode}</code>
        <p>Abra o app do banco e pague <b>{valor}</b>. Assim que o Pix cair, a gente te leva pra escolher o seu número.</p>
        <div className="pix-status" role="status">
          <span><i aria-hidden="true" />Aguardando seu pagamento</span>
          {segundosRestantes !== null && <b>expira em {tempoRestante(segundosRestantes)}</b>}
        </div>
        <small className="micro">O Pix é gerado pelo Mercado Pago para o Gatil Irmã Francisca (CNPJ 25.382.038/0001-05).</small>
        <button type="button" className="link-button" onClick={limparPix}>Mudar forma de pagamento</button>
      </>
    )
  } else {
    conteudo = (
      <>
        {aviso}
        <h3>Garanta o seu número</h3>
        <div className="ticket-empty"><small>Ação de Natal · Gatil</small><strong>???</strong><span>Você escolhe depois do pagamento</span><i className="stamp">Natal 2026</i></div>
        <p>Cada número custa <b>{formatCurrencyBRL(TICKET_PRICE_BRL)}</b>. Pagou, escolheu: o número é seu na hora.</p>
        <form className="cart-form" onSubmit={(e) => { e.preventDefault(); submit() }}>
          {pixAtivo && (
            <div className="payment-options" role="radiogroup" aria-label="Forma de pagamento">
              <button type="button" role="radio" aria-checked={forma === "pix"} className={forma === "pix" ? "active" : ""} onClick={() => setForma("pix")}><b>Pix</b><span>na hora, aqui mesmo</span></button>
              <button type="button" role="radio" aria-checked={forma === "cartao"} className={forma === "cartao" ? "active" : ""} onClick={() => setForma("cartao")}><b>Cartão</b><span>em até 2x · Mercado Pago</span></button>
            </div>
          )}
          {usaPix && (
            <label className="email-field">E-mail para a confirmação
              <input type="email" inputMode="email" autoComplete="email" placeholder="voce@exemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
          )}
          <button type="submit" className="button cart-button" disabled={!podeEnviar || isSubmitting}>
            {usaPix ? (isSubmitting ? "Gerando Pix…" : `Gerar Pix de ${valor}`) : (isSubmitting ? "Abrindo pagamento…" : `Pagar ${valor} no cartão`)}
          </button>
          {erro}
        </form>
        <small className="micro">
          {usaPix ? "O Pix é gerado pelo Mercado Pago para o Gatil Irmã Francisca (CNPJ 25.382.038/0001-05)." : "Você vai para o ambiente seguro do Mercado Pago e volta pra escolher o seu número."}
        </small>
      </>
    )
  }

  return (
    <aside className="cart">
      <img className="cart-cat" src={`${A}/acerola.png`} alt="Acerola com gorro de Natal" />
      <div className="cart-box cane-thin">
        <div className="cart-progress" aria-label={`Passo ${passo} de 3`}>
          {[1, 2, 3].map((s) => <span className={s === passo ? "active" : s < passo ? "done" : ""} key={s}>{s}</span>)}
        </div>
        <span className="label">Passo {passo} de 3</span>
        {conteudo}
        <div className="acerola-tip">
          <img src={`${A}/acerola.png`} alt="" />
          <div><small>Acerola, gata do Gatil</small><p>Depois do pagamento, dá uma olhada nas últimas abas. Os números grandes também dão sorte, viu?</p></div>
        </div>
      </div>
    </aside>
  )
}
