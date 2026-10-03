import { useState } from "react";
import {
  isValidEmail,
  isValidBrazilianPhone,
  isValidFullName,
} from "@/lib/utils/validation";
import { confirmNumber } from "@/lib/api/raffle";
import type {
  ParticipantFormData,
  ParticipantFormErrors,
} from "@/features/raffle/types";

const EMPTY_FORM: ParticipantFormData = {
  fullName: "",
  whatsapp: "",
  email: "",
};

interface UseRaffleFormArgs {
  selectedNumber: number | null;
  token: string;
}

export function useRaffleForm({ selectedNumber, token }: UseRaffleFormArgs) {
  const [formData, setFormData] = useState<ParticipantFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<ParticipantFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmedNumber, setConfirmedNumber] = useState<number | null>(null);

  function updateField(field: keyof ParticipantFormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function validate(): boolean {
    const nextErrors: ParticipantFormErrors = {};
    if (!isValidFullName(formData.fullName)) {
      nextErrors.fullName = "Preenche seu nome completo pra gente, por favor.";
    }
    if (!isValidBrazilianPhone(formData.whatsapp)) {
      nextErrors.whatsapp = "Precisamos de um WhatsApp válido com DDD.";
    }
    if (!isValidEmail(formData.email)) {
      nextErrors.email = "Esse e-mail não parece válido.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function submit() {
    if (selectedNumber === null || !validate()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Nomes de campo aqui já são os que o backend espera (name/phone),
      // não os nomes do formulário (fullName/whatsapp) — a tradução
      // acontece aqui, num lugar só.
      const result = await confirmNumber(token, {
        name: formData.fullName,
        phone: formData.whatsapp,
        email: formData.email,
        claimedNumber: selectedNumber,
      });
      setConfirmedNumber(result.claimedNumber);
    } catch (err: any) {
      if (err?.status === 409) {
        setSubmitError(
          "Esse número acabou de ser escolhido por outra pessoa. Escolhe outro pra continuar."
        );
      } else {
        setSubmitError(
          "Não conseguimos confirmar sua participação agora. Tenta de novo em instantes."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const isFormReady =
    selectedNumber !== null &&
    isValidFullName(formData.fullName) &&
    isValidBrazilianPhone(formData.whatsapp) &&
    isValidEmail(formData.email);

  return {
    formData,
    errors,
    isSubmitting,
    submitError,
    confirmedNumber,
    isFormReady,
    updateField,
    submit,
  };
}