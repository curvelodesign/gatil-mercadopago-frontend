import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { AmountPresets } from "@/features/donation/components/AmountPresets";

interface DonationFormProps {
  selectedAmount: number | null;
  customAmount: string;
  isAmountValid: boolean;
  isSubmitting: boolean;
  submitError: string | null;
  onSelectPreset: (value: number) => void;
  onCustomAmountChange: (value: string) => void;
  onSubmit: () => void;
}

export function DonationForm({
  selectedAmount,
  customAmount,
  isAmountValid,
  isSubmitting,
  submitError,
  onSelectPreset,
  onCustomAmountChange,
  onSubmit,
}: DonationFormProps) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <p className="mb-2.5 text-xs font-extrabold uppercase tracking-wide text-carvao/40">
        Escolha um valor
      </p>
      <AmountPresets selectedAmount={selectedAmount} onSelect={onSelectPreset} />

      <div className="my-3.5 flex items-center gap-2.5 text-xs text-carvao/40">
        <span className="h-px flex-1 bg-carvao/10" />
        ou digite outro valor
        <span className="h-px flex-1 bg-carvao/10" />
      </div>

      <Input
        label="Valor da doação (R$)"
        name="valor"
        inputMode="decimal"
        placeholder="Ex: 35"
        value={customAmount}
        onChange={(event) => onCustomAmountChange(event.target.value)}
      />

      {submitError && (
        <p className="mb-3 text-xs text-red-500" role="alert">
          {submitError}
        </p>
      )}

      <Button type="submit" disabled={!isAmountValid || isSubmitting} className="w-full">
        {isSubmitting ? "Abrindo pagamento..." : "Doar agora"}
      </Button>
      <p className="mt-2.5 text-center text-[11px] leading-relaxed text-carvao/40">
        Você será redirecionado ao ambiente seguro do Mercado Pago para
        concluir sua doação.
      </p>
    </form>
  );
}