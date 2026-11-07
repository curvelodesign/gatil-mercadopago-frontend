import { useCallback, useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { consultarCompra, guardarReserva, reservaGuardada, type ResumoCompra } from "@/features/acao-natal/api"
import { padNumber } from "@/lib/utils/format"

type Retorno = "aprovada" | "pendente" | "recusada"

const hora = (iso: string) => new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })

/**
 * Volta do cartão (back_urls do Checkout Pro de uma compra com reserva). Os
 * números já foram escolhidos antes de pagar: aqui a pessoa vê o resultado.
 * O Mercado Pago devolve payment_id e external_reference (= o pedido); sem
 * eles, usa a reserva guardada nesta aba.
 */
export function CompraRetornoPage({ retorno }: { retorno: Retorno }) {
  const [params] = useSearchParams()
  const paymentId = params.get("payment_id") || params.get("collection_id")
  const ref = params.get("external_reference") || reservaGuardada()
  const [compra, setCompra] = useState<ResumoCompra | null>(null)
  const [carregando, setCarregando] = useState(Boolean(ref))
  const [erro, setErro] = useState<string | null>(null)

  const consultar = useCallback(async () => {
    if (!ref) return
    setCarregando(true)
    setErro(null)
    try {
      const resumo = await consultarCompra(paymentId && paymentId !== "null" ? paymentId : null, ref)
      setCompra(resumo)
      if (resumo.status === "PAGO" || resumo.status === "PAGO_PARCIAL") guardarReserva(null)
    } catch {
      setErro("Não conseguimos consultar sua compra agora. Tenta de novo em instantes.")
    } finally {
      setCarregando(false)
    }
  }, [paymentId, ref])

  useEffect(() => { void consultar() }, [consultar])
  useEffect(() => { document.title = "Sua compra · Ação Solidária de Natal" }, [])

  const pago = compra && (compra.status === "PAGO" || compra.status === "PAGO_PARCIAL")
  const aguardando = compra && (compra.status === "AGUARDANDO_PAGAMENTO" || compra.status === "RESERVADO")
  const emAnalise = aguardando && (compra.statusPagamento === "PENDENTE" || retorno === "pendente")
  const recusado = !pago && (retorno === "recusada" || compra?.statusPagamento === "CANCELADO")

  let icone = "⏳"
  let titulo = "Conferindo sua compra…"
  let corpo: React.ReactNode = <p className="text-sm text-carvao/70">Só um instante.</p>

  if (!ref) {
    icone = "🐾"
    titulo = "Não encontramos sua compra"
    corpo = <p className="text-sm text-carvao/80">Volte pelo link do e-mail de confirmação ou fale com a gente pelo Instagram do Gatil.</p>
  } else if (carregando && !compra) {
    // padrão acima
  } else if (erro && !compra) {
    icone = "⚠️"
    titulo = "Ops, não deu pra conferir"
    corpo = <p className="text-sm text-carvao/80">{erro}</p>
  } else if (pago) {
    icone = "🎄"
    titulo = compra.numerosConfirmados.length === 1 ? "Tirou! O número é seu" : "Tirou! Os números são seus"
    corpo = (
      <>
        {compra.numerosConfirmados.length > 0 && (
          <p className="mb-3 font-display text-4xl font-bold text-laranja" aria-label="Seus números">
            {compra.numerosConfirmados.map((n) => padNumber(n)).join(" · ")}
          </p>
        )}
        {compra.numerosAEscolher > 0 && (
          <div className="mb-3 rounded-2xl bg-laranja/10 p-3 text-left text-sm" role="status">
            <p className="mb-2">
              {compra.numerosAEscolher === 1 ? "Um número que você reservou foi tirado" : `${compra.numerosAEscolher} números que você reservou foram tirados`} por outra pessoa antes do pagamento ser confirmado. Escolha {compra.numerosAEscolher === 1 ? "outro" : "outros"}:
            </p>
            {compra.linksEscolha.map((link, i) => (
              <p key={link}><Link className="font-bold text-verde underline" to={link}>Escolher o {i + 1}º número</Link></p>
            ))}
          </div>
        )}
        <p className="text-sm text-carvao/80">A confirmação foi enviada para o seu e-mail. A revelação é ao vivo no Instagram do Gatil, em 25/12.</p>
      </>
    )
  } else if (emAnalise) {
    titulo = "Pagamento em análise"
    corpo = (
      <>
        <p className="mb-3 text-sm text-carvao/80">
          O Mercado Pago ainda está analisando o seu cartão. {compra.status !== "EXPIRADO" && <>Seus números continuam guardados até as <b>{hora(compra.expiraEm)}</b>.</>}
        </p>
        <p className="text-sm text-carvao/80">Assim que for aprovado, você recebe a confirmação por e-mail. Se a aprovação sair depois desse horário e algum número já tiver outro dono, o e-mail traz um link para escolher outro.</p>
      </>
    )
  } else if (recusado || compra?.status === "EXPIRADO" || compra?.status === "CANCELADO") {
    icone = "💳"
    titulo = recusado ? "O pagamento não foi aprovado" : "Sua reserva venceu"
    corpo = (
      <p className="text-sm text-carvao/80">
        {recusado ? "Nenhum valor foi cobrado." : "Os números voltaram pro quadro."}{" "}
        {aguardando ? <>Seus números continuam guardados até as <b>{hora(compra!.expiraEm)}</b>: dá pra tentar de novo, no Pix ou com outro cartão.</> : "Se ninguém pegou, dá pra escolher de novo."}
      </p>
    )
  } else if (aguardando) {
    titulo = "Ainda não recebemos o pagamento"
    corpo = <p className="text-sm text-carvao/80">Se você já pagou, aguarde um minutinho e confira de novo. Seus números ficam guardados até as <b>{hora(compra.expiraEm)}</b>.</p>
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-laranja/15 text-3xl" aria-hidden="true">{icone}</div>
      <h1 className="mb-3 font-display text-3xl font-bold text-verde-escuro">{titulo}</h1>
      <Card className="w-full">
        {corpo}
        {ref && !pago && compra && (
          <Button onClick={() => void consultar()} disabled={carregando} className="mt-4 w-full">
            {carregando ? "Conferindo..." : "Conferir de novo"}
          </Button>
        )}
      </Card>
      <Link className="mt-6 text-sm font-bold text-verde underline" to="/rifa">
        {pago ? "Voltar pra Ação de Natal" : "Voltar e tentar de novo"}
      </Link>
    </div>
  )
}
