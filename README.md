# Gatil Irmã Francisca — Frontend da Rifa Solidária

Interface da Ação Solidária de 10 anos do Gatil Irmã Francisca: leva a pessoa do pagamento até a escolha do número, com a identidade visual da marca.

## Stack

- **React + TypeScript**, empacotado com **Vite**
- **React Router v7** (modo data router / SPA, sem SSR)
- **Tailwind CSS**, com os tokens de marca do Gatil (`verde`, `verde-escuro`, `laranja`, `creme`, `carvao`, `neutro`) e tipografia Quicksand (títulos) + Nunito (corpo)
- **Playwright + playwright-bdd** — testes E2E em Gherkin (pt)

## Estrutura de pastas

```
gatil-frontend/
├── .env
├── vite.config.ts              # proxy /api e /mercadopago pro backend, em dev
├── playwright.config.ts
├── src/
│   ├── app/
│   │   ├── router.tsx
│   │   └── RootLayout.tsx      # Header + Footer + <Outlet />
│   ├── hooks/
│   │   └── useOrderParams.ts   # lê ?payment_id= da URL
│   ├── types/
│   │   └── api.ts              # ApiRequestError (carrega o corpo completo do erro)
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts       # apiClient — prefixa VITE_API_URL (/api)
│   │   │   ├── raffle.ts       # fetchTakenNumbers, confirmNumber
│   │   │   └── mercadoPago.ts  # verificarPagamento — único endpoint fora de /api
│   │   └── utils/
│   │       ├── format.ts
│   │       └── validation.ts
│   ├── components/
│   │   ├── ui/                 # Button, Input, Pill, Card — design system puro
│   │   └── layout/              # Header, Footer
│   ├── features/raffle/
│   │   ├── constants.ts        # TOTAL_NUMBERS, TICKET_PRICE_BRL, PRIZE_VALUE_BRL, INSTAGRAM_URL...
│   │   ├── types.ts
│   │   ├── hooks/
│   │   │   ├── useAvailableNumbers.ts
│   │   │   └── useRaffleForm.ts
│   │   └── components/
│   │       ├── NumberGrid.tsx / NumberCell.tsx
│   │       ├── SelectedNumberPanel.tsx
│   │       ├── ParticipantForm.tsx
│   │       ├── SuccessBanner.tsx
│   │       ├── SuccessOverlay.tsx
│   │       └── PostConfirmationActions.tsx   # "Comprar outro número" / "Voltar ao Instagram"
│   └── pages/
│       ├── HomePage.tsx                # / — provisória até a landing page
│       ├── PagarPage.tsx               # /rifa — gera preferência e redireciona
│       ├── ChooseNumberPage.tsx        # /rifa/pagamento-aprovado — grade + formulário + "já escolhido"
│       ├── PagamentoPendentePage.tsx   # /rifa/pagamento-pendente — típico do PIX sem auto_return
│       ├── PagamentoRecusadoPage.tsx   # /rifa/pagamento-recusado
│       └── NotFoundPage.tsx
└── tests/
    ├── features/
    └── steps/
```

## Variáveis de ambiente

| Variável | Uso |
|---|---|
| `VITE_API_URL` | Sempre `/api` — nunca a URL completa do backend; quem resolve isso é o proxy do Vite |
| `VITE_ORDER_ID_PARAM` | Nome do parâmetro de query que o Mercado Pago devolve (`payment_id`) |
| `BACKEND_TUNNEL_URL` | **Só em dev** — lido pelo `vite.config.ts` (não pelo app), pra saber pra onde o proxy encaminha |
| `VITE_FLUXO_COMPLETO` | `true`: a Ação de Natal escolhe até 10 números, reserva por 15 min e paga o total. Vazio: paga primeiro e escolhe depois |
| `VITE_TURNSTILE_SITE_KEY` | Site key do Cloudflare Turnstile (anti-robô na reserva). A chave secreta fica só no backend |
| `VITE_API_MOCK` | Só em `npm run dev`: backend falso em memória (`src/mocks/mockApi.ts`). Nunca entra no build |

## Como rodar localmente

```bash
npm install
npm run dev
```

Pra testar o fluxo de pagamento de verdade em dev, o backend (e o próprio frontend, se for testar o redirect automático) precisa de uma URL pública — o Mercado Pago rejeita `back_urls` com `localhost`. O `vite.config.ts` já resolve isso via proxy: as chamadas do app pra `/api/*` e `/mercadopago/*` são encaminhadas pro backend (local ou por túnel), então o app em si continua rodando normal em `http://localhost:5173`.

## Modo mock — a jornada inteira sem backend

```bash
npm run dev:mock
```

Sobe o Vite com `.env.mock` (`VITE_API_MOCK=true`, fluxo com reserva e Pix no site). O `src/mocks/mockApi.ts` troca o `fetch` das rotas `/api/*` e `/mercadopago/*` por um backend falso em memória, com o mesmo contrato do `gatil-mercadopago-backend`: escolher números, reservar, gerar o Pix (aprovado ~8 s depois), pagar no cartão (volta direto para `/rifa/compra/aprovada`), retomar a reserva, escolher o número que faltou. Cenários pela URL: `?mock=corrida`, `esgotado`, `pix-expira`, `cartao-analise`, `cartao-recusa`, `pago-parcial`. Só é carregado com `import.meta.env.DEV`, então não existe no build de produção.

## Ação de Natal com reserva (`VITE_FLUXO_COMPLETO=true`)

1. A pessoa toca em até 10 números no quadro e em **Continuar**: `POST /api/rifa/reservar` (com o token do Turnstile) guarda os números por **15 minutos**. Se alguém tirou um número um segundo antes, ele sai da seleção e o total é atualizado.
2. Ela informa **nome, e-mail e WhatsApp**, aceita o Regulamento e a Política de Privacidade e escolhe **Pix** (QR code na tela) ou **cartão** (Mercado Pago). O Pix e o link do cartão valem **30 minutos**, o mesmo instante para os dois.
3. Aprovado o pagamento, os números aparecem como bilhetes e a confirmação vai por e-mail. Se a aprovação chegou depois da reserva vencer e algum número já tinha outro dono, aparece o link para escolher outro.
4. A reserva fica no `sessionStorage` da aba: recarregar a página ou voltar do cartão (`/rifa/compra/aprovada|pendente|recusada`) retoma de onde parou.

## Rotas

| Caminho | Página | Quando chega aqui |
|---|---|---|
| `/` | `HomePage` | Provisória até a landing page — leva pra `/rifa` e `/doar` |
| `/rifa` | `PagarPage` | Link usado no Instagram/vídeo — gera uma preferência nova e redireciona pro Mercado Pago (`/rifa/pagar` continua funcionando como alias) |
| `/doar` | `DoarPage` | Página de doação |
| `/doar/pagamento-aprovado` | `DoacaoConfirmadaPage` | `back_urls.success` da doação — agradecimento |
| `/doar/pagamento-pendente` | `DoacaoPendentePage` | `back_urls.pending` da doação — típico do PIX |
| `/doar/pagamento-recusado` | `DoacaoRecusadaPage` | `back_urls.failure` da doação — "Tentar novamente" volta pra `/doar` |
| `/rifa/pagamento-aprovado?payment_id=` | `ChooseNumberPage` | `back_urls.success` — verifica o pagamento, mostra a grade e o formulário |
| `/rifa/pagamento-pendente?payment_id=` | `PagamentoPendentePage` | `back_urls.pending` — típico do PIX, que não redireciona sozinho |
| `/rifa/pagamento-recusado` | `PagamentoRecusadoPage` | `back_urls.failure`, ou qualquer falha real na verificação |
| `/rifa/compra/aprovada?payment_id=&external_reference=` | `CompraRetornoPage` | Volta do cartão de uma compra com reserva: mostra os números (ou o link para escolher o que faltou) |
| `/rifa/compra/pendente` | `CompraRetornoPage` | Cartão em análise: até quando os números ficam guardados |
| `/rifa/compra/recusada` | `CompraRetornoPage` | Cartão recusado: os números continuam guardados até o fim da reserva, dá pra tentar de novo |

`ChooseNumberPage` tem dois estados possíveis, dependendo da resposta de `verificar-pagamento`:
- **Token emitido** → mostra a grade de números e o formulário.
- **409 "já escolheu"** → mostra direto o número já confirmado (a pessoa recarregou a página, ou voltou depois) — não é tratado como erro.

## Design system

Cores (Tailwind, `tailwind.config.ts`): `verde` (#368c5e), `verde-escuro` (#1a5331), `laranja` (#ff9d3b), `creme` (#fffccc), `carvao` (#1e1b1c), `neutro` (#f7f7f7). Tipografia: `font-display` (Quicksand, títulos) e `font-body` (Nunito, texto corrido). Componentes de UI (`Button`, `Input`, `Pill`, `Card`) não sabem nada sobre "rifa" — são reaproveitáveis pra qualquer campanha futura do Gatil.

## Testes E2E

```bash
npm run test:e2e
```

Playwright real, num navegador de verdade — mas **o backend nunca é chamado de verdade**. Toda chamada de API é interceptada via `page.route(...)` e respondida com dados fake, definidos no próprio step. Isso deixa os testes rápidos e independentes de o backend estar de pé, e evita usar dados de teste reais do Mercado Pago num pipeline de CI.

### O que cada `.feature` evidencia

**`pagina-escolher-numero.feature`**
- Acesso com `payment_id` válido mostra a grade, com os números ocupados corretamente desabilitados e os livres clicáveis
- Acesso sem `payment_id` redireciona pra `/rifa`
- Falha na verificação do pagamento redireciona pra `/rifa/pagamento-recusado`
- `/pagamento-aprovado` na raiz dá 404 — a escolha do número só existe em `/rifa/pagamento-aprovado`
- Fluxo completo: selecionar número, preencher formulário, confirmar — chega na tela de sucesso com o número certo
- **Se o backend responde 409 (número escolhido por outra pessoa durante o preenchimento), a mensagem de erro aparece e os campos do formulário não são apagados** — prova de que a pessoa não perde o que já digitou nesse cenário

**`pagamento-pendente-recusado.feature`**
- Tela de pendente mostra a explicação do PIX e o botão de reverificar
- Clicar em "verificar agora", com o pagamento já aprovado nesse meio tempo, redireciona pra escolha do número
- Tela de recusado mostra a explicação e o botão de tentar de novo
- "Tentar novamente" leva de volta pra `/rifa`, gerando um novo pagamento
- `/pagamento-pendente` e `/pagamento-recusado` na raiz dão 404 — essas telas só existem em `/rifa/...`

**`doacao.feature`**
- Escolher valor (pré-definido ou digitado) e ser redirecionado ao Mercado Pago, com a origem (UTM) enviada ao backend
- Telas de retorno em `/doar/pagamento-aprovado`, `/doar/pagamento-pendente` e `/doar/pagamento-recusado`, com os botões levando de volta pra `/doar`
- Os caminhos antigos `/doacao-confirmada`, `/doacao-pendente` e `/doacao-recusada` dão 404, sem redirecionar
- `/pagamento-aprovado`, `/pagamento-pendente` e `/pagamento-recusado` na raiz continuam dando 404

**`reserva.feature`** (`@reserva`, servidor com `VITE_FLUXO_COMPLETO=true`)
- Jornada completa no Pix: escolher 3 números, reservar (sem valor no corpo), dados de contato, QR code, aprovação e bilhetes
- Número tirado um segundo antes (sai da seleção, total atualizado), todos ocupados (409), limite do servidor (429)
- Relógio controlado (`page.clock`): a reserva vence em 15 min e o Pix em 30 min
- Sem aceite dos termos ou WhatsApp sem DDD não gera pagamento; reserva vencida no servidor (410) volta ao quadro
- Trocar números libera a reserva; máximo de 10 números; cartão leva a reserva e os dados ao Mercado Pago
- Recarregar a página retoma o Pix; voltas do cartão (aprovada, parcial com link, em análise, recusada); link antigo de escolha de uma compra leva à compra
- Política de privacidade e headers de segurança do deploy (`vercel.json`)

**`mock.feature`** (`@mock`, servidor com `npm run dev:mock`)
- A jornada inteira só com o backend falso: Pix aprovado, corrida e cartão

O Playwright sobe três servidores (5173 padrão, 5174 com reserva, 5175 mock), um por projeto. Para usar um Chromium já instalado: `PW_CHROMIUM_PATH=/caminho/do/chromium npm run test:e2e`.

## Segurança

O `vercel.json` manda em toda rota: CSP (scripts só do próprio site, Turnstile, Meta Pixel, Google Tag e SociableKIT; `frame-ancestors 'none'`, `object-src 'none'`, `form-action 'self'`), HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin` (o `payment_id` da URL não vaza para outros sites) e `Permissions-Policy`. Ao incluir um script ou iframe de outro domínio, inclua o domínio na CSP — senão o navegador bloqueia.

## CI/CD

`.github/workflows/tests.yml` sobe o próprio Vite (`webServer` do Playwright) e roda os testes em todo `pull_request`/push pra `main` — sem depender do backend estar acessível.

## Deploy (Vercel)

Build estático (`vite build`), com `vercel.json` fazendo rewrite de qualquer rota pro `index.html` — necessário porque o React Router cuida do roteamento no cliente; sem isso, recarregar uma rota como `/rifa/pagamento-aprovado` direto dá 404 na Vercel.

O domínio principal é `gatilirmafrancisca.org`. O `vercel.json` redireciona (301) o domínio antigo `rifasolidaria.gatilirmafrancisca.org`: a raiz vai pra `gatilirmafrancisca.org/rifa` e qualquer outro caminho é mantido (ex.: `/doar`, `/pagamento-aprovado?payment_id=...`), pra não quebrar links já divulgados.
