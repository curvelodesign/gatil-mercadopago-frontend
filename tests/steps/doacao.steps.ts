import { createBdd } from "playwright-bdd";
import { expect, type Page } from "@playwright/test";

const { Given, When, Then, Before } = createBdd();

// O aviso de cookies aparece na primeira visita e ficaria por cima dos botões:
// cada cenário começa com uma escolha já registrada (nenhum rastreamento).
Before(async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem("gatil_cookie_consent", JSON.stringify({ stats: false, marketing: false, timestamp: Date.now() }))
  );
});

// Na landing, o valor é escolhido numa janela que abre pelo botão "Quero doar".
async function abrirJanelaDeDoacao(page: Page) {
  const janela = page.getByRole("dialog", { name: "Qual valor deseja doar?" });
  if (!(await janela.isVisible())) {
    await page.getByRole("button", { name: "Quero doar 💛" }).first().click();
  }
  await expect(janela).toBeVisible();
}

// ---------- mocks de rede ----------

Given(
  "que {string} devolve um link de pagamento válido",
  async ({ page }, endpoint: string) => {
    
    await page.route(`**${endpoint}**`, (route) => {
      const body = route.request().postDataJSON();
      (page as unknown as { _ultimaRequisicaoDoacao?: unknown })._ultimaRequisicaoDoacao = body;

      return route.fulfill({
        json: {
          message: "Preferência de doação criada com sucesso.",
          data: {
            initPoint: "https://www.mercadopago.com.br/checkout/fake",
          },
        },
      });
    });

    
    await page.route("**/checkout/fake**", (route) =>
      route.fulfill({
        contentType: "text/html",
        body: "<html><body>Checkout fake</body></html>",
      })
    );
  }
);

Given("que {string} devolve erro 500", async ({ page }, endpoint: string) => {
  await page.route(`**${endpoint}**`, (route) =>
    route.fulfill({ status: 500, json: { message: "Erro interno." } })
  );
});

// ---------- interações do formulário de doação ----------

When(
  "eu seleciono o valor pré-definido de R$ {int}",
  async ({ page }, valor: number) => {
    await abrirJanelaDeDoacao(page);
    await page
      .getByRole("button", { name: new RegExp(`^R\\$\\s*${valor}(,00)?$`) })
      .click();
  }
);

When(
  "eu digito {string} no campo de valor da doação",
  async ({ page }, valor: string) => {
    await abrirJanelaDeDoacao(page);
    await page.getByLabel("Outro valor").fill(valor);
  }
);

// ---------- asserts ----------

function botaoPreset(page: Page, valor: number) {
  return page.getByRole("button", { name: new RegExp(`^R\\$\\s*${valor}(,00)?$`) });
}

Then("o campo de valor da doação deve mostrar {string}", async ({ page }, valor: string) => {
  await expect(page.getByLabel("Outro valor")).toHaveValue(valor);
});

Then("o valor pré-definido de R$ {int} deve estar selecionado", async ({ page }, valor: number) => {
  await expect(botaoPreset(page, valor)).toHaveClass(/\bativo\b/);
});

Then("o valor pré-definido de R$ {int} não deve estar selecionado", async ({ page }, valor: number) => {
  await expect(botaoPreset(page, valor)).not.toHaveClass(/\bativo\b/);
});

Then(
  "devo ser redirecionado para o link de pagamento do Mercado Pago",
  async ({ page }) => {
    await expect(page).toHaveURL(/mercadopago\.com\.br\/checkout\/fake/);
  }
);

Then(
  "a origem enviada ao backend deve ser {string} e {string}",
  async ({ page }, utmSource: string, utmMedium: string) => {
    const body = (page as unknown as { _ultimaRequisicaoDoacao?: Record<string, unknown> })
      ._ultimaRequisicaoDoacao;

    expect(body?.utmSource).toBe(utmSource);
    expect(body?.utmMedium).toBe(utmMedium);
  }
);

// Os caminhos antigos /doacao-* não podem redirecionar pra lugar nenhum:
// a URL tem que continuar exatamente a mesma.
Then("devo continuar em {string}", async ({ page }, caminho: string) => {
  const url = new URL(page.url());
  expect(`${url.pathname}${url.search}`).toBe(caminho);
});

Then(
  "o botão {string} deve estar desabilitado",
  async ({ page }, texto: string) => {
    await expect(page.getByRole("button", { name: texto })).toBeDisabled();
  }
);

// Barra da meta: o total do mês vem de /api/doacao/arrecadado-mes
Given(
  "que o total arrecadado do mês é R$ {int}",
  async ({ page }, total: number) => {
    await page.route("**/api/doacao/arrecadado-mes", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ message: "ok", data: { total } }),
      })
    );
  }
);

Given("que o total arrecadado do mês não está disponível", async ({ page }) => {
  await page.route("**/api/doacao/arrecadado-mes", (route) =>
    route.fulfill({ status: 500, body: "{}" })
  );
});

Then(
  "a barra da meta deve mostrar {int}% preenchido",
  async ({ page }, porcentagem: number) => {
    await expect(
      page.getByRole("progressbar", { name: "Progresso da meta" })
    ).toHaveAttribute("value", String(porcentagem));
  }
);

Then("a barra da meta não deve aparecer", async ({ page }) => {
  await expect(
    page.getByRole("progressbar", { name: "Progresso da meta" })
  ).toHaveCount(0);
});

// Volta do Mercado Pago pelo "voltar" (Pix): a landing pergunta se o Pix foi feito
Given("que comecei uma doação e voltei do Mercado Pago", async ({ page }) => {
  await page.addInitScript(() => {
    if (location.pathname === "/doar") sessionStorage.setItem("gatil_doacao_iniciada", String(Date.now()));
  });
});

When("confirmo que já fiz o Pix", async ({ page }) => {
  await page.getByRole("dialog", { name: "Você concluiu sua doação?" }).getByRole("button", { name: /já fiz o Pix/ }).click();
});

Then("devo ver a página de agradecimento", async ({ page }) => {
  await expect(page).toHaveURL(/\/doar\/pagamento-aprovado$/);
  await expect(page.getByRole("heading", { name: /Muito obrigado/ })).toBeVisible();
});

// Nas páginas de retorno, as ações que levam a outra página são links
Then("devo ver um link {string}", async ({ page }, texto: string) => {
  await expect(page.getByRole("link", { name: texto })).toBeVisible();
});

// Rodapé: ao abrir outra página, ela começa do topo (e não no rodapé)
When("rolo até o rodapé e clico em {string}", async ({ page }, texto: string) => {
  const link = page.locator("footer").getByRole("link", { name: texto });
  await link.scrollIntoViewIfNeeded();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(500);
  await link.click();
});

Then("a página deve começar do topo", async ({ page }) => {
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
});

// ---------- Pix dentro do site ----------

// PNG 1x1: o QR code de verdade vem do Mercado Pago
const QR_TESTE =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
const CODIGO_PIX_TESTE = "00020126580014br.gov.bcb.pix0136TESTE-gatil-irma-francisca";
const pedidosPix = new WeakMap<Page, Record<string, unknown>>();

Given("que o Pix dentro do site está ligado", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("gatil_pix_no_site", "1"));
});

Given("que {string} devolve um Pix válido", async ({ page }, endpoint: string) => {
  await page.route(`**${endpoint}**`, (route) => {
    pedidosPix.set(page, route.request().postDataJSON());
    return route.fulfill({
      json: {
        message: "Pix criado.",
        data: {
          paymentId: 123456789,
          rastreioId: "rastreio-teste",
          qrCode: CODIGO_PIX_TESTE,
          qrCodeBase64: QR_TESTE,
          expiraEm: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        },
      },
    });
  });
});

Given("que o status do Pix fica {string}", async ({ page }, status: string) => {
  await page.route("**/api/doacao/status/**", (route) =>
    route.fulfill({ json: { message: "ok", data: { status } } })
  );
});

Given(
  "que o status do Pix fica {string} e depois {string}",
  async ({ page }, primeiro: string, depois: string) => {
    let consultas = 0;
    await page.route("**/api/doacao/status/**", (route) => {
      consultas += 1;
      const url = new URL(route.request().url());
      // O front manda o rastreioId junto, pra não dar pra consultar Pix de outra pessoa
      expect(url.pathname).toMatch(/\/doacao\/status\/123456789$/);
      expect(url.searchParams.get("ref")).toBe("rastreio-teste");
      return route.fulfill({ json: { message: "ok", data: { status: consultas === 1 ? primeiro : depois } } });
    });
  }
);

When("digito o e-mail {string}", async ({ page }, email: string) => {
  await page.getByLabel("Seu e-mail").fill(email);
});

When("informo o e-mail {string} e gero o Pix", async ({ page }, email: string) => {
  await page.getByLabel("Seu e-mail").fill(email);
  await page.getByRole("button", { name: /Gerar Pix de/ }).click();
});

When("escolho pagar com cartão", async ({ page }) => {
  await page.getByRole("radio", { name: /Cartão/ }).click();
});

Then("não devo ver a escolha da forma de pagamento", async ({ page }) => {
  await expect(page.getByRole("radiogroup")).toHaveCount(0);
});

Then("devo ver o botão {string}", async ({ page }, texto: string) => {
  await expect(page.getByRole("button", { name: texto })).toBeVisible();
});

Then("o botão de gerar o Pix deve estar desabilitado", async ({ page }) => {
  await expect(page.getByRole("button", { name: /Gerar Pix de/ })).toBeDisabled();
});

Then("devo ver o QR code e o código copia e cola do Pix", async ({ page }) => {
  await expect(page.getByRole("img", { name: "QR code do Pix" })).toBeVisible();
  await expect(page.getByText(CODIGO_PIX_TESTE)).toBeVisible();
  await expect(page.getByRole("button", { name: "Copiar código" })).toBeVisible();
});

Then(
  "o Pix deve ter sido pedido com o valor {int}, o e-mail {string} e a origem {string}",
  async ({ page }, valor: number, email: string, origem: string) => {
    const pedido = pedidosPix.get(page);
    expect(pedido?.valor).toBe(valor);
    expect(pedido?.email).toBe(email);
    expect(pedido?.utmSource).toBe(origem);
  }
);

Then("devo ser levado para o agradecimento quando o Pix for aprovado", async ({ page }) => {
  // 1ª consulta: pendente; a seguinte (~4s depois): aprovado; e ~2s mostrando "chegou!"
  await expect(page.getByRole("heading", { name: /chegou!/ })).toBeVisible({ timeout: 10_000 });
  await expect(page).toHaveURL(/\/doar\/pagamento-aprovado$/, { timeout: 10_000 });
  await expect(page.getByRole("heading", { name: /Muito obrigado/ })).toBeVisible();
});

Then("não devo ver a pergunta se concluí a doação", async ({ page }) => {
  await expect(page.getByRole("heading", { name: /Quero doar|Dez anos/ }).first()).toBeVisible();
  await expect(page.getByRole("dialog", { name: "Você concluiu sua doação?" })).toHaveCount(0);
});
