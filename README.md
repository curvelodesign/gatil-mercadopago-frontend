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
│       ├── ChooseNumberPage.tsx        # /pagamento-aprovado — grade + formulário + "já escolhido"
│       ├── PagamentoPendentePage.tsx   # /pagamento-pendente — típico do PIX sem auto_return
│       ├── PagamentoRecusadoPage.tsx   # /pagamento-recusado
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

## Como rodar localmente

```bash
npm install
npm run dev
```

Pra testar o fluxo de pagamento de verdade em dev, o backend (e o próprio frontend, se for testar o redirect automático) precisa de uma URL pública — o Mercado Pago rejeita `back_urls` com `localhost`. O `vite.config.ts` já resolve isso via proxy: as chamadas do app pra `/api/*` e `/mercadopago/*` são encaminhadas pro backend (local ou por túnel), então o app em si continua rodando normal em `http://localhost:5173`.

## Rotas

| Caminho | Página | Quando chega aqui |
|---|---|---|
| `/` | `HomePage` | Provisória até a landing page — leva pra `/rifa` e `/doar` |
| `/rifa` | `PagarPage` | Link usado no Instagram/vídeo — gera uma preferência nova e redireciona pro Mercado Pago (`/rifa/pagar` continua funcionando como alias) |
| `/doar` | `DoarPage` | Página de doação |
| `/pagamento-aprovado?payment_id=` | `ChooseNumberPage` | `back_urls.success` — verifica o pagamento, mostra a grade e o formulário |
| `/pagamento-pendente?payment_id=` | `PagamentoPendentePage` | `back_urls.pending` — típico do PIX, que não redireciona sozinho |
| `/pagamento-recusado` | `PagamentoRecusadoPage` | `back_urls.failure`, ou qualquer falha real na verificação |

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
- Falha na verificação do pagamento redireciona pra `/pagamento-recusado`
- Fluxo completo: selecionar número, preencher formulário, confirmar — chega na tela de sucesso com o número certo
- **Se o backend responde 409 (número escolhido por outra pessoa durante o preenchimento), a mensagem de erro aparece e os campos do formulário não são apagados** — prova de que a pessoa não perde o que já digitou nesse cenário

**`pagamento-pendente-recusado.feature`**
- Tela de pendente mostra a explicação do PIX e o botão de reverificar
- Clicar em "verificar agora", com o pagamento já aprovado nesse meio tempo, redireciona pra escolha do número
- Tela de recusado mostra a explicação e o botão de tentar de novo
- "Tentar novamente" leva de volta pra `/rifa`, gerando um novo pagamento

## CI/CD

`.github/workflows/tests.yml` sobe o próprio Vite (`webServer` do Playwright) e roda os testes em todo `pull_request`/push pra `main` — sem depender do backend estar acessível.

## Deploy (Vercel)

Build estático (`vite build`), com `vercel.json` fazendo rewrite de qualquer rota pro `index.html` — necessário porque o React Router cuida do roteamento no cliente; sem isso, recarregar uma rota como `/pagamento-aprovado` direto dá 404 na Vercel.

O domínio principal é `gatilirmafrancisca.org`. O `vercel.json` redireciona (301) o domínio antigo `rifasolidaria.gatilirmafrancisca.org`: a raiz vai pra `gatilirmafrancisca.org/rifa` e qualquer outro caminho é mantido (ex.: `/doar`, `/pagamento-aprovado?payment_id=...`), pra não quebrar links já divulgados.
