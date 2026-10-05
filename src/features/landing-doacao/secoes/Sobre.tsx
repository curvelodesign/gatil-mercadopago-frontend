import { Carrossel } from "@/features/landing-doacao/Carrossel";
import { FOTOS_ANA_PAULA } from "@/features/landing-doacao/fotos";
import imgIconBowlOrelha from "@/assets/doacao/icon-bowl-orelha.webp";
import imgIconPaws from "@/assets/doacao/icon-paws.webp";
import imgIconYarnLaranja from "@/assets/doacao/icon-yarn-laranja.webp";

/** Sobre o Gatil, com o carrossel de fotos da Ana Paula e os cards de orelhinha. */
export function Sobre() {
  return (
    <>
      <section className="secao sobre" data-secao="sobre">
        <div className="container">
          <div className="sobre__grade">
            <div>
              <p className="rotulo">Sobre&nbsp;o&nbsp;Gatil</p>
              <h2 className="titulo-secao">Quem&nbsp;somos e&nbsp;o&nbsp;que&nbsp;fazemos todos&nbsp;os&nbsp;dias.</h2>
              <p>
                O&nbsp;Gatil Irmã Francisca é&nbsp;um&nbsp;abrigo independente em&nbsp;Salvador, Bahia. Cuidamos,
                todos&nbsp;os&nbsp;dias, de&nbsp;cerca de&nbsp;300&nbsp;gatos abandonados: comida, teto
                e&nbsp;acompanhamento diário da&nbsp;nossa&nbsp;turma.
              </p>
              <p>
                O&nbsp;nome vem da&nbsp;nossa&nbsp;origem: Irmã Francisca foi&nbsp;quem&nbsp;começou esse&nbsp;cuidado
                sozinha, antes de&nbsp;existir instituição, CNPJ ou&nbsp;equipe. O&nbsp;gesto dela virou
                o&nbsp;que&nbsp;somos hoje: um&nbsp;trabalho contínuo, mantido inteiramente por&nbsp;doação
                e&nbsp;por&nbsp;gente que&nbsp;separa um&nbsp;tempo para&nbsp;ajudar.
              </p>
              <p>
                Não&nbsp;trabalhamos mais&nbsp;com&nbsp;resgate de&nbsp;emergência por&nbsp;conta das&nbsp;dívidas
                que&nbsp;acumulamos ao&nbsp;longo desses anos em&nbsp;que&nbsp;a&nbsp;fome chegou antes da&nbsp;doação.
                Hoje, nosso&nbsp;trabalho é&nbsp;manter o&nbsp;cuidado de&nbsp;300&nbsp;vidas
                sob&nbsp;nossa&nbsp;responsabilidade&nbsp;- até&nbsp;que&nbsp;cada&nbsp;gato tenha um&nbsp;lar preparado
                para&nbsp;recebê-lo.
              </p>
              <blockquote className="citacao">
                <p>A&nbsp;gente não&nbsp;desiste, nunca desistiu, e&nbsp;com&nbsp;você, não&nbsp;vamos&nbsp;precisar</p>
                <cite>
                  <span className="coracao"></span>
                  <span>
                    Ana Paula de&nbsp;Sousa&nbsp;Farias,
                    <br />
                    presidente do&nbsp;Gatil
                  </span>
                </cite>
              </blockquote>
            </div>

            {/* Fotos da Ana Paula com os gatos: mesmo padrão do banner do topo (foto-real + data-foco), trocam a cada 3 segundos. */}
            <div className="fotos-moldura">
              <img className="adesivo adesivo-patas" src={imgIconPaws} alt="" />
              <Carrossel className="fotos" rotulo="Fotos da Ana Paula com os gatos do Gatil" fotos={FOTOS_ANA_PAULA} />
              <span className="adesivo coracao flutua adesivo-coracao"></span>
            </div>
          </div>

          <div className="trabalho">
            <h3>
              Conheça um&nbsp;pouco&nbsp;mais <wbr />
              do&nbsp;nosso&nbsp;trabalho:
            </h3>
            <div className="orelhas">
              <article className="orelha">
                <span className="orelha__icone">
                  <img src={imgIconBowlOrelha} alt="" />
                </span>
                <h4>Cuidado diário</h4>
                <p>
                  Comida, higiene e&nbsp;acompanhamento da&nbsp;saúde
                  dos&nbsp;nossos&nbsp;300&nbsp;residentes&nbsp;felinos.
                </p>
              </article>
              <article className="orelha orelha--laranja">
                <span className="orelha__icone">
                  <span className="coracao" aria-hidden="true"></span>
                </span>
                <h4>Adoção responsável</h4>
                <p>
                  Cada&nbsp;adoção é&nbsp;um&nbsp;compromisso pra&nbsp;vida toda. O&nbsp;gato só&nbsp;sai daqui
                  quando&nbsp;o&nbsp;lar&nbsp;- e&nbsp;ele&nbsp;- estiverem&nbsp;prontos.
                </p>
              </article>
              <article className="orelha orelha--escuro">
                <span className="orelha__icone">
                  <img src={imgIconYarnLaranja} alt="" />
                </span>
                <h4>Educação felina</h4>
                <p>
                  O&nbsp;que&nbsp;a&nbsp;gente aprende cuidando de&nbsp;centenas de&nbsp;gatos vira conteúdo
                  pra&nbsp;você cuidar melhor do&nbsp;seu.
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <svg className="onda onda--sobre-branco" viewBox="0 0 1440 96" preserveAspectRatio="none" aria-hidden="true">
        <path
          fill="#338358"
          d="M0,60 C160,10 320,10 480,48 C640,86 800,86 960,48 C1120,10 1280,10 1440,52 L1440,96 L0,96 Z"
        />
      </svg>
    </>
  );
}
