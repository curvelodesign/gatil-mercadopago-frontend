import { createBrowserRouter } from "react-router-dom";
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

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <PagarPage /> },
      { path: "rifa/pagar", element: <PagarPage /> },
      { path: "pagamento-aprovado", element: <ChooseNumberPage />, loader: chooseNumberLoader },
      { path: "pagamento-pendente", element: <PagamentoPendentePage /> },
      { path: "pagamento-recusado", element: <PagamentoRecusadoPage /> },
      { path: "doar", element: <DoarPage /> },
      { path: "doacao-confirmada", element: <DoacaoConfirmadaPage /> },
      { path: "doacao-pendente", element: <DoacaoPendentePage /> },
      { path: "doacao-recusada", element: <DoacaoRecusadaPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);