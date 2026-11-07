import { createBrowserRouter } from "react-router-dom";
import { LandingLayout } from "@/app/LandingLayout";
import { HomeLayout } from "@/app/HomeLayout";
import { RaffleLayout } from "@/app/RaffleLayout";
import { RootLayout } from "@/app/RootLayout";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { ChooseNumberPage, chooseNumberLoader } from "@/pages/ChooseNumberPage";
import { AcaoLayout } from "@/app/AcaoLayout";
import { AcaoNatalPage } from "@/features/acao-natal/AcaoNatalPage";
import { RegulamentoAcaoPage } from "@/features/acao-natal/RegulamentoAcaoPage";
import { PagamentoPendentePage } from "@/pages/PagamentoPendentePage";
import { PagamentoRecusadoPage } from "@/pages/PagamentoRecusadoPage";
import { CompraRetornoPage } from "@/pages/CompraRetornoPage";
import { DoacaoRecusadaPage } from "@/pages/DoacaoRecusadaPage";
import { DoacaoPendentePage } from "@/pages/DoacaoPendentePage";
import { DoacaoConfirmadaPage } from "@/pages/DoacaoConfirmadaPage";
import { DoarPage } from "@/pages/DoarPage";
import { HomePage } from "@/pages/HomePage";
import { PoliticaPrivacidadePage } from "@/pages/PoliticaPrivacidadePage";
import { TermosPage } from "@/pages/TermosPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        // Provisória até a landing page do Gatil ser implementada.
        element: <HomeLayout />,
        children: [{ index: true, element: <HomePage /> }],
      },
      {
        // Ação Solidária de Natal: landing da compra (Pix na tela ou cartão) e regulamento
        element: <AcaoLayout />,
        children: [
          { path: "rifa", element: <AcaoNatalPage /> },
          // Alias mantido pros links antigos já divulgados.
          { path: "rifa/pagar", element: <AcaoNatalPage /> },
          { path: "regulamento-acao", element: <RegulamentoAcaoPage /> },
        ],
      },
      {
        element: <RaffleLayout />,
        children: [
          { path: "rifa/pagamento-aprovado", element: <ChooseNumberPage />, loader: chooseNumberLoader },
          { path: "rifa/pagamento-pendente", element: <PagamentoPendentePage /> },
          { path: "rifa/pagamento-recusado", element: <PagamentoRecusadoPage /> },
          // Volta do cartão de uma compra com reserva (números escolhidos antes de pagar)
          { path: "rifa/compra/aprovada", element: <CompraRetornoPage retorno="aprovada" /> },
          { path: "rifa/compra/pendente", element: <CompraRetornoPage retorno="pendente" /> },
          { path: "rifa/compra/recusada", element: <CompraRetornoPage retorno="recusada" /> },
        ],
      },
      {
        // Landing de doação e documentos: visual próprio, com aviso de cookies
        element: <LandingLayout />,
        children: [
          { path: "doar", element: <DoarPage /> },
          { path: "politica-de-privacidade", element: <PoliticaPrivacidadePage /> },
          { path: "termos", element: <TermosPage /> },
          // Retorno do checkout da doação (back_urls do backend): ficam sob /doar,
          // separadas das da rifa, com o mesmo visual, aviso de cookies e rastreamento.
          { path: "doar/pagamento-aprovado", element: <DoacaoConfirmadaPage /> },
          { path: "doar/pagamento-pendente", element: <DoacaoPendentePage /> },
          { path: "doar/pagamento-recusado", element: <DoacaoRecusadaPage /> },
        ],
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);