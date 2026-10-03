import { useState } from "react";
import { redirect, type LoaderFunctionArgs, useLoaderData } from "react-router-dom";
import { verificarPagamento } from "@/lib/api/mercadoPago";
import { apiClient } from "@/lib/api/client";
import { ApiRequestError } from "@/types/api";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { SuccessBanner } from "@/features/raffle/components/SuccessBanner";
import { NumberGrid } from "@/features/raffle/components/NumberGrid";
import { SelectedNumberPanel } from "@/features/raffle/components/SelectedNumberPanel";
import { ParticipantForm } from "@/features/raffle/components/ParticipantForm";
import { SuccessOverlay } from "@/features/raffle/components/SuccessOverlay";
import { PostConfirmationActions } from "@/features/raffle/components/PostConfirmationActions";
import { useAvailableNumbers } from "@/features/raffle/hooks/useAvailableNumbers";
import { useRaffleForm } from "@/features/raffle/hooks/useRaffleForm";
import { useOrderParams } from "@/hooks/useOrderParams";
import {
  PRIZE_VALUE_BRL,
  RAFFLE_DATE_LABEL,
  TICKET_PRICE_BRL,
  TOTAL_NUMBERS,
} from "@/features/raffle/constants";
import { formatCurrencyBRL, padNumber } from "@/lib/utils/format";

interface LoaderData {
  token: string | null;
  // Preenchido quando esse pagamento já tinha escolhido um número
  // antes (ex: a pessoa recarregou a página) — não é um erro.
  alreadyClaimedNumber: number | null;
}

export async function chooseNumberLoader({ request }: LoaderFunctionArgs): Promise<LoaderData> {
  const url = new URL(request.url);
  const paymentId = url.searchParams.get("payment_id");
  if (!paymentId) throw redirect("/rifa");

  try {
    const { token } = await verificarPagamento(paymentId);
    return { token, alreadyClaimedNumber: null };
  } catch (err) {
    if (err instanceof ApiRequestError && err.status === 409) {
      const claimedNumber = (err.data as { claimedNumber?: number } | undefined)?.claimedNumber;
      if (typeof claimedNumber === "number") {
        // Já escolheu antes — não é uma falha, é um estado válido.
        return { token: null, alreadyClaimedNumber: claimedNumber };
      }
    }
    // Qualquer outro erro (pagamento não aprovado, etc.) é recusa de verdade.
    throw redirect("/pagamento-recusado");
  }
}

function AlreadyClaimedScreen({
  claimedNumber,
  paymentId,
}: {
  claimedNumber: number;
  paymentId: string | null;
}) {
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  async function handleReenviar() {
    if (!paymentId) return;
    setIsResending(true);
    setResendMessage(null);

    try {
      await apiClient.post("/rifa/reenviar-email", { paymentId });
      setResendMessage("E-mail reenviado! Confere sua caixa de entrada (e o spam).");
    } catch {
      setResendMessage("Não conseguimos reenviar agora. Tenta de novo em instantes.");
    } finally {
      setIsResending(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-laranja/15 text-3xl">
        🐾
      </div>
      <h1 className="mb-2 font-display text-3xl font-bold text-verde-escuro">
        Você já escolheu seu número
      </h1>
      <p className="mb-1 font-display text-5xl font-bold text-laranja">
        {padNumber(claimedNumber)}
      </p>
      <Card className="mt-5 mb-4 w-full text-sm leading-relaxed text-carvao/80">
        Sua participação já está confirmada. O e-mail com todos os detalhes já
        foi enviado — nos vemos no sorteio, ao vivo no Instagram, dia{" "}
        {RAFFLE_DATE_LABEL}!
      </Card>

      <button
        type="button"
        onClick={handleReenviar}
        disabled={isResending || !paymentId}
        className="mb-6 text-xs font-bold text-verde underline disabled:opacity-50"
      >
        {isResending ? "Reenviando..." : "Não recebi o e-mail — reenviar"}
      </button>
      {resendMessage && (
        <p className="-mt-4 mb-6 text-xs text-carvao/60" role="status">
          {resendMessage}
        </p>
      )}

      <div className="w-full">
        <PostConfirmationActions />
      </div>
    </div>
  );
}

export function ChooseNumberPage() {
  const { token, alreadyClaimedNumber } = useLoaderData() as LoaderData;
  const { paymentId } = useOrderParams();
  const { takenNumbers, isLoading, error } = useAvailableNumbers();
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);

  const {
    formData,
    errors,
    isSubmitting,
    submitError,
    confirmedNumber,
    isFormReady,
    updateField,
    submit,
  } = useRaffleForm({ selectedNumber, token: token ?? "" });

  if (alreadyClaimedNumber !== null) {
    return (
      <AlreadyClaimedScreen claimedNumber={alreadyClaimedNumber} paymentId={paymentId} />
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 pb-20">
      <SuccessBanner paymentId={paymentId} />

      <div className="mb-6 text-center">
        <h1 className="mb-2 font-display text-3xl font-bold text-verde-escuro sm:text-4xl">
          Escolha seu número da sorte
        </h1>
        <p className="mx-auto mb-4 max-w-md text-sm text-carvao/70">
          São {TOTAL_NUMBERS} números concorrendo a{" "}
          <strong>{formatCurrencyBRL(PRIZE_VALUE_BRL)}</strong>. O sorteio é
          ao vivo, no Instagram do Gatil, no dia{" "}
          <strong>{RAFFLE_DATE_LABEL}</strong>.
        </p>
        <div className="flex flex-wrap justify-center gap-2.5">
          <Pill>🎟️ {TOTAL_NUMBERS} números</Pill>
          <Pill>💰 {formatCurrencyBRL(TICKET_PRICE_BRL)} cada</Pill>
          <Pill tone="laranja">🏆 Prêmio {formatCurrencyBRL(PRIZE_VALUE_BRL)}</Pill>
          <Pill>📅 Sorteio {RAFFLE_DATE_LABEL}</Pill>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-[1fr_340px] md:items-start">
        {isLoading ? (
          <div className="rounded-3xl bg-white p-8 text-center text-sm text-carvao/50">
            Carregando números disponíveis...
          </div>
        ) : error ? (
          <div className="rounded-3xl bg-white p-8 text-center text-sm text-red-500">
            {error}
          </div>
        ) : (
          <NumberGrid
            takenNumbers={takenNumbers}
            selectedNumber={selectedNumber}
            onSelect={setSelectedNumber}
          />
        )}

        <aside className="rounded-3xl bg-white p-5 shadow-[0_6px_18px_rgba(26,83,49,0.10)] md:sticky md:top-4">
          <SelectedNumberPanel
            selectedNumber={selectedNumber}
            onChangeNumber={() => setSelectedNumber(null)}
          />
          <hr className="my-3.5 border-carvao/10" />
          <ParticipantForm
            formData={formData}
            errors={errors}
            isFormReady={isFormReady}
            isSubmitting={isSubmitting}
            submitError={submitError}
            onFieldChange={updateField}
            onSubmit={submit}
          />
        </aside>
      </div>

      {confirmedNumber !== null && (
        <SuccessOverlay confirmedNumber={confirmedNumber} />
      )}
    </div>
  );
}