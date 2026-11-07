import { readFileSync } from "node:fs";
import { createBdd } from "playwright-bdd";
import { expect, type Page } from "@playwright/test";

const { Given, When, Then } = createBdd();

// Mesmos valores de rifa.steps.ts: o passo "o status do Pix da rifa fica..." confere esses ids
const PAYMENT_ID_TESTE = 123456789;
const RASTREIO_TESTE = "rastreio-rifa-teste";
const RESERVA_ID = "aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee";
const QR_TESTE = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
const CONTATO = { nome: "Ana Teste", email: "ana@email.com", phone: "71999998888" };
const MIN = 60_000;

const pad = (n: number) => String(n).padStart(3, "0");
const lista = (texto: string) => texto.split(/, | e /).map(Number);

const pedidos = new WeakMap<Page, Record<string, Record<string, unknown>[]>>();
function registrar(page: Page, chave: string, corpo: Record<string, unknown>) {
  const mapa = pedidos.get(page) ?? {};
  (mapa[chave] ??= []).push(corpo);
  pedidos.set(page, mapa);
}
const chamadas = (page: Page, chave: string) => pedidos.get(page)?.[chave] ?? [];

/** Hora do navegador (com page.clock instalado, é a do relógio falso). */
const agoraNoNavegador = (page: Page) => page.evaluate(() => Date.now());

function resumoCompra(status: string, numeros: number[], extra: Record<string, unknown> = {}) {
  return {
    reservaId: RESERVA_ID,
    status,
    numeros,
    numerosConfirmados: status.startsWith("PAGO") ? numeros : [],
    numerosAEscolher: 0,
    linksEscolha: [],
    valor: numeros.length * 100,
    expiraEm: new Date(Date.now() + 20 * MIN).toISOString(),
    teste: false,
    pagamento: null,
    ...extra,
  };
}

// ---------- mocks de rede ----------

Given("que a reserva dos números é aceita", async ({ page }) => {
  await page.route("**/api/rifa/reservar", async (route) => {
    const corpo = route.request().postDataJSON();
    registrar(page, "reservar", corpo);
    const agora = await agoraNoNavegador(page).catch(() => Date.now());
    return route.fulfill({
      status: 201,
      json: {
        message: "Números reservados.",
        data: { reservaId: RESERVA_ID, numeros: [...corpo.numeros].sort((a: number, b: number) => a - b), indisponiveis: [], expiraEm: new Date(agora + 15 * MIN).toISOString(), valor: corpo.numeros.length * 100, teste: false },
      },
    });
  });
});

Given("que a reserva devolve o {int} como indisponível", async ({ page }, indisponivel: number) => {
  await page.route("**/api/rifa/reservar", (route) => {
    const corpo = route.request().postDataJSON();
    const numeros = corpo.numeros.filter((n: number) => n !== indisponivel);
    return route.fulfill({
      status: 201,
      json: { message: "ok", data: { reservaId: RESERVA_ID, numeros, indisponiveis: [indisponivel], expiraEm: new Date(Date.now() + 15 * MIN).toISOString(), valor: numeros.length * 100 } },
    });
  });
});

Given("que a reserva responde {int} com o {int} indisponível", async ({ page }, status: number, numero: number) => {
  await page.route("**/api/rifa/reservar", (route) =>
    route.fulfill({ status, json: { message: "Esses números acabaram de ganhar dono.", indisponiveis: [numero] } })
  );
});

Given("que a reserva responde {int} com a mensagem {string}", async ({ page }, status: number, mensagem: string) => {
  await page.route("**/api/rifa/reservar", (route) => route.fulfill({ status, json: { message: mensagem } }));
});

Given("que o Pix da reserva é criado", async ({ page }) => {
  await page.route("**/api/rifa/criar-pix", async (route) => {
    const corpo = route.request().postDataJSON();
    registrar(page, "pix", corpo);
    const agora = await agoraNoNavegador(page).catch(() => Date.now());
    return route.fulfill({
      status: 201,
      json: {
        message: "Pix criado com sucesso.",
        data: { reservaId: RESERVA_ID, paymentId: PAYMENT_ID_TESTE, rastreioId: RASTREIO_TESTE, qrCode: "00020126-pix-reserva", qrCodeBase64: QR_TESTE, expiraEm: new Date(agora + 30 * MIN).toISOString(), valor: 100, numeros: [] },
      },
    });
  });
});

Given("que o cartão da reserva devolve um link", async ({ page }) => {
  await page.route("**/api/rifa/criar-pagamento", (route) => {
    registrar(page, "cartao", route.request().postDataJSON());
    const initPoint = "https://www.mercadopago.com.br/checkout/fake";
    return route.fulfill({ status: 201, json: { message: "ok", initPoint, data: { initPoint, expiraEm: new Date(Date.now() + 30 * MIN).toISOString() } } });
  });
  await page.route("**/checkout/fake**", (route) =>
    route.fulfill({ contentType: "text/html", body: "<html><body>Checkout fake</body></html>" })
  );
});

Given("que liberar a reserva é aceito", async ({ page }) => {
  await page.route("**/api/rifa/liberar-reserva", (route) => {
    registrar(page, "liberar", route.request().postDataJSON());
    return route.fulfill({ json: { message: "ok", data: { reservaId: RESERVA_ID, status: "CANCELADO" } } });
  });
});

Given(
  /^que a reserva consultada está "([A-Z_]+)" com os números (.+)$/,
  async ({ page }, status: string, numeros: string) => {
    await page.route("**/api/rifa/reserva/**", (route) =>
      route.fulfill({ json: { message: "ok", data: resumoCompra(status, lista(numeros)) } })
    );
  }
);

Given("que a reserva consultada está aguardando o Pix", async ({ page }) => {
  await page.route("**/api/rifa/reserva/**", (route) =>
    route.fulfill({
      json: {
        message: "ok",
        data: resumoCompra("AGUARDANDO_PAGAMENTO", [10], {
          pagamento: { metodo: "pix", expiraEm: new Date(Date.now() + 29 * MIN).toISOString(), paymentId: String(PAYMENT_ID_TESTE), rastreioId: RASTREIO_TESTE, qrCode: "00020126-pix-reserva", qrCodeBase64: QR_TESTE, initPoint: null },
        }),
      },
    })
  );
});

function rotaCompra(page: Page, dados: Record<string, unknown>) {
  return page.route("**/api/rifa/compra?**", (route) => {
    registrar(page, "compra", Object.fromEntries(new URL(route.request().url()).searchParams));
    return route.fulfill({ json: { message: "ok", data: dados } });
  });
}

Given(/^que a compra consultada está "([A-Z_]+)" com os números (\d+) e (\d+)$/, async ({ page }, status: string, a: string, b: string) => {
  await rotaCompra(page, { ...resumoCompra(status, [Number(a), Number(b)]), statusPagamento: "APROVADO" });
});

Given(
  /^que a compra consultada está "PAGO_PARCIAL" com os números (\d+) e (\d+) a escolher$/,
  async ({ page }, numero: string, aEscolher: string) => {
    await rotaCompra(page, {
      ...resumoCompra("PAGO_PARCIAL", [Number(numero)]),
      numerosAEscolher: Number(aEscolher),
      linksEscolha: [`/rifa/pagamento-aprovado?payment_id=PEDIDO-${RESERVA_ID}-073`],
      statusPagamento: "APROVADO",
    });
  }
);

Given("que a compra consultada está {string} com o pagamento {string}", async ({ page }, status: string, pagamento: string) => {
  await rotaCompra(page, { ...resumoCompra(status, [72, 73]), statusPagamento: pagamento });
});

Given(
  "que {string} responde que o pagamento é da compra {string}",
  async ({ page }, endpoint: string, pedidoId: string) => {
    await page.route(`**${endpoint}**`, (route) =>
      route.fulfill({ status: 409, json: { message: "Esta compra já tem os números escolhidos.", pedidoId, numeros: [72, 73] } })
    );
  }
);

Given("que o relógio do navegador está controlado", async ({ page }) => {
  await page.clock.install();
});

// ---------- ações ----------

/** Toca nos números do quadro (trocando de aba quando o número está em outra centena). */
async function tocarNumeros(page: Page, numeros: number[]) {
  for (const n of numeros) {
    const inicio = Math.floor((n - 1) / 100) * 100 + 1;
    await page.getByRole("tab", { name: new RegExp(`^${pad(inicio)}–`) }).click();
    await page.locator(".number-grid").getByRole("button", { name: pad(n), exact: true }).click();
  }
}

When(/^eu escolho os números (.+) no quadro$/, async ({ page }, numeros: string) => {
  await expect(page.locator(".number-grid")).toHaveAttribute("aria-busy", "false");
  await tocarNumeros(page, lista(numeros));
});

async function preencherContato(page: Page, { phone = CONTATO.phone, aceitar = true } = {}) {
  await page.getByLabel("Nome completo").fill(CONTATO.nome);
  await page.getByLabel("E-mail para a confirmação").fill(CONTATO.email);
  await page.getByLabel("WhatsApp (com DDD)").fill(phone);
  if (aceitar) await page.getByRole("checkbox", { name: /Li e aceito/ }).check();
}

When("preencho meus dados de contato e aceito os termos", async ({ page }) => {
  await preencherContato(page);
});

When("preencho meus dados de contato sem aceitar os termos", async ({ page }) => {
  await preencherContato(page, { aceitar: false });
});

When("preencho meus dados de contato com o WhatsApp {string}", async ({ page }, phone: string) => {
  await preencherContato(page, { phone });
});

When("passam {int} minutos", async ({ page }, minutos: number) => {
  await page.clock.fastForward(minutos * MIN);
});

When("eu recarrego a página", async ({ page }) => {
  await page.reload();
});

// ---------- asserts ----------

Then(/^a reserva deve ter sido pedida com os números (.+)$/, async ({ page }, numeros: string) => {
  await expect.poll(() => chamadas(page, "reservar").length).toBe(1);
  const [corpo] = chamadas(page, "reservar");
  expect([...(corpo.numeros as number[])].sort((a, b) => a - b)).toEqual(lista(numeros));
  // UTM que o backend aceita vai junto; o valor nunca sai do navegador
  expect(corpo.utmSource).toBe("instagram");
  expect(corpo).not.toHaveProperty("valor");
});

Then("devo ver que os números ficam guardados", async ({ page }) => {
  await expect(page.getByText(/Guardados?\s+por\s+mais/)).toBeVisible();
});

Then("devo ver o QR code do Pix da reserva", async ({ page }) => {
  await expect(page.getByRole("img", { name: "QR code do Pix" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Copiar código Pix/ })).toBeVisible();
  await expect(page.getByText(/O\s+Pix\s+expira\s+em/)).toBeVisible();
});

function conferirContato(corpo: Record<string, unknown>) {
  expect(corpo.reservaId).toBe(RESERVA_ID);
  expect(corpo.nome).toBe(CONTATO.nome);
  expect(corpo.email).toBe(CONTATO.email);
  expect(String(corpo.phone).replace(/\D/g, "")).toBe(CONTATO.phone);
  expect(corpo.aceiteTermos).toBe(true);
  expect(corpo).not.toHaveProperty("valor");
}

Then("o Pix da reserva deve ter sido pedido com os meus dados e sem valor", async ({ page }) => {
  expect(chamadas(page, "pix")).toHaveLength(1);
  conferirContato(chamadas(page, "pix")[0]);
});

Then("o cartão da reserva deve ter sido pedido com os meus dados e sem valor", async ({ page }) => {
  expect(chamadas(page, "cartao")).toHaveLength(1);
  conferirContato(chamadas(page, "cartao")[0]);
});

Then("nenhum Pix da reserva deve ter sido pedido", async ({ page }) => {
  expect(chamadas(page, "pix")).toHaveLength(0);
});

Then(/^devo ver os bilhetes (.+) quando o Pix for aprovado$/, async ({ page }, bilhetes: string) => {
  const numeros = [...bilhetes.matchAll(/"(\d+)"/g)].map((m) => m[1]);
  // 1ª consulta: pendente; a seguinte (~4s depois): aprovado
  const finais = page.locator(".final-ticket strong");
  await expect(finais).toHaveText(numeros, { timeout: 15_000 });
  await expect(page.getByText("A confirmação foi enviada para o seu e-mail.")).toBeVisible();
});

Then("a reserva deve ter sido liberada", async ({ page }) => {
  await expect.poll(() => chamadas(page, "liberar").length).toBe(1);
  expect(chamadas(page, "liberar")[0].reservaId).toBe(RESERVA_ID);
});

Then("a compra deve ter sido consultada com o pagamento {string}", async ({ page }, paymentId: string) => {
  const [consulta] = chamadas(page, "compra");
  expect(consulta.payment_id).toBe(paymentId);
  expect(consulta.ref).toBe("11111111-2222-4333-8444-555555555555");
});

Then("o deploy deve mandar os headers de segurança", async () => {
  const vercel = JSON.parse(readFileSync("vercel.json", "utf8"));
  const headers: Record<string, string> = Object.fromEntries(
    vercel.headers.find((h: { source: string }) => h.source === "/(.*)").headers.map((h: { key: string; value: string }) => [h.key, h.value])
  );
  const csp = headers["Content-Security-Policy"];
  expect(csp).toContain("default-src 'self'");
  expect(csp).toContain("frame-ancestors 'none'");
  expect(csp).toContain("object-src 'none'");
  expect(csp).toContain("https://challenges.cloudflare.com");
  expect(csp).not.toContain("'unsafe-eval'");
  expect(csp).not.toMatch(/script-src[^;]*'unsafe-inline'/);
  expect(headers["Strict-Transport-Security"]).toMatch(/max-age=\d{8,}/);
  expect(headers["X-Content-Type-Options"]).toBe("nosniff");
  expect(headers["X-Frame-Options"]).toBe("DENY");
  // O payment_id da URL não vaza para outros sites pelo Referer
  expect(headers["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
});
