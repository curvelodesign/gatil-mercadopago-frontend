import { useEffect, useRef, useState } from "react"
import { usePixAcompanhamento } from "@/features/pix/usePixAcompanhamento"
import type { PixCriado } from "@/features/pix/types"
import { utmsAceitas } from "@/features/donation/utm"
import { useUtmParams } from "@/hooks/useUtmParams"
import { ApiRequestError } from "@/types/api"
import { A } from "@/features/acao-natal/config"
import {
  consultarStatusPixReserva,
  criarPagamentoCartaoReserva,
  criarPixReserva,
  liberarReserva,
  reservarNumeros,
  type Reserva,
} from "@/features/acao-natal/api"

const pad = (n: number) => String(n).padStart(3, "0")
const money = (count: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(count * 100)
const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

type Etapa = "escolhendo" | "pagando" | "pix" | "pronto"

/**
 * Fluxo completo (ACAO.fluxoCompleto): a pessoa escolhe vários números no
 * quadro, eles ficam guardados por 15 minutos e ela paga o total. As chamadas
 * ao backend estão em api.ts.
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
  const [payment, setPayment] = useState<"pix" | "card">("pix")
  const [email, setEmail] = useState("")
  const [aviso, setAviso] = useState("")
  const [ocupado, setOcupado] = useState(false)
  const [copiado, setCopiado] = useState(false)
  const [compartilhado, setCompartilhado] = useState(false)
  const [agora, setAgora] = useState(() => Date.now())
  const numeros = reserva?.numeros ?? selected
  const um = numeros.length === 1

  const { etapa: etapaPix, segundosRestantes } = usePixAcompanhamento(pix, {
    consultarStatus: consultarStatusPixReserva,
    aoAprovar: () => { onComplete(numeros); setEtapa("pronto") },
  })

  // Relógio da reserva de 15 minutos
  const fimReserva = reserva ? Date.parse(reserva.expiraEm) : NaN
  const segundosReserva = Number.isFinite(fimReserva) ? Math.max(0, Math.floor((fimReserva - agora) / 1000)) : null
  useEffect(() => {
    if (!reserva || etapa === "pronto") return
    const t = window.setInterval(() => setAgora(Date.now()), 1000)
    return () => window.clearInterval(t)
  }, [reserva, etapa])
  const expirou = useRef(false)
  useEffect(() => {
    if (segundosReserva !== 0 || expirou.current || etapa === "pronto") return
    expirou.current = true
    setReserva(null); setPix(null); setEtapa("escolhendo"); onClear()
    setAviso("Os 15 minutos passaram e seus números voltaram pro quadro. Se ninguém pegou, ainda dá tempo.")
  }, [segundosReserva, etapa, onClear])
  useEffect(() => {
    if (pix && etapaPix === "expirado") setAviso("Esse Pix expirou e nenhum valor foi cobrado.")
  }, [pix, etapaPix])

  const tempo = (s: number | null) => s === null ? "" : `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`

  async function continuar() {
    if (!selected.length || ocupado) return
    setOcupado(true); setAviso("")
    try {
      const nova = await reservarNumeros(selected, utmsAceitas(utm))
      if (nova.indisponiveis.length) {
        onTaken(nova.indisponiveis)
        setAviso(`Ih, alguém tirou o ${nova.indisponiveis.map(pad).join(", ")} um segundo antes de você. ${nova.numeros.length ? "Os outros continuam guardados, e o total foi atualizado." : "Ainda tem outros números esperando dono."}`)
      }
      if (nova.numeros.length) { expirou.current = false; setAgora(Date.now()); setReserva(nova); setEtapa("pagando") }
    } catch (err) {
      setAviso(err instanceof ApiRequestError && err.status === 409 ? "Esses números acabaram de ganhar dono. Escolhe outros?" : "Não conseguimos guardar seus números agora. Tenta de novo em instantes.")
    } finally { setOcupado(false) }
  }

  async function trocarNumeros() {
    if (reserva) liberarReserva(reserva.reservaId).catch(() => undefined)
    setReserva(null); setPix(null); setEtapa("escolhendo")
  }

  async function pagar() {
    if (!reserva || ocupado) return
    if (payment === "pix" && !EMAIL_VALIDO.test(email.trim())) { setAviso("Esse e-mail parece incompleto. Confere pra gente?"); return }
    setOcupado(true); setAviso("")
    try {
      if (payment === "pix") {
        setPix(await criarPixReserva(reserva.reservaId, email.trim(), utmsAceitas(utm)))
        setEtapa("pix")
      } else {
        const { initPoint } = await criarPagamentoCartaoReserva(reserva.reservaId, utmsAceitas(utm))
        window.location.href = initPoint
        return
      }
    } catch {
      setAviso(payment === "pix" ? "Não conseguimos gerar o Pix agora. Tenta de novo em instantes." : "Não conseguimos abrir o pagamento agora. Tenta de novo ou paga no Pix.")
    }
    setOcupado(false)
  }

  async function copiar(texto: string, tipo: "pix" | "share") {
    try { await navigator.clipboard.writeText(texto) } catch { /* sem permissão: segue */ }
    if (tipo === "pix") setCopiado(true)
    else setCompartilhado(true)
  }

  const passo = etapa === "pagando" || etapa === "pix" ? 2 : etapa === "pronto" ? 3 : 1

  return (
    <aside className="cart">
      <img className="cart-cat" src={`${A}/acerola.png`} alt="Acerola com gorro de Natal" />
      <div className="cart-box cane-thin">
        <div className="cart-progress" aria-label={`Passo ${passo} de 3`}>
          {[1, 2, 3].map((s) => <span className={s === passo ? "active" : s < passo ? "done" : ""} key={s}>{s}</span>)}
        </div>
        <span className="label">Passo {passo} de 3</span>

        {aviso && (
          <div className="cart-warning" role="status">
            <p>{aviso}</p>
            {pix && etapaPix === "expirado" && <button onClick={() => { setAviso(""); setPix(null); setEtapa("pagando") }}>Gerar outro Pix</button>}
            <button className="close" onClick={() => setAviso("")} aria-label="Fechar aviso">×</button>
          </div>
        )}

        {etapa === "escolhendo" && (selected.length ? (
          <>
            <h3>{selected.length === 1 ? <>Você tirou o <strong>{pad(selected[0])}</strong></> : <>Você tirou <strong>{selected.length}</strong> números</>}</h3>
            <div className="tickets">
              {selected.map((n) => <button type="button" key={n} onClick={() => onRemove(n)} aria-label={`Tirar o ${pad(n)}`}>{pad(n)}<span>×</span></button>)}
            </div>
            <h4>{selected.length} {selected.length === 1 ? "número" : "números"} × R$ 100 = <b>{money(selected.length)}</b></h4>
            <div className="shortcuts"><button onClick={() => onRandom(1)}>+1 número aleatório</button><button onClick={() => onRandom(3)}>+3 aleatórios</button></div>
            <p>{selected.length === 1 ? "Agora é só pagar pra ele ficar no seu nome." : "Agora é só pagar pra eles ficarem no seu nome."}</p>
            <button className="button cart-button" disabled={ocupado} onClick={continuar}>{ocupado ? "Guardando seus números…" : "Continuar"}</button>
          </>
        ) : (
          <>
            <h3>Ainda sem número</h3>
            <div className="ticket-empty"><small>Ação de Natal · Gatil</small><strong>???</strong><span>Revelação 25/12</span><i className="stamp">Natal 2026</i></div>
            <p>Toque em um número livre. Ele aparece aqui.</p>
            <div className="shortcuts"><button onClick={() => onRandom(1)}>+1 número aleatório</button><button onClick={() => onRandom(3)}>+3 aleatórios</button></div>
          </>
        ))}

        {etapa === "pagando" && reserva && (
          <>
            <h3>Como você quer pagar?</h3>
            <div className="reservation"><span><small>{um ? "Seu número" : "Seus números"}</small><b>{numeros.map(pad).join(" · ")}</b></span>
              <span className="timer">{um ? "Guardado" : "Guardados"} por mais <b>{tempo(segundosReserva)}</b></span>
              <button onClick={trocarNumeros}>{um ? "Trocar número" : "Trocar números"}</button></div>
            <div className="payment-options" role="radiogroup" aria-label="Forma de pagamento">
              <button type="button" role="radio" aria-checked={payment === "pix"} className={payment === "pix" ? "active" : ""} onClick={() => setPayment("pix")}><b>Pix</b><span>na hora, aqui mesmo</span></button>
              <button type="button" role="radio" aria-checked={payment === "card"} className={payment === "card" ? "active" : ""} onClick={() => setPayment("card")}><b>Cartão</b><span>em até 2x · Mercado Pago</span></button>
            </div>
            {payment === "pix" && <label className="email-field">E-mail para a confirmação<input type="email" inputMode="email" autoComplete="email" placeholder="voce@exemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} /></label>}
            <button className="button cart-button" disabled={ocupado} onClick={pagar}>
              {ocupado ? (payment === "pix" ? "Gerando Pix…" : "Abrindo pagamento…") : payment === "pix" ? `Gerar Pix de ${money(numeros.length)}` : `Pagar ${money(numeros.length)} no cartão`}
            </button>
            {payment === "pix" && <small className="micro">O Pix é gerado pelo Mercado Pago para o Gatil Irmã Francisca (CNPJ 25.382.038/0001-05).</small>}
          </>
        )}

        {etapa === "pix" && pix && (
          <>
            <h3>Escaneie e pronto</h3>
            <img className="qr-img" src={pix.qrCodeBase64.startsWith("data:") ? pix.qrCodeBase64 : `data:image/png;base64,${pix.qrCodeBase64}`} alt="QR code do Pix" width={188} height={188} />
            <button className={`copy-button ${copiado ? "copied" : ""}`} onClick={() => copiar(pix.qrCode, "pix")}>{copiado ? "Código copiado ✓" : "Copiar código Pix"}</button>
            <p>Abra o app do banco e pague <b>{money(numeros.length)}</b>. {um ? <>O <b>{pad(numeros[0])}</b> continua guardado</> : <>Seus <b>{numeros.length}</b> números continuam guardados</>} até o Pix expirar.</p>
            {segundosRestantes !== null && <b className="pix-time">O Pix expira em {tempo(segundosRestantes)}</b>}
          </>
        )}

        {etapa === "pronto" && (
          <>
            <h3>{um ? <>Tirou! O <strong>{pad(numeros[0])}</strong> é seu 🎄</> : <>Tirou! Os <strong>{numeros.length}</strong> números são seus 🎄</>}</h3>
            <div className="final-tickets">{numeros.map((n) => <div className="final-ticket" key={n}><span>Ação de Natal · Gatil</span><strong>{pad(n)}</strong><small>Revelação 25/12</small></div>)}</div>
            <p>A confirmação foi enviada para o seu e-mail.</p>
            <button className={`button cart-button ${compartilhado ? "success" : ""}`} onClick={() => copiar(`Tirei 300 gatos no amigo secreto 🎄 Entrei na ação solidária de Natal do Gatil Irmã Francisca: cada número de R$ 100 ajuda a cuidar dos gatos, e o sorteio é dia 25/12. ${location.origin}/rifa`, "share")}>
              {compartilhado ? "Mensagem copiada ✓" : "Chamar mais gente"}
            </button>
          </>
        )}

        <div className="acerola-tip">
          <img src={`${A}/acerola.png`} alt="" />
          <div><small>Acerola, gata do Gatil</small><p>Dá uma olhada nas últimas abas. Os números grandes também dão sorte, viu?</p></div>
        </div>
      </div>
    </aside>
  )
}
