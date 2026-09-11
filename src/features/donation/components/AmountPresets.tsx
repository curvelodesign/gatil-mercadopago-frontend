import { clsx } from "clsx";
import { DONATION_PRESET_AMOUNTS } from "@/features/donation/constants";
import { formatCurrencyBRL } from "@/lib/utils/format";

interface AmountPresetsProps {
  selectedAmount: number | null;
  onSelect: (value: number) => void;
}

export function AmountPresets({ selectedAmount, onSelect }: AmountPresetsProps) {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
      {DONATION_PRESET_AMOUNTS.map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => onSelect(value)}
          className={clsx(
            "rounded-xl border py-3 font-display text-sm font-bold transition",
            selectedAmount === value
              ? "border-laranja bg-laranja text-carvao"
              : "border-verde bg-white text-verde-escuro hover:bg-verde/5"
          )}
        >
          {formatCurrencyBRL(value)}
        </button>
      ))}
    </div>
  );
}