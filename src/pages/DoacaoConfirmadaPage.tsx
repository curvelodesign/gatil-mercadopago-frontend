import { Link } from "react-router-dom";
import imgCatAcerola from "@/assets/doacao/cat-acerola.webp";
import { DONATION_INSTAGRAM_URL } from "@/features/donation/constants";
import { compartilhar } from "@/features/landing-doacao/compartilhar";
import { TelaRetorno } from "@/features/landing-doacao/TelaRetorno";

export function DoacaoConfirmadaPage() {
  return (
    <TelaRetorno
      tituloAba="Obrigado pela doação"
      rotulo="Doação&nbsp;recebida"
      titulo="Muito obrigado pela&nbsp;sua&nbsp;doação!"
      gato={imgCatAcerola}
      acoes={
        <>
          <a className="botao botao-laranja botao-bloco" href={DONATION_INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
            Seguir no&nbsp;Instagram
          </a>
          <button className="botao botao-contorno botao-bloco" type="button" onClick={compartilhar}>
            🔗&nbsp;Compartilhar
          </button>
          <Link className="link-botao" to="/doar">
            Fazer outra doação
          </Link>
        </>
      }
    >
      <p>
        Sua contribuição vai direto para&nbsp;o&nbsp;cuidado dos&nbsp;cerca de&nbsp;300&nbsp;gatos do&nbsp;Gatil:
        comida, saúde e&nbsp;teto, todos os&nbsp;dias.
      </p>
      <p>A&nbsp;confirmação do&nbsp;pagamento chega pelo&nbsp;Mercado Pago.</p>
    </TelaRetorno>
  );
}
