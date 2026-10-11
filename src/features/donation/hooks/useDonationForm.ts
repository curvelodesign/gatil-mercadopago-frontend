import { useEffect, useState } from "react";
import { criarPagamentoDoacao, criarPix } from "@/lib/api/doacao";
import { MIN_DONATION_AMOUNT } from "@/features/donation/constants";
import { registrarInicioDoacao } from "@/lib/analytics/rastreamento";
import { coletarRastreio } from "@/lib/analytics/identificadores";
import { utmsAceitas } from "@/features/donation/utm";
import { marcarSaidaParaPagamento } from "@/features/landing-doacao/retornoPagamento";
import { pixNoSiteAtivo } from "@/features/donation/pixNoSite";
import type { PixCriado } from "@/features/donation/types";

export type FormaPagamento = "pix" | "cartao";

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface UseDonationFormArgs {
  utm: {
    utmSource: string | null;
    utmMedium: string | null;
    utmCampaign: string | null;
  };
}

export function useDonationForm({ utm }: UseDonationFormArgs) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Pix dentro do site: com ele ligado, a pessoa escolhe Pix (padrão) ou cartão
  const [pixAtivo] = useState(pixNoSiteAtivo);
  const [forma, setFormaEstado] = useState<FormaPagamento>(pixAtivo ? "pix" : "cartao");
  const [email, setEmailEstado] = useState("");
  const [pix, setPix] = useState<PixCriado | null>(null);

  // Ao voltar do Mercado Pago pelo botão "voltar", o navegador restaura a
  // página do cache (bfcache) com o estado de quando saiu: botão travado em
  // "Abrindo pagamento...". Destrava para a pessoa poder doar de novo.
  useEffect(() => {
    function aoVoltar(evento: PageTransitionEvent) {
      if (evento.persisted) setIsSubmitting(false);
    }
    window.addEventListener("pageshow", aoVoltar);
    return () => window.removeEventListener("pageshow", aoVoltar);
  }, []);

  // O valor do preset também aparece no campo; editar o campo desmarca o preset.
  function selectPreset(value: number) {
    setSelectedAmount(value);
    setCustomAmount(String(value));
  }

  function updateCustomAmount(value: string) {
    // Aceita só dígitos e um separador decimal — evita que o usuário digite
    // texto e o valor chegue quebrado no backend.
    const sanitized = value.replace(/[^\d.,]/g, "");
    setCustomAmount(sanitized);
    setSelectedAmount(null);
  }

  const numericAmount =
    customAmount !== ""
      ? Number(customAmount.replace(",", "."))
      : selectedAmount;

  const isAmountValid =
    typeof numericAmount === "number" &&
    !Number.isNaN(numericAmount) &&
    numericAmount >= MIN_DONATION_AMOUNT;

  const emailValido = EMAIL_VALIDO.test(email.trim());
  const usaPix = pixAtivo && forma === "pix";
  const podeEnviar = isAmountValid && (!usaPix || emailValido);

  function setForma(nova: FormaPagamento) {
    setFormaEstado(nova);
    setSubmitError(null);
  }

  function setEmail(valor: string) {
    setEmailEstado(valor);
    setSubmitError(null);
  }

  /** Volta da tela do Pix para a escolha de valor e forma de pagamento. */
  function limparPix() {
    setPix(null);
    setSubmitError(null);
  }

  async function gerarPix(valor: number) {
    try {
      const criado = await criarPix({
        valor,
        email: email.trim(),
        ...utmsAceitas(utm),
        rastreio: await coletarRastreio(),
      });
      registrarInicioDoacao(valor);
      setPix(criado);
    } catch {
      setSubmitError("Não conseguimos gerar o Pix agora. Tenta de novo em instantes.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function submit() {
    if (!podeEnviar || numericAmount === null) return;

    setIsSubmitting(true);
    setSubmitError(null);

    if (usaPix) {
      await gerarPix(numericAmount);
      return;
    }

    try {
      const { initPoint } = await criarPagamentoDoacao({
        valor: numericAmount,
        ...utmsAceitas(utm),
        rastreio: await coletarRastreio(),
      });
      registrarInicioDoacao(numericAmount);
      marcarSaidaParaPagamento();
      window.location.href = initPoint;
    } catch {
      setSubmitError(
        "Não conseguimos abrir o pagamento agora. Tenta de novo em instantes."
      );
      setIsSubmitting(false);
    }
  }

  return {
    selectedAmount,
    customAmount,
    isAmountValid,
    isSubmitting,
    submitError,
    selectPreset,
    updateCustomAmount,
    submit,
    // Pix dentro do site
    pixAtivo,
    forma,
    setForma,
    email,
    setEmail,
    emailValido,
    podeEnviar,
    valor: isAmountValid ? numericAmount : null,
    pix,
    limparPix,
  };
}