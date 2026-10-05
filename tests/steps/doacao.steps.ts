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
