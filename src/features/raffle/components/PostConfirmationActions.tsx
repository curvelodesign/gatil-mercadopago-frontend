import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { INSTAGRAM_URL } from "@/features/raffle/constants";

/**
 * Usado tanto logo após confirmar um número quanto ao recarregar a
 * página de um pagamento que já tinha número escolhido — as duas
 * situações terminam no mesmo lugar: "e agora?".
 */
export function PostConfirmationActions() {
  return (
    <div className="flex flex-col gap-2.5 sm:flex-row">
      <Link to="/rifa" className="flex-1">
        <Button variant="secondary" className="w-full">
          Comprar outro número
        </Button>
      </Link>
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1"
      >
        <Button className="w-full">Voltar ao Instagram</Button>
      </a>
    </div>
  );
}