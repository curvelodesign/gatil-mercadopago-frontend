import { Link } from "react-router-dom";
import imgCatAxeTriste from "@/assets/doacao/cat-axe-triste.webp";
import { DONATION_INSTAGRAM_URL } from "@/features/donation/constants";
import { TelaRetorno } from "@/features/landing-doacao/TelaRetorno";

export function DoacaoRecusadaPage() {
  return (
    <TelaRetorno
      tituloAba="Doação não concluída"
      rotulo="Doação não&nbsp;concluída"
      titulo="Essa doação não&nbsp;foi concluída"
      gato={imgCatAxeTriste}
      acoes={
        <>
          <Link className="botao botao-laranja botao-bloco" to="/doar">
            Tentar novamente
          </Link>
          <a className="link-botao" href={DONATION_INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
            Falar com&nbsp;a&nbsp;gente no&nbsp;Instagram
          </a>
        </>
      }
    >
      <p>
        Pode ter sido o&nbsp;cartão recusado, saldo insuficiente ou&nbsp;uma instabilidade do&nbsp;Mercado Pago.
        Nenhum valor foi&nbsp;cobrado.
      </p>
    </TelaRetorno>
  );
}
