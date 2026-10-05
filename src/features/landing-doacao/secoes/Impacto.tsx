import imgCatFamiDeitado from "@/assets/doacao/cat-fami-deitado.webp";
import imgIconBowl from "@/assets/doacao/icon-bowl.webp";
import imgIconHeart from "@/assets/doacao/icon-heart.webp";
import imgIconMouse from "@/assets/doacao/icon-mouse.webp";
import imgIconPaws from "@/assets/doacao/icon-paws.webp";

/** Valores sugeridos: cada card abre a janela de doação já com o valor. */
export function Impacto({ onDoar }: { onDoar: (valor?: number) => void }) {
  return (
    <>
      <section className="secao impacto" data-secao="impacto">
        <div className="container">
          <p className="rotulo">Escolha um&nbsp;valor</p>
          <h2 className="titulo-secao">
            Não&nbsp;sabe quanto doar? Vem ver o&nbsp;que&nbsp;dá pra&nbsp;fazer com&nbsp;sua&nbsp;ajuda:
          </h2>
          <p className="impacto__texto">
            Clique no&nbsp;valor que&nbsp;faz sentido pra&nbsp;você. Em&nbsp;dois cliques a&nbsp;doação está&nbsp;feita.
          </p>
          <div className="impacto__grade">
            <img className="adesivo gato-cochilo" src={imgCatFamiDeitado} alt="" id="gato-cochilo" />
            <button className="valor" type="button" onClick={() => onDoar(5)}>
              <span className="valor__icone">
                <img src={imgIconBowl} alt="" />
              </span>{" "}
              <span className="valor__numero">R$5</span>{" "}
              <span className="valor__texto">1&nbsp;dia de&nbsp;ração para&nbsp;1&nbsp;gato</span>{" "}
              <span className="valor__cta">Doar R$5&nbsp;→</span>
            </button>
            <button className="valor" type="button" onClick={() => onDoar(35)}>
              <span className="valor__icone">
                <img src={imgIconMouse} alt="" />
              </span>{" "}
              <span className="valor__numero">R$35</span>{" "}
              <span className="valor__texto">Vermífugo +&nbsp;antipulgas para&nbsp;1&nbsp;gato</span>{" "}
              <span className="valor__cta">Doar R$35&nbsp;→</span>
            </button>
            <button className="valor" type="button" onClick={() => onDoar(120)}>
              <span className="valor__icone">
                <img src={imgIconHeart} alt="" />
              </span>{" "}
              <span className="valor__numero">R$120</span>{" "}
              <span className="valor__texto">
                Protocolo de&nbsp;vacinação (V5&nbsp;+&nbsp;antirrábica) de&nbsp;1&nbsp;gato pronto pra&nbsp;adoção
              </span>{" "}
              <span className="valor__cta">Doar R$120&nbsp;→</span>
            </button>
            <button className="valor" type="button" onClick={() => onDoar(150)}>
              <span className="valor__icone">
                <img src={imgIconBowl} alt="" />
              </span>{" "}
              <span className="valor__numero">R$150</span>{" "}
              <span className="valor__texto">
                Um&nbsp;saco de&nbsp;ração&nbsp;- parte do&nbsp;consumo diário do&nbsp;abrigo
              </span>{" "}
              <span className="valor__cta">Doar R$150&nbsp;→</span>
            </button>
            <button className="valor" type="button" onClick={() => onDoar(180)}>
              <span className="valor__icone">
                <img src={imgIconPaws} alt="" />
              </span>{" "}
              <span className="valor__numero">R$180</span>{" "}
              <span className="valor__texto">
                3&nbsp;testes FIV/FELV para&nbsp;controle da&nbsp;nossa&nbsp;
                <span className="nowrap">mini-população</span>
              </span>{" "}
              <span className="valor__cta">Doar R$180&nbsp;→</span>
            </button>
            <button className="valor" type="button" onClick={() => onDoar(250)}>
              <span className="valor__icone">
                <img src={imgIconHeart} alt="" />
              </span>{" "}
              <span className="valor__numero">R$250</span>{" "}
              <span className="valor__texto">
                Atendimento veterinário especializado completo para&nbsp;1&nbsp;gato em&nbsp;tratamento
              </span>{" "}
              <span className="valor__cta">Doar R$250&nbsp;→</span>
            </button>
          </div>
          <p className="impacto__nota">Valores baseados em&nbsp;estimativas de&nbsp;mercado (valor&nbsp;social).</p>
        </div>
      </section>
    </>
  );
}
