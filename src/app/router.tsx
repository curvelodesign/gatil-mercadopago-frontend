import { createBrowserRouter } from "react-router-dom";
import { DonationLayout } from "@/app/DonationLayout";
import { HomeLayout } from "@/app/HomeLayout";
import { RaffleLayout } from "@/app/RaffleLayout";
import { RootLayout } from "@/app/RootLayout";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { ChooseNumberPage, chooseNumberLoader } from "@/pages/ChooseNumberPage";
import { PagarPage } from "@/pages/PagarPage";
import { PagamentoPendentePage } from "@/pages/PagamentoPendentePage";
import { PagamentoRecusadoPage } from "@/pages/PagamentoRecusadoPage";
import { DoacaoRecusadaPage } from "@/pages/DoacaoRecusadaPage";
import { DoacaoPendentePage } from "@/pages/DoacaoPendentePage";
import { DoacaoConfirmadaPage } from "@/pages/DoacaoConfirmadaPage";
import { DoarPage } from "@/pages/DoarPage";
import { HomePage } from "@/pages/HomePage";

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
        element: <RaffleLayout />,
        children: [
          { path: "rifa", element: <PagarPage /> },
          // Alias mantido pros links antigos já divulgados.
          { path: "rifa/pagar", element: <PagarPage /> },
          { path: "pagamento-aprovado", element: <ChooseNumberPage />, loader: chooseNumberLoader },
          { path: "pagamento-pendente", element: <PagamentoPendentePage /> },
          { path: "pagamento-recusado", element: <PagamentoRecusadoPage /> },
        ],
      },
      {
        element: <DonationLayout />,
        children: [
          { path: "doar", element: <DoarPage /> },
          { path: "doacao-confirmada", element: <DoacaoConfirmadaPage /> },
          { path: "doacao-pendente", element: <DoacaoPendentePage /> },
          { path: "doacao-recusada", element: <DoacaoRecusadaPage /> },
        ],
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);