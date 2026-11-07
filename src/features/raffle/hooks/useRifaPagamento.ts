import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { consultarStatusPixRifa, criarPagamentoRifa, criarPixRifa } from "@/lib/api/raffle";
import { pixNoSiteAtivo } from "@/features/pix/pixNoSite";
import { chavePixTeste } from "@/features/pix/pixTeste";
import { usePixAcompanhamento } from "@/features/pix/usePixAcompanhamento";
import type { PixCriado } from "@/features/pix/types";
import { utmsAceitas } from "@/features/donation/utm";
import { RAFFLE_ROUTES, TICKET_PRICE_BRL } from "@/features/raffle/constants";
import { ApiRequestError } from "@/types/api";

export type FormaPagamentoRifa = "pix" | "cartao";

/** Tempo mostrando "Pagamento confirmado!" antes de ir pra escolha do número. */
const PAUSA_APROVADO_MS = 1800;

// Mesmo critério do backend (validarEmailPix): domínio com ao menos 2 letras no final
const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const ERRO_ESGOTADO = "Os números desta ação já foram todos vendidos. Obrigado pelo carinho com o Gatil!";

/** Valor do Pix de teste (o backend é quem decide; isso é só pra mostrar antes de gerar). */
const VALOR_PIX_TESTE_BRL = 0.01;

interface UseRifaPagamentoArgs {
  utm: { utmSource: string | null; utmMedium: string | null; utmCampaign: string | null };
}

/**
 * Pagamento do bilhete da rifa. Pix: gerado e acompanhado aqui na tela;
 * aprovado, leva pra escolha do número. Cartão: Checkout Pro do Mercado
 * Pago, que volta pra escolha do número pelas back_urls. Os dois caminhos
 * terminam em /rifa/pagamento-aprovado?payment_id=..., que valida o
 * pagamento e libera a escolha.
 */
export function useRifaPagamento({ utm }: UseRifaPagamentoArgs) {
  const navigate = useNavigate();
  // Modo teste (gatilPixTeste no console): Pix de R$ 0,01, mesmo sem VITE_PIX_NO_SITE.
  const [modoTeste] = useState(() => chavePixTeste() !== null);
  const [pixAtivo] = useState(() => pixNoSiteAtivo() || modoTeste);
  const [forma, setFormaEstado] = useState<FormaPagamentoRifa>(pixAtivo ? "pix" : "cartao");
  const [email, setEmailEstado] = useState("");
  const [pix, setPix] = useState<PixCriado | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { etapa, segundosRestantes } = usePixAcompanhamento(pix, {
    consultarStatus: consultarStatusPixRifa,
    aoAprovar: (aprovado) => {
      window.setTimeout(
        () => navigate(`${RAFFLE_ROUTES.aprovado}?payment_id=${encodeURIComponent(String(aprovado.paymentId))}`),
        PAUSA_APROVADO_MS
      );
    },
  });

  // Ao voltar do Mercado Pago pelo "voltar", o navegador restaura a página
  // do cache (bfcache) com o botão travado em "Abrindo pagamento...".
  useEffect(() => {
    function aoVoltar(evento: PageTransitionEvent) {
      if (evento.persisted) setIsSubmitting(false);
    }
    window.addEventListener("pageshow", aoVoltar);
    return () => window.removeEventListener("pageshow", aoVoltar);
  }, []);

  const usaPix = pixAtivo && forma === "pix";
  const emailValido = EMAIL_VALIDO.test(email.trim());
  const podeEnviar = !usaPix || emailValido;

  function setForma(nova: FormaPagamentoRifa) {
    setFormaEstado(nova);
    setSubmitError(null);
  }

  function setEmail(valor: string) {
    setEmailEstado(valor);
    setSubmitError(null);
  }

  /** Volta da tela do Pix para a escolha da forma de pagamento. */
  function limparPix() {
    setPix(null);
    setSubmitError(null);
  }

  function mensagemDeErro(err: unknown, padrao: string) {
    if (err instanceof ApiRequestError && err.status === 403 && modoTeste) {
      return "Chave de teste inválida. Confira a PIX_TESTE_CHAVE do backend e rode gatilPixTeste de novo.";
    }
    return err instanceof ApiRequestError && err.status === 409 ? ERRO_ESGOTADO : padrao;
  }

  async function gerarPix() {
    try {
      setPix(await criarPixRifa({ email: email.trim(), ...utmsAceitas(utm) }));
    } catch (err) {
      setSubmitError(mensagemDeErro(err, "Não conseguimos gerar o Pix agora. Tenta de novo em instantes."));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function submit() {
    if (!podeEnviar || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    if (usaPix) {
      await gerarPix();
      return;
    }

    try {
      const { initPoint } = await criarPagamentoRifa(utmsAceitas(utm));
      window.location.href = initPoint;
    } catch (err) {
      setSubmitError(
        mensagemDeErro(err, "Não conseguimos abrir o pagamento agora. Tenta de novo em instantes ou fala com a gente pelo Instagram do Gatil.")
      );
      setIsSubmitting(false);
    }
  }

  // No Pix, o valor que vale é o que o backend cobrou.
  const valorPix = pix?.valor ?? (modoTeste ? VALOR_PIX_TESTE_BRL : TICKET_PRICE_BRL);

  return {
    pixAtivo,
    modoTeste,
    valorPix,
    forma,
    setForma,
    usaPix,
    email,
    setEmail,
    emailValido,
    podeEnviar,
    isSubmitting,
    submitError,
    submit,
    pix,
    etapa,
    segundosRestantes,
    limparPix,
  };
}
