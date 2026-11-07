/**
 * Backend falso, em memória, para percorrer a jornada inteira sem backend:
 *
 *   npm run dev:mock        (usa .env.mock: VITE_API_MOCK=true + fluxo completo)
 *
 * Só é carregado em `vite dev` com VITE_API_MOCK=true (main.tsx) — nunca entra
 * no build de produção. Troca o window.fetch das rotas /api/* e /mercadopago/*
 * e segue o mesmo contrato do gatil-mercadopago-backend.
 *
 * Cenários pela URL da página (?mock=...):
 *   corrida        o primeiro número escolhido "acabou de ganhar dono"
 *   esgotado       a reserva recebe 409 em todos os números
 *   pix-expira     o Pix vence na hora
 *   cartao-analise o cartão volta "em análise"
 *   cartao-recusa  o cartão volta recusado
 *   pago-parcial   o pagamento aprova, mas um número se perdeu (escolher outro)
 * O Pix é aprovado ~8 s depois de gerado.
 */

const PNG_1X1 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
const MIN = 60_000
const APROVA_PIX_MS = 8_000

interface PedidoMock {
  reservaId: string
  status: "RESERVADO" | "AGUARDANDO_PAGAMENTO" | "PAGO" | "PAGO_PARCIAL" | "EXPIRADO" | "CANCELADO"
  numeros: number[]
  numerosConfirmados: number[]
  numerosAEscolher: number
  valor: number
  expiraEm: number
  pagamento: null | { metodo: "pix" | "cartao"; paymentId: string; rastreioId: string; expiraEm: number; criadoEm: number }
}

// O estado fica no sessionStorage: a volta do "cartão" recarrega a página.
const CHAVE_ESTADO = "gatil_mock_estado"
const salvo = (() => {
  try { return JSON.parse(sessionStorage.getItem(CHAVE_ESTADO) ?? "null") } catch { return null }
})()
const ocupados = new Set<number>(salvo?.ocupados ?? [3, 47, 201, 202, 250, 333, 404, 499])
const pedidos = new Map<string, PedidoMock>(salvo?.pedidos ?? [])
const pixParaPedido = new Map<string, string>(salvo?.pixParaPedido ?? [])
let proximoPagamento: number = salvo?.proximoPagamento ?? 900_000

function salvar() {
  try {
    sessionStorage.setItem(CHAVE_ESTADO, JSON.stringify({
      ocupados: [...ocupados], pedidos: [...pedidos], pixParaPedido: [...pixParaPedido], proximoPagamento,
    }))
  } catch { /* sem sessionStorage: o estado vive só nesta página */ }
}

const cenario = () => new URLSearchParams(window.location.search).get("mock") ?? sessionStorage.getItem("gatil_mock") ?? ""
const json = (status: number, corpo: unknown) =>
  new Response(JSON.stringify(corpo), { status, headers: { "Content-Type": "application/json" } })
const atraso = (ms = 350) => new Promise((r) => setTimeout(r, ms))
const iso = (t: number) => new Date(t).toISOString()

function resumo(p: PedidoMock) {
  const vencido = (p.status === "RESERVADO" || p.status === "AGUARDANDO_PAGAMENTO") && p.expiraEm <= Date.now()
  return {
    reservaId: p.reservaId,
    status: vencido ? "EXPIRADO" : p.status,
    numeros: p.numeros,
    numerosConfirmados: p.numerosConfirmados,
    numerosAEscolher: p.numerosAEscolher,
    linksEscolha: p.status === "PAGO_PARCIAL" ? [`/rifa/pagamento-aprovado?payment_id=PEDIDO-${p.reservaId}-001`] : [],
    valor: p.valor,
    expiraEm: iso(p.expiraEm),
    teste: false,
    pagamento: p.pagamento && !vencido && !p.status.startsWith("PAGO") ? {
      metodo: p.pagamento.metodo,
      expiraEm: iso(p.pagamento.expiraEm),
      paymentId: p.pagamento.paymentId,
      rastreioId: p.pagamento.rastreioId,
      qrCode: p.pagamento.metodo === "pix" ? "00020126580014br.gov.bcb.pix0136MOCK-gatil" : null,
      qrCodeBase64: p.pagamento.metodo === "pix" ? PNG_1X1 : null,
      initPoint: null,
    } : null,
  }
}

function pagar(p: PedidoMock) {
  if (p.status.startsWith("PAGO")) return
  if (cenario() === "pago-parcial" && p.numeros.length) {
    const [perdido, ...resto] = p.numeros
    ocupados.add(perdido)
    p.numerosConfirmados = resto
    p.numerosAEscolher = 1
    p.status = "PAGO_PARCIAL"
  } else {
    p.numerosConfirmados = [...p.numeros]
    p.status = "PAGO"
  }
  p.numeros.forEach((n) => ocupados.add(n))
}

function liberar(p: PedidoMock) {
  p.numeros.forEach((n) => ocupados.delete(n))
}

/** Expira reservas vencidas (o backend real usa TTL + tarefas). */
function varrer() {
  for (const p of pedidos.values()) {
    if ((p.status === "RESERVADO" || p.status === "AGUARDANDO_PAGAMENTO") && p.expiraEm <= Date.now()) {
      p.status = "EXPIRADO"
      liberar(p)
    }
  }
}

async function rotear(metodo: string, url: URL, corpo: any): Promise<Response | null> {
  const caminho = url.pathname.replace(/^\/api/, "")
  varrer()

  // ---------- quadro ----------
  if (metodo === "GET" && caminho === "/rifa/numeros-ocupados") {
    return json(200, { message: "ok", data: [...ocupados].sort((a, b) => a - b) })
  }

  // ---------- reserva ----------
  if (metodo === "POST" && caminho === "/rifa/reservar") {
    await atraso()
    const numeros: number[] = Array.isArray(corpo?.numeros) ? corpo.numeros : []
    if (!numeros.length || numeros.length > 10) return json(400, { message: "Escolha de 1 a 10 números." })
    const indisponiveis = numeros.filter((n) => ocupados.has(n))
    if (cenario() === "corrida" && numeros.length && !indisponiveis.length) indisponiveis.push(numeros[0])
    if (cenario() === "esgotado") indisponiveis.splice(0, indisponiveis.length, ...numeros)
    const livres = numeros.filter((n) => !indisponiveis.includes(n)).sort((a, b) => a - b)
    if (!livres.length) return json(409, { message: "Esses números acabaram de ganhar dono.", indisponiveis })
    const reservaId = crypto.randomUUID()
    const p: PedidoMock = {
      reservaId, status: "RESERVADO", numeros: livres, numerosConfirmados: [], numerosAEscolher: 0,
      valor: livres.length * 100, expiraEm: Date.now() + 15 * MIN, pagamento: null,
    }
    pedidos.set(reservaId, p)
    livres.forEach((n) => ocupados.add(n))
    return json(201, { message: "Números reservados.", data: { reservaId, numeros: livres, indisponiveis, expiraEm: iso(p.expiraEm), valor: p.valor, teste: false } })
  }

  const reservaMatch = caminho.match(/^\/rifa\/reserva\/(.+)$/)
  if (metodo === "GET" && reservaMatch) {
    const p = pedidos.get(decodeURIComponent(reservaMatch[1]))
    return p ? json(200, { message: "Reserva.", data: resumo(p) }) : json(404, { message: "Reserva não encontrada." })
  }

  if (metodo === "POST" && caminho === "/rifa/liberar-reserva") {
    const p = pedidos.get(corpo?.reservaId)
    if (p && !p.status.startsWith("PAGO")) { p.status = "CANCELADO"; liberar(p) }
    return json(200, { message: "Números liberados.", data: { reservaId: corpo?.reservaId, status: "CANCELADO" } })
  }

  // ---------- pagamento ----------
  if (metodo === "POST" && (caminho === "/rifa/criar-pix" || caminho === "/rifa/criar-pagamento") && corpo?.reservaId) {
    await atraso(500)
    const p = pedidos.get(corpo.reservaId)
    if (!p) return json(404, { message: "Reserva não encontrada." })
    if (p.status.startsWith("PAGO")) return json(409, { message: "Essa compra já foi paga.", status: p.status })
    if (p.expiraEm <= Date.now() || p.status === "EXPIRADO" || p.status === "CANCELADO") {
      return json(410, { message: "Sua reserva venceu." })
    }
    if (!corpo.aceiteTermos) return json(400, { message: "Para continuar, aceite o Regulamento e a Política de Privacidade." })
    const pix = caminho === "/rifa/criar-pix"
    const paymentId = String(++proximoPagamento)
    const expiraPagamento = cenario() === "pix-expira" && pix ? Date.now() + 3_000 : Date.now() + 30 * MIN
    p.pagamento = { metodo: pix ? "pix" : "cartao", paymentId, rastreioId: crypto.randomUUID(), expiraEm: expiraPagamento, criadoEm: Date.now() }
    p.status = "AGUARDANDO_PAGAMENTO"
    p.expiraEm = expiraPagamento + 2 * MIN
    if (pix) {
      pixParaPedido.set(paymentId, p.reservaId)
      return json(201, { message: "Pix criado com sucesso.", data: {
        reservaId: p.reservaId, paymentId, rastreioId: p.pagamento.rastreioId,
        qrCode: "00020126580014br.gov.bcb.pix0136MOCK-gatil", qrCodeBase64: PNG_1X1,
        expiraEm: iso(expiraPagamento), valor: p.valor, teste: false, numeros: p.numeros,
      } })
    }
    // "Mercado Pago" falso: volta direto para a página de retorno do cartão.
    const destino = cenario() === "cartao-recusa" ? "recusada" : cenario() === "cartao-analise" ? "pendente" : "aprovada"
    if (destino === "aprovada") pagar(p)
    const initPoint = `/rifa/compra/${destino}?payment_id=${paymentId}&external_reference=${p.reservaId}&status=${destino}`
    return json(201, { message: "Link do cartão criado.", initPoint, data: { reservaId: p.reservaId, initPoint, expiraEm: iso(expiraPagamento), valor: p.valor } })
  }

  const statusMatch = caminho.match(/^\/rifa\/status-pix\/(.+)$/)
  if (metodo === "GET" && statusMatch) {
    const p = pedidos.get(pixParaPedido.get(statusMatch[1]) ?? "")
    if (!p?.pagamento) return json(404, { message: "Pix não encontrado." })
    if (p.pagamento.expiraEm <= Date.now() && !p.status.startsWith("PAGO")) return json(200, { message: "ok", data: { status: "EXPIRADO" } })
    if (cenario() !== "pix-expira" && Date.now() - p.pagamento.criadoEm >= APROVA_PIX_MS) pagar(p)
    return json(200, { message: "ok", data: { status: p.status.startsWith("PAGO") ? "APROVADO" : "PENDENTE", ...(p.status.startsWith("PAGO") ? { compra: resumo(p) } : {}) } })
  }

  if (metodo === "GET" && caminho === "/rifa/compra") {
    await atraso()
    const p = pedidos.get(url.searchParams.get("ref") ?? "")
    if (!p) return json(404, { message: "Compra não encontrada." })
    const statusPagamento = p.status.startsWith("PAGO") ? "APROVADO" : cenario() === "cartao-recusa" ? "CANCELADO" : url.searchParams.get("payment_id") ? "PENDENTE" : null
    return json(200, { message: "Compra.", data: { ...resumo(p), statusPagamento } })
  }

  // ---------- fluxo antigo e escolha do número que faltou ----------
  if (metodo === "GET" && caminho === "/mercadopago/verificar-pagamento") {
    return json(200, { token: "token-mock" })
  }
  if (metodo === "POST" && caminho === "/rifa/confirmar-numero") {
    const n = Number(corpo?.claimedNumber)
    if (ocupados.has(n)) return json(409, { message: "Esse número acabou de ser escolhido por outra pessoa" })
    ocupados.add(n)
    return json(200, { message: "Número confirmado.", data: { id: "mock", claimedNumber: n } })
  }
  if (metodo === "POST" && caminho === "/rifa/reenviar-email") return json(200, { message: "E-mail reenviado." })

  // ---------- doação (só o necessário para as páginas abrirem) ----------
  if (metodo === "GET" && caminho === "/doacao/arrecadado-mes") return json(200, { message: "ok", data: { total: 12_345 } })

  return null
}

export function instalarMockApi() {
  const fetchReal = window.fetch.bind(window)
  window.fetch = async (entrada: RequestInfo | URL, init?: RequestInit) => {
    const url = new URL(entrada instanceof Request ? entrada.url : String(entrada), window.location.origin)
    if (url.origin === window.location.origin && /^\/(api|mercadopago)\//.test(url.pathname)) {
      const metodo = (init?.method ?? (entrada instanceof Request ? entrada.method : "GET")).toUpperCase()
      let corpo: unknown = null
      try { corpo = init?.body ? JSON.parse(String(init.body)) : null } catch { corpo = null }
      const resposta = await rotear(metodo, url, corpo)
      salvar()
      if (resposta) {
        console.info(`[mock] ${metodo} ${url.pathname}${url.search} → ${resposta.status}`)
        return resposta
      }
      console.warn(`[mock] rota sem mock: ${metodo} ${url.pathname}`)
      return json(501, { message: "Rota sem mock." })
    }
    return fetchReal(entrada, init)
  }
  // O cenário escolhido na URL continua valendo depois do redirect do "cartão".
  const atual = new URLSearchParams(window.location.search).get("mock")
  if (atual !== null) sessionStorage.setItem("gatil_mock", atual)
  console.info("%c[mock] Backend falso ligado (VITE_API_MOCK). Cenários: ?mock=corrida | esgotado | pix-expira | cartao-analise | cartao-recusa | pago-parcial", "color:#b0293b;font-weight:bold")
}
