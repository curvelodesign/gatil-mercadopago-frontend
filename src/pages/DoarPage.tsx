import { Card } from "@/components/ui/Card";
import { DonationForm } from "@/features/donation/components/DonationForm";
import { useDonationForm } from "@/features/donation/hooks/useDonationForm";
import { useUtmParams } from "@/hooks/useUtmParams";

export function DoarPage() {
  const utm = useUtmParams();
  const {
    selectedAmount,
    customAmount,
    isAmountValid,
    isSubmitting,
    submitError,
    selectPreset,
    updateCustomAmount,
    submit,
  } = useDonationForm({ utm });

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3.5 flex h-14 w-14 items-center justify-center rounded-full bg-laranja/15 text-2xl">
          🐾
        </div>
        <h1 className="mb-2 font-display text-3xl font-bold text-verde-escuro">
          Fazer uma doação
        </h1>
        <p className="text-sm text-carvao/70">
          Toda contribuição ajuda a cuidar dos gatos do Gatil Irmã Francisca.
        </p>
      </div>

      <Card>
        <DonationForm
          selectedAmount={selectedAmount}
          customAmount={customAmount}
          isAmountValid={isAmountValid}
          isSubmitting={isSubmitting}
          submitError={submitError}
          onSelectPreset={selectPreset}
          onCustomAmountChange={updateCustomAmount}
          onSubmit={submit}
        />
      </Card>
    </div>
  );
}