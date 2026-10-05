import imgCatAcerola from "@/assets/doacao/cat-acerola.webp";
import imgCatAmelie from "@/assets/doacao/cat-amelie.webp";
import imgCatAxe from "@/assets/doacao/cat-axe.webp";
import imgCatChica from "@/assets/doacao/cat-chica.webp";
import imgCatFami from "@/assets/doacao/cat-fami.webp";
import imgCatMingau from "@/assets/doacao/cat-mingau.webp";

/** A Turma do Gatil. */
export function Turma({ onDoar }: { onDoar: (valor?: number) => void }) {
  return (
    <>
      <section className="secao turma" data-secao="turma">
        <div className="container">
          <p className="rotulo">A&nbsp;Turma do&nbsp;Gatil</p>
          <h2 className="titulo-secao">
            Quem&nbsp;são&nbsp;esses&nbsp;gatos que&nbsp;tomaram conta do&nbsp;nosso&nbsp;perfil no&nbsp;Instagram?
          </h2>
          <p className="turma__texto">
            Essa&nbsp;turminha foi&nbsp;criada por&nbsp;uma&nbsp;designer voluntária, que&nbsp;elaborou uma&nbsp;nova
            identidade visual para&nbsp;a&nbsp;ONG do&nbsp;zero! Eles&nbsp;são&nbsp;gatinhos reais
            da&nbsp;nossa&nbsp;instituição, representam cada&nbsp;pelagem, temperamento e&nbsp;histórias
            que&nbsp;marcaram nossa&nbsp;trajetória.
          </p>
          <ul className="gatos">
            <li>
              <span className="foto">
                <img src={imgCatChica} alt="" />
              </span>
              Chica
            </li>
            <li>
              <span className="foto">
                <img src={imgCatMingau} alt="" />
              </span>
              Mingau
            </li>
            <li>
              <span className="foto">
                <img src={imgCatAxe} alt="" />
              </span>
              Axé
            </li>
            <li>
              <span className="foto">
                <img src={imgCatAmelie} alt="" />
              </span>
              Amelie
            </li>
            <li>
              <span className="foto">
                <img src={imgCatFami} alt="" />
              </span>
              Fami
            </li>
            <li>
              <span className="foto">
                <img src={imgCatAcerola} alt="" />
              </span>
              Acerola
            </li>
          </ul>
          <div className="faq__cta">
            <button className="botao botao-laranja" type="button" onClick={() => onDoar()}>
              Quero doar&nbsp;💛
            </button>
          </div>
        </div>
      </section>

      <svg
        className="onda onda--sobre-verde-escuro"
        viewBox="0 0 1440 96"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path fill="#ffffff" d="M0,40 C240,90 480,90 720,50 C960,10 1200,10 1440,50 L1440,96 L0,96 Z" />
      </svg>
    </>
  );
}
