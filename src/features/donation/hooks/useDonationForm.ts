import { useState } from "react";
import { criarPagamentoDoacao } from "@/lib/api/doacao";
import { MIN_DONATION_AMOUNT } from "@/features/donation/constants";
import { trackEvent } from "@/lib/analytics/metaPixel";

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

  function selectPreset(value: number) {
    setSelectedAmount(value);
    setCustomAmount("");
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

  async function submit() {
    if (!isAmountValid || numericAmount === null) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const { initPoint } = await criarPagamentoDoacao({
        valor: numericAmount,
        utmSource: utm.utmSource,
        utmMedium: utm.utmMedium,
        utmCampaign: utm.utmCampaign,
      });
      trackEvent("Donate", { value: numericAmount, currency: "BRL" });
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
  };
}