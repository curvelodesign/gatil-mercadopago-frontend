import imgCatFamiDeitado from "@/assets/doacao/cat-fami-deitado.webp";
import { DONATION_INSTAGRAM_URL } from "@/features/donation/constants";
import { TelaRetorno } from "@/features/landing-doacao/TelaRetorno";

export function DoacaoPendentePage() {
  return (
    <TelaRetorno
      tituloAba="Doação em confirmação"
      rotulo="Aguardando confirmação"
      titulo="Recebemos sua&nbsp;doação"
      gato={imgCatFamiDeitado}
      gatoDeitado
      acoes={
        <a className="botao botao-laranja botao-bloco" href={DONATION_INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
          Seguir no&nbsp;Instagram
        </a>
      }
    >
      <p>
        Se&nbsp;você pagou com&nbsp;<strong>Pix</strong>, a&nbsp;confirmação pode levar alguns instantes.
        Não&nbsp;precisa fazer mais nada: assim que&nbsp;o&nbsp;pagamento for aprovado, ele&nbsp;é registrado
        automaticamente.
      </p>
      <p>Muito obrigado por&nbsp;apoiar o&nbsp;Gatil Irmã&nbsp;Francisca!</p>
    </TelaRetorno>
  );
}
