import { Carrossel } from "@/features/landing-doacao/Carrossel";
import { FOTOS_GATIL } from "@/features/landing-doacao/fotos";
import { Faixa } from "@/features/landing-doacao/Faixa";
import imgCatAcerola from "@/assets/doacao/cat-acerola.webp";
import imgCatAxe from "@/assets/doacao/cat-axe.webp";
import imgCatFami from "@/assets/doacao/cat-fami.webp";
import imgIconPaws from "@/assets/doacao/icon-paws.webp";
import imgIconYarnLaranja from "@/assets/doacao/icon-yarn-laranja.webp";
import imgLogoGreen from "@/assets/doacao/logo-green.webp";

/** Topo: chamada principal, banner de fotos do Gatil e a faixa que corre. */
export function Topo({ onDoar }: { onDoar: (valor?: number) => void }) {
  return (
    <>
      <header className="hero" data-secao="hero">
        {/* Adesivos em volta do título (só no computador, onde há espaço) */}
        <span className="adesivo adesivo-lateral coracao flutua enfeite-coracao-esquerda"></span>
        <img className="adesivo adesivo-lateral enfeite-patas" src={imgIconPaws} alt="" />
        <span className="adesivo adesivo-lateral coracao flutua enfeite-coracao-direita"></span>
        <img className="adesivo adesivo-lateral enfeite-novelo" src={imgIconYarnLaranja} alt="" />
        <span className="adesivo adesivo-lateral coracao flutua enfeite-coracao-alto"></span>
        <div className="container hero__conteudo">
          <div className="hero__logo">
            <img src={imgLogoGreen} alt="Gatil Irmã Francisca" />
          </div>
          <ul className="hero__tags">
            <li className="tag">🐾&nbsp;Animais &amp;&nbsp;Proteção</li>
            <li className="tag">📍&nbsp;Salvador,&nbsp;BA</li>
          </ul>
          <h1>
            Dez anos depois, ainda somos&nbsp;nós:{" "}
            <span className="destaque">
              <span className="nowrap">
                300&nbsp;gat<span className="sr-only">o</span>
                <svg className="coracao-o" aria-hidden="true" viewBox="1.4 2.2 21.2 20.4">
                  <path
                    d="M12 20.6C12 20.6 3.2 14.6 3.2 8.9 3.2 5.8 5.5 3.6 8.1 3.6c1.8 0 3.2 1 3.9 2.5.7-1.5 2.1-2.5 3.9-2.5 2.6 0 4.9 2.2 4.9 5.3 0 5.7-8.8 11.7-8.8 11.7Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.8"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                </svg>
                s
              </span>{" "}
              pra&nbsp;cuidar
            </span>{" "}
            e&nbsp;nenhuma verba pública pra&nbsp;contar.
          </h1>
        </div>
        {/* ============ BANNER DE FOTOS DO GATIL (tela cheia) ============
           Cada foto é um .fotos__slide com uma <img className="foto-real" />.
           - Quantidade livre: os pontinhos são criados sozinhos.
           - data-foco diz o que fica no centro quando a foto é cortada (no celular
             o banner fica vertical): "50% 50%" é o meio; "30% 60%" puxa para a
             esquerda e um pouco para baixo.
           - Troca a cada 3 segundos, com fade. */}
        <Carrossel className="fotos banner" rotulo="Fotos do Gatil Irmã Francisca" fotos={FOTOS_GATIL} />
        <div className="container hero__conteudo">
          <p className="hero__texto">
            Somos o&nbsp;Gatil Irmã Francisca, um&nbsp;abrigo independente em&nbsp;Salvador que&nbsp;garante comida,
            saúde e&nbsp;teto para&nbsp;cerca de&nbsp;300&nbsp;gatos abandonados todos&nbsp;os&nbsp;dias. Hoje,
            acumulamos em&nbsp;dívidas e&nbsp;juros os&nbsp;meses em&nbsp;que&nbsp;a&nbsp;fome chegou antes
            do&nbsp;apoio. Quem&nbsp;vem ajudando a&nbsp;sustentar essa&nbsp;conta é&nbsp;gente como&nbsp;você.
          </p>
          <div className="hero__acoes">
            <button className="botao botao-laranja" type="button" onClick={() => onDoar()}>
              Quero doar&nbsp;💛
            </button>
            <a
              className="botao botao-contorno"
              href="https://www.instagram.com/p/DcUSq3tGfds/?stkn=MTN5emtva3lscnl2cA=="
              target="_blank"
              rel="noopener"
            >
              Quero adotar
            </a>
          </div>
          <ul className="hero__confianca">
            <li>🛡&nbsp;Doação em&nbsp;ambiente seguro Mercado&nbsp;Pago</li>
            <li>🏛&nbsp;CNPJ 25.382.038/0001-05</li>
            <li>📅&nbsp;Atua formalmente desde&nbsp;2016</li>
          </ul>
        </div>
        <div className="hero__gatos" aria-hidden="true">
          <span className="adesivo coracao flutua coracao-gatos-esquerda"></span>
          <span className="adesivo coracao flutua coracao-gatos-direita"></span>
          <span className="adesivo coracao flutua coracao-gatos-meio"></span>
          <img className="gato" src={imgCatAxe} alt="" />
          <img className="gato" src={imgCatFami} alt="" />
          <img className="gato" src={imgCatAcerola} alt="" />
        </div>
      </header>

      <Faixa />
    </>
  );
}
