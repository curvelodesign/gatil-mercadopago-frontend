import { createBdd } from "playwright-bdd";
import { expect } from "@playwright/test";

const { Given, When, Then } = createBdd();

// ---------- mocks de rede ----------

Given("que {string} devolve um token válido", async ({ page }, endpoint: string) => {
  await page.route(`**${endpoint}**`, (route) =>
    route.fulfill({ json: { token: "token-de-teste" } })
  );
});

Given(
  "{string} agora devolve um token válido para {string}",
  async ({ page }, endpoint: string, paymentId: string) => {
    await page.route(`**${endpoint}**`, (route) => {
      const url = route.request().url();
      if (url.includes(paymentId)) {
        return route.fulfill({ json: { token: "token-de-teste" } });
      }
      return route.fulfill({ status: 402, json: { message: "Pagamento não aprovado." } });
    });
  }
);

Given(
  "{string} devolve [{int}, {int}, {int}]",
  async ({ page }, endpoint: string, a: number, b: number, c: number) => {
    await page.route(`**${endpoint}**`, (route) =>
      route.fulfill({ json: { message: "ok", data: [a, b, c] } })
    );
  }
);

Given("que {string} devolve {int}", async ({ page }, endpoint: string, status: number) => {
  await page.route(`**${endpoint}**`, (route) =>
    route.fulfill({ status, json: { message: "Pagamento não aprovado." } })
  );
});

When("o backend responde {int} ao tentar confirmar", async ({ page }, status: number) => {
  await page.route("**/api/rifa/confirmar-numero**", (route) =>
    route.fulfill({
      status,
      json: { message: "Esse número acabou de ser escolhido por outra pessoa" },
    })
  );

  // Esse cenário não tem um "clico em" separado no Gherkin — a
  // tentativa de confirmar É o evento que este passo descreve.
  const nome = page.getByLabel("Nome completo");
  if ((await nome.inputValue()) === "") {
    await nome.fill("Participante Teste");
    await page.getByLabel("WhatsApp").fill("71999990000");
    await page.getByLabel("E-mail").fill("teste@exemplo.com");
  }
  await page.getByRole("button", { name: "Confirmar minha participação" }).click();
});

// ---------- navegação ----------

When("eu acesso {string}", async ({ page }, caminho: string) => {
  await page.goto(caminho);
});

When("eu acesso {string} sem parâmetros", async ({ page }, caminho: string) => {
  await page.goto(caminho);
});

Given("que estou em {string}", async ({ page }, caminho: string) => {
  await page.goto(caminho);
});

Then("devo ser redirecionado para {string}", async ({ page }, caminhoEsperado: string) => {
  // Compara caminho + query exatos: "/rifa" não pode aceitar "/rifa/pagamento-aprovado"
  await expect
    .poll(() => {
      const url = new URL(page.url());
      return `${url.pathname}${url.search}`;
    })
    .toBe(caminhoEsperado);
});

// ---------- asserts de conteúdo ----------

Then("devo ver o título {string}", async ({ page }, titulo: string) => {
  await expect(page.getByRole("heading", { name: titulo })).toBeVisible();
});

Then(
  "os números {int}, {int} e {int} devem aparecer marcados como indisponíveis",
  async ({ page }, a: number, b: number, c: number) => {
    for (const numero of [a, b, c]) {
      const celula = page.getByRole("button", { name: new RegExp(`Número ${numero},`) });
      await expect(celula).toBeDisabled();
    }
  }
);

Then("o número {int} deve estar clicável", async ({ page }, numero: number) => {
  const celula = page.getByRole("button", { name: new RegExp(`Número ${numero},`) });
  await expect(celula).toBeEnabled();
});

Then("não devo ver o título {string}", async ({ page }, titulo: string) => {
  await expect(page.getByRole("heading", { name: titulo })).toHaveCount(0);
});

Then("não devo ver o botão {string}", async ({ page }, texto: string) => {
  await expect(page.getByRole("button", { name: texto })).toHaveCount(0);
});

Then("devo ver um botão {string}", async ({ page }, texto: string) => {
  await expect(page.getByRole("button", { name: texto })).toBeVisible();
});

Then("devo ver uma explicação sobre pagamento em processamento", async ({ page }) => {
  await expect(page.getByText(/PIX/i)).toBeVisible();
});

Then("devo ver uma explicação de que o pagamento não foi aprovado", async ({ page }) => {
  await expect(page.getByText(/não passou|não foi aprovado/i)).toBeVisible();
});

// ---------- fluxo de escolha de número ----------

Given("que estou na página de escolha com um token válido", async ({ page }) => {
  await page.route("**/mercadopago/verificar-pagamento**", (route) =>
    route.fulfill({ json: { token: "token-de-teste" } })
  );
  await page.route("**/api/rifa/numeros-ocupados**", (route) =>
    route.fulfill({ json: { message: "ok", data: [] } })
  );
  // Mock padrão de sucesso pra confirmação — ecoa de volta o número
  // que veio no corpo da requisição, então serve pra qualquer número
  // que o cenário selecionar. Cenários que precisam de outra resposta
  // (ex: 409) registram um page.route mais específico depois — no
  // Playwright, o último route.route() registrado pro mesmo padrão
  // tem prioridade sobre os anteriores.
  await page.route("**/api/rifa/confirmar-numero**", (route) => {
    const body = route.request().postDataJSON();
    route.fulfill({
      json: {
        message: "Número confirmado.",
        data: { id: "id-de-teste", claimedNumber: body?.claimedNumber },
      },
    });
  });

  await page.goto("/rifa/pagamento-aprovado?payment_id=999050&status=approved");
  await expect(page.getByRole("heading", { name: "Escolha seu número da sorte" })).toBeVisible();
});

When("eu seleciono o número {int}", async ({ page }, numero: number) => {
  await page.getByRole("button", { name: new RegExp(`Número ${numero},`) }).click();
});

Given("já selecionei o número {int}", async ({ page }, numero: number) => {
  await page.getByRole("button", { name: new RegExp(`Número ${numero},`) }).click();
});

When(
  "preencho nome {string}, WhatsApp {string} e e-mail {string}",
  async ({ page }, nome: string, whatsapp: string, email: string) => {
    await page.getByLabel("Nome completo").fill(nome);
    await page.getByLabel("WhatsApp").fill(whatsapp);
    await page.getByLabel("E-mail").fill(email);
  }
);

When("eu clico em {string}", async ({ page }, texto: string) => {
  // Cenários que só testam o 409 não preenchem o form explicitamente
  // no Gherkin, mas o botão só habilita com dados válidos.
  if (texto === "Confirmar minha participação") {
    const nome = page.getByLabel("Nome completo");
    if ((await nome.inputValue()) === "") {
      await nome.fill("Participante Teste");
      await page.getByLabel("WhatsApp").fill("71999990000");
      await page.getByLabel("E-mail").fill("teste@exemplo.com");
    }
  }
  // Ações que levam a outra página são links (ex.: "Tentar novamente" na doação)
  await page.getByRole("button", { name: texto }).or(page.getByRole("link", { name: texto })).first().click();
});

Then("devo ver a mensagem de sucesso com o número {int}", async ({ page }, numero: number) => {
  const numeroFormatado = String(numero).padStart(3, "0");
  const modal = page.getByRole("dialog");
  await expect(modal.getByText("Prontinho!")).toBeVisible();
  await expect(modal.getByText(numeroFormatado)).toBeVisible();
});

Then("devo ver a mensagem {string}", async ({ page }, mensagem: string) => {
  await expect(page.getByText(mensagem)).toBeVisible();
});

Then("os campos nome, WhatsApp e e-mail não devem ser apagados", async ({ page }) => {
  await expect(page.getByLabel("Nome completo")).not.toHaveValue("");
  await expect(page.getByLabel("WhatsApp")).not.toHaveValue("");
  await expect(page.getByLabel("E-mail")).not.toHaveValue("");
});