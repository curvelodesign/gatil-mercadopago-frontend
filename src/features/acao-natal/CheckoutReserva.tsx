import { useCallback, useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { usePixAcompanhamento } from "@/features/pix/usePixAcompanhamento"
import type { PixCriado } from "@/features/pix/types"
import { utmsAceitas } from "@/features/donation/utm"
import { useUtmParams } from "@/hooks/useUtmParams"
import { ApiRequestError } from "@/types/api"
import { A, ACAO } from "@/features/acao-natal/config"
import { Turnstile, turnstileAtivo } from "@/features/acao-natal/Turnstile"
import {
  buscarReserva,
  consultarStatusPixReserva,
  criarPagamentoCartaoReserva,
  criarPixReserva,
  guardarReserva,
  liberarReserva,
  reservaGuardada,
  reservarNumeros,
  type Contato,
  type Reserva,
  type ResumoCompra,
} from "@/features/acao-natal/api"

const pad = (n: number) => String(n).padStart(3, "0")
const brl = (valor: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor)
const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const tempo = (s: number | null) => s === null ? "" : `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`

/** (71) 99999-8888 enquanto digita */
function mascaraTelefone(valor: string) {
  const d = valor.replace(/\D/g, "").slice(0, 11)
  if (d.length <= 2) return d
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

function problemaNoContato(c: Contato): string | null {
  if (c.nome.trim().replace(/\s+/g, " ").length < 3) return "Informe seu nome completo."
  if (!EMAIL_VALIDO.test(c.email.trim())) return "Esse e-mail parece incompleto. Confere pra gente?"
  const d = c.phone.replace(/\D/g, "")
  if (d.length < 10 || d.length > 13) return "Informe um WhatsApp com DDD."
  if (!c.aceiteTermos) return "Para continuar, aceite o Regulamento e a Política de Privacidade."
  return null
}

/** Mensagem do backend para limites e anti-robô; o resto vira a mensagem padrão. */
function mensagemDoErro(err: unknown, padrao: string) {
  if (err instanceof ApiRequestError && [403, 429, 503].includes(err.status) && err.message) return err.message
  return padrao
}

type Etapa = "escolhendo" | "pagando" | "pix" | "pronto"

/**
 * Fluxo completo (ACAO.fluxoCompleto): a pessoa escolhe até 10 números no
 * quadro, eles ficam guardados por 15 minutos e ela paga o total. Gerado o
 * pagamento, o Pix (ou o link do cartão) vale 30 minutos. A reserva fica
 * guardada nesta aba: recarregar a página ou voltar do cartão retoma de onde
 * parou. As chamadas ao backend estão em api.ts.
 */
export function CheckoutReserva({ selected, onRemove, onRandom, onTaken, onComplete, onClear }: {
  selected: number[]
  onRemove: (n: number) => void
  onRandom: (k: number) => void
  /** Números que alguém tirou antes: saem da seleção */
  onTaken: (numeros: number[]) => void
  /** Pagamento aprovado: os números passam a ter dono */
  onComplete: (numeros: number[]) => void
  onClear: () => void
}) {
  const utm = useUtmParams()
  const [etapa, setEtapa] = useState<Etapa>("escolhendo")
  const [reserva, setReserva] = useState<Reserva | null>(null)
  const [pix, setPix] = useState<PixCriado | null>(null)
  const [compra, setCompra] = useState<ResumoCompra | null>(null)
  const [payment, setPayment] = useState<"pix" | "card">("pix")
  const [contato, setContato] = useState<Contato>({ nome: "", email: "", phone: "", aceiteTermos: false })
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [turnstileVersao, setTurnstileVersao] = useState(0)
  const [aviso, setAviso] = useState("")
  const [ocupado, setOcupado] = useState(false)
  const [copiado, setCopiado] = useState(false)
  const [compartilhado, setCompartilhado] = useState(false)
  const [agora, setAgora] = useState(() => Date.now())
  const numeros = compra?.numerosConfirmados.length ? compra.numerosConfirmados : reserva?.numeros ?? selected
  const um = numeros.length === 1
  const total = reserva?.valor ?? selected.length * 100

  const concluir = useCallback((resumo: ResumoCompra) => {
    guardarReserva(null)
    setCompra(resumo)
    setEtapa("pronto")
    onComplete(resumo.numerosConfirmados)
  }, [onComplete])

  const { etapa: etapaPix, segundosRestantes } = usePixAcompanhamento(pix, {
    consultarStatus: consultarStatusPixReserva,
    aoAprovar: () => {
      const id = reserva?.reservaId
      const confirmadaSemResumo = (): ResumoCompra => ({
        reservaId: id ?? "", status: "PAGO", numeros, numerosConfirmados: numeros, numerosAEscolher: 0,
        linksEscolha: [], valor: total, expiraEm: "", teste: Boolean(reserva?.teste), pagamento: null,
      })
      if (!id) return concluir(confirmadaSemResumo())
      buscarReserva(id).then(concluir).catch(() => concluir(confirmadaSemResumo()))
    },
  })

  // Retoma a reserva desta aba (recarregou a página, voltou do cartão)
  const retomou = useRef(false)
  useEffect(() => {
    if (retomou.current) return
    retomou.current = true
    const id = reservaGuardada()
    if (!id) return
    buscarReserva(id).then((r) => {
      if (r.status === "PAGO" || r.status === "PAGO_PARCIAL") return concluir(r)
      if (r.status !== "RESERVADO" && r.status !== "AGUARDANDO_PAGAMENTO") return guardarReserva(null)
      setReserva({ reservaId: r.reservaId, numeros: r.numeros, indisponiveis: [], expiraEm: r.expiraEm, valor: r.valor, teste: r.teste })
      setAgora(Date.now())
      const p = r.pagamento
      if (p?.metodo === "pix" && p.paymentId && p.rastreioId && p.qrCode && p.qrCodeBase64) {
        setPix({ paymentId: p.paymentId, rastreioId: p.rastreioId, qrCode: p.qrCode, qrCodeBase64: p.qrCodeBase64, expiraEm: p.expiraEm, valor: r.teste ? 0.01 : r.valor, teste: r.teste })
        setEtapa("pix")
      } else {
        setEtapa("pagando")
      }
    }).catch(() => guardarReserva(null))
  }, [concluir])

  // Relógio da reserva de 15 minutos (enquanto escolhe como pagar)
  const fimReserva = reserva ? Date.parse(reserva.expiraEm) : NaN
  const segundosReserva = Number.isFinite(fimReserva) ? Math.max(0, Math.floor((fimReserva - agora) / 1000)) : null
  useEffect(() => {
    if (!reserva || etapa !== "pagando") return
    const t = window.setInterval(() => setAgora(Date.now()), 1000)
    return () => window.clearInterval(t)
  }, [reserva, etapa])
  const expirou = useRef(false)
  useEffect(() => {
    if (etapa !== "pagando" || segundosReserva !== 0 || expirou.current) return
    expirou.current = true
    guardarReserva(null)
    setReserva(null); setPix(null); setEtapa("escolhendo"); onClear()
    setAviso(`Os ${ACAO.minutosReserva} minutos passaram e seus bilhetes voltaram pro quadro. Se ninguém pegou, ainda dá tempo.`)
  }, [segundosReserva, etapa, onClear])

  useEffect(() => {
    if (pix && etapaPix === "expirado") {
      guardarReserva(null)
      setAviso("Esse Pix expirou e nenhum valor foi cobrado. Seus bilhetes voltaram pro quadro: toque em Continuar pra guardar de novo.")
    }
  }, [pix, etapaPix])

  function voltarAoQuadro(mensagem: string) {
    guardarReserva(null)
    setReserva(null); setPix(null); setEtapa("escolhendo")
    setAviso(mensagem)
  }

  async function continuar() {
    if (!selected.length || ocupado) return
    if (turnstileAtivo && !turnstileToken) { setAviso("Só um instante: estamos confirmando que você não é um robô."); return }
    setOcupado(true); setAviso("")
    try {
      const nova = await reservarNumeros(selected, utmsAceitas(utm), turnstileToken)
      if (nova.indisponiveis.length) {
        onTaken(nova.indisponiveis)
        setAviso(`Ih, alguém tirou o ${nova.indisponiveis.map(pad).join(", ")} um segundo antes de você. Os outros continuam guardados, e o total foi atualizado.`)
      }
      expirou.current = false
      guardarReserva(nova.reservaId)
      setAgora(Date.now()); setReserva(nova); setPix(null); setEtapa("pagando")
    } catch (err) {
      if (err instanceof ApiRequestError && err.status === 409) {
        const indisponiveis = (err.data as { indisponiveis?: number[] } | undefined)?.indisponiveis ?? selected
        onTaken(indisponiveis)
        setAviso(indisponiveis.length === 1
          ? `O ${pad(indisponiveis[0])} acabou de ganhar dono. Escolhe outro?`
          : "Esses bilhetes acabaram de ganhar dono. Escolhe outros?")
      } else {
        setAviso(mensagemDoErro(err, "Não conseguimos guardar seus bilhetes agora. Tenta de novo em instantes."))
      }
    } finally {
      setOcupado(false)
      // Cada token anti-robô vale para uma reserva só
      setTurnstileVersao((v) => v + 1)
    }
  }

  async function trocarNumeros() {
    const id = reserva?.reservaId
    guardarReserva(null)
    setReserva(null); setPix(null); setEtapa("escolhendo"); setAviso("")
    if (id) liberarReserva(id).catch(() => undefined)
  }

  async function pagar() {
    if (!reserva || ocupado) return
    const problema = problemaNoContato(contato)
    if (problema) { setAviso(problema); return }
    setOcupado(true); setAviso("")
    const dados = { ...contato, nome: contato.nome.trim(), email: contato.email.trim() }
    try {
      if (payment === "pix") {
        setPix(await criarPixReserva(reserva.reservaId, dados))
        setEtapa("pix")
      } else {
        const { initPoint } = await criarPagamentoCartaoReserva(reserva.reservaId, dados)
        window.location.href = initPoint
        return
      }
    } catch (err) {
      if (err instanceof ApiRequestError && err.status === 410) {
        voltarAoQuadro("Sua reserva venceu e os bilhetes voltaram pro quadro. Se ninguém pegou, é só tocar em Continuar de novo.")
      } else if (err instanceof ApiRequestError && err.status === 409 && (err.data as { status?: string } | undefined)?.status?.startsWith("PAGO")) {
        buscarReserva(reserva.reservaId).then(concluir).catch(() => undefined)
      } else if (err instanceof ApiRequestError && err.status === 400 && err.message) {
        setAviso(err.message)
      } else {
        setAviso(mensagemDoErro(err, payment === "pix" ? "Não conseguimos gerar o Pix agora. Tenta de novo em instantes." : "Não conseguimos abrir o pagamento agora. Tenta de novo ou paga no Pix."))
      }
    }
    setOcupado(false)
  }

  async function copiar(texto: string, tipo: "pix" | "share") {
    try { await navigator.clipboard.writeText(texto) } catch { /* sem permissão: segue */ }
    if (tipo === "pix") setCopiado(true)
    else setCompartilhado(true)
  }

  const passo = etapa === "pagando" || etapa === "pix" ? 2 : etapa === "pronto" ? 3 : 1
  const campo = (k: keyof Contato) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setContato((c) => ({ ...c, [k]: k === "aceiteTermos" ? e.target.checked : k === "phone" ? mascaraTelefone(e.target.value) : e.target.value }))
  const valorPix = pix?.valor ?? total

  return (
    <aside className="cart">
      <img className="cart-cat" src={`${A}/acerola.png`} alt="Acerola com gorro de Natal" />
      <div className="cart-box cane-thin">
        <div className="cart-progress" aria-label={`Passo ${passo} de 3`}>
          {[1, 2, 3].map((s) => <span className={s === passo ? "active" : s < passo ? "done" : ""} key={s}>{s}</span>)}
        </div>
        <span className="label">Passo {passo} de 3</span>

        {reserva?.teste && etapa !== "pronto" && (
          <div className="cart-warning" role="note"><p>🧪 Modo teste: Pix de R$ 0,01 e bilhetes de teste. Pra sair, rode gatilPixTeste(null) no console.</p></div>
        )}

        {aviso && (
          <div className="cart-warning" role="status">
            <p>{aviso}</p>
            <button className="close" onClick={() => setAviso("")} aria-label="Fechar aviso">×</button>
          </div>
        )}

        {etapa === "escolhendo" && (selected.length ? (
          <>
            <h3>{selected.length === 1 ? <>Você tirou o <strong>{pad(selected[0])}</strong></> : <>Você tirou <strong>{selected.length}</strong> bilhetes</>}</h3>
            <div className="tickets">
              {selected.map((n) => <button type="button" key={n} onClick={() => onRemove(n)} aria-label={`Tirar o ${pad(n)}`}>{pad(n)}<span>×</span></button>)}
            </div>
            <h4>{selected.length} {selected.length === 1 ? "bilhete" : "bilhetes"} × R$ 100 = <b>{brl(selected.length * 100)}</b></h4>
            {selected.length < ACAO.maxNumeros
              ? <div className="shortcuts"><button onClick={() => onRandom(1)}>+1 bilhete aleatório</button><button onClick={() => onRandom(3)}>+3 aleatórios</button></div>
              : <p className="micro">Dá pra levar até {ACAO.maxNumeros} bilhetes por compra. Quer mais? Faça outra compra depois.</p>}
            <p>{selected.length === 1 ? "Toque em Continuar e ele fica guardado pra você" : "Toque em Continuar e eles ficam guardados pra você"} por {ACAO.minutosReserva} minutos enquanto paga.</p>
            <Turnstile onToken={setTurnstileToken} versao={turnstileVersao} />
            <button className="button cart-button" disabled={ocupado || (turnstileAtivo && !turnstileToken)} onClick={continuar}>{ocupado ? "Guardando seus bilhetes…" : "Continuar"}</button>
          </>
        ) : (
          <>
            <h3>Ainda sem bilhete</h3>
            <div className="ticket-empty"><small>Ação de Natal · Gatil</small><strong>???</strong><span>Revelação 25/12</span><i className="stamp">Natal 2026</i></div>
            <p>Toque em um bilhete livre. Ele aparece aqui.</p>
            <div className="shortcuts"><button onClick={() => onRandom(1)}>+1 bilhete aleatório</button><button onClick={() => onRandom(3)}>+3 aleatórios</button></div>
          </>
        ))}

        {etapa === "pagando" && reserva && (
          <>
            <h3>Como você quer pagar?</h3>
            <div className="reservation"><span><small>{um ? "Seu bilhete" : "Seus bilhetes"}</small><b>{numeros.map(pad).join(" · ")}</b></span>
              <span className="timer">{um ? "Guardado" : "Guardados"} por mais <b>{tempo(segundosReserva)}</b></span>
              <button onClick={trocarNumeros}>{um ? "Trocar bilhete" : "Trocar bilhetes"}</button></div>
            <div className="payment-options" role="radiogroup" aria-label="Forma de pagamento">
              <button type="button" role="radio" aria-checked={payment === "pix"} className={payment === "pix" ? "active" : ""} onClick={() => setPayment("pix")}><b>Pix</b><span>na hora, aqui mesmo</span></button>
              {!reserva.teste && <button type="button" role="radio" aria-checked={payment === "card"} className={payment === "card" ? "active" : ""} onClick={() => setPayment("card")}><b>Cartão</b><span>em até 2x · Mercado Pago</span></button>}
            </div>
            <fieldset className="contact-fields">
              <legend>Seus dados para a confirmação</legend>
              <label className="email-field">Nome completo<input type="text" autoComplete="name" maxLength={120} placeholder="Seu nome" value={contato.nome} onChange={campo("nome")} /></label>
              <label className="email-field">E-mail para a confirmação<input type="email" inputMode="email" autoComplete="email" maxLength={254} placeholder="voce@exemplo.com" value={contato.email} onChange={campo("email")} /></label>
              <label className="email-field">WhatsApp (com DDD)<input type="tel" inputMode="tel" autoComplete="tel" placeholder="(71) 99999-9999" value={contato.phone} onChange={campo("phone")} /></label>
              <label className="consent">
                <input type="checkbox" checked={contato.aceiteTermos} onChange={campo("aceiteTermos")} />
                <span>Li e aceito o <Link to={ACAO.links.regulamento} target="_blank">Regulamento</Link> e a <Link to={ACAO.links.privacidade} target="_blank">Política de Privacidade</Link>.</span>
              </label>
              <small className="micro">Usamos seus dados só para confirmar a compra e falar com você se o seu bilhete for sorteado. Nada de lista de e-mails.</small>
            </fieldset>
            <button className="button cart-button" disabled={ocupado} onClick={pagar}>
              {ocupado ? (payment === "pix" ? "Gerando Pix…" : "Abrindo pagamento…") : payment === "pix" ? `Gerar Pix de ${brl(reserva.teste ? 0.01 : total)}` : `Pagar ${brl(total)} no cartão`}
            </button>
            <small className="micro">
              {payment === "pix"
                ? `O Pix vale ${ACAO.minutosPagamento} minutos e é gerado pelo Mercado Pago para o Gatil Irmã Francisca (CNPJ 25.382.038/0001-05).`
                : `Você vai para o ambiente seguro do Mercado Pago. O link vale ${ACAO.minutosPagamento} minutos.`}
            </small>
          </>
        )}

        {etapa === "pix" && pix && (etapaPix === "expirado" ? (
          <>
            <h3>Esse Pix expirou</h3>
            <p>Nenhum valor foi cobrado.</p>
            <button className="button cart-button" onClick={() => { setAviso(""); setPix(null); setReserva(null); setEtapa("escolhendo") }}>Escolher de novo</button>
          </>
        ) : (
          <>
            <h3>Escaneie e pronto</h3>
            <img className="qr-img" src={pix.qrCodeBase64.startsWith("data:") ? pix.qrCodeBase64 : `data:image/png;base64,${pix.qrCodeBase64}`} alt="QR code do Pix" width={188} height={188} />
            <button className={`copy-button ${copiado ? "copied" : ""}`} onClick={() => copiar(pix.qrCode, "pix")}>{copiado ? "Código copiado ✓" : "Copiar código Pix"}</button>
            <p>Abra o app do banco e pague <b>{brl(valorPix)}</b>. {um ? <>O <b>{pad(numeros[0])}</b> continua guardado</> : <>Seus <b>{numeros.length}</b> bilhetes continuam guardados</>} até o Pix expirar.</p>
            {segundosRestantes !== null && <b className="pix-time">O Pix expira em {tempo(segundosRestantes)}</b>}
            <div className="pix-status" role="status"><span><i aria-hidden="true" />Aguardando seu pagamento</span></div>
          </>
        ))}

        {etapa === "pronto" && compra && (
          <>
            <h3>{compra.numerosConfirmados.length === 1 ? <>Tirou! O <strong>{pad(compra.numerosConfirmados[0])}</strong> é seu 🎄</> : <>Tirou! Os <strong>{compra.numerosConfirmados.length}</strong> bilhetes são seus 🎄</>}</h3>
            <div className="final-tickets">{compra.numerosConfirmados.map((n) => <div className="final-ticket" key={n}><span>Ação de Natal · Gatil</span><strong>{pad(n)}</strong><small>Revelação 25/12</small></div>)}</div>
            {compra.numerosAEscolher > 0 && (
              <div className="cart-warning" role="status">
                <p>{compra.numerosAEscolher === 1 ? "Um bilhete" : `${compra.numerosAEscolher} bilhetes`} que você reservou {compra.numerosAEscolher === 1 ? "foi tirado" : "foram tirados"} por outra pessoa antes do pagamento ser confirmado. Escolha {compra.numerosAEscolher === 1 ? "outro" : "outros"}:</p>
                {compra.linksEscolha.map((link, i) => <p key={link}><Link to={link}>Escolher o {i + 1}º bilhete</Link></p>)}
              </div>
            )}
            <p>A confirmação foi enviada para o seu e-mail.</p>
            <button className={`button cart-button ${compartilhado ? "success" : ""}`} onClick={() => copiar(`Tirei 300 gatos no amigo secreto 🎄 Entrei na ação solidária de Natal do Gatil Irmã Francisca: cada bilhete de R$ 100 ajuda a cuidar dos gatos, e o sorteio é dia 25/12. ${location.origin}/rifa`, "share")}>
              {compartilhado ? "Mensagem copiada ✓" : "Chamar mais gente"}
            </button>
          </>
        )}

        <div className="acerola-tip">
          <img src={`${A}/acerola.png`} alt="" />
          <div><small>Acerola, gata do Gatil</small><p>Dá uma olhada nas últimas abas. Os bilhetes grandes também dão sorte, viu?</p></div>
        </div>
      </div>
    </aside>
  )
}
