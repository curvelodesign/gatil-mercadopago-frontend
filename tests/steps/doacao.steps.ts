import { createBdd } from "playwright-bdd";
import { expect } from "@playwright/test";

const { Given, When, Then } = createBdd();

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
    await page
      .getByRole("button", { name: new RegExp(`R\\$\\s*${valor},00`) })
      .click();
  }
);

When(
  "eu digito {string} no campo de valor da doação",
  async ({ page }, valor: string) => {
    await page.getByLabel("Valor da doação (R$)").fill(valor);
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