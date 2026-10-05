import imgFotoGatoChamada from "@/assets/doacao/foto-gato-chamada.webp";

/** Faixa "Toda doação conta", com a foto do gato de fundo. */
export function Chamada({ onDoar }: { onDoar: (valor?: number) => void }) {
  return (
    <>
      <section className="secao chamada recorte-cima recorte-cima--creme" data-secao="chamada">
        <div className="chamada__foto">
          <img src={imgFotoGatoChamada} alt="Gato do Gatil Irmã Francisca deitado entre as plantas" />
        </div>
        <div className="container">
          <div className="chamada__cartao">
            <span className="coracao chamada__coracao" aria-hidden="true"></span>
            <p className="rotulo">Toda&nbsp;doação&nbsp;conta</p>
            <h2 className="chamada__titulo">
              O&nbsp;que&nbsp;falta pra&nbsp;fechar o&nbsp;mês sem&nbsp;dívida nova cabe na&nbsp;sua&nbsp;doação.
              Qualquer valor ajuda a&nbsp;chegar&nbsp;lá.
            </h2>
            <button className="botao botao-verde" type="button" onClick={() => onDoar()}>
              Quero Ajudar o&nbsp;Gatil
            </button>
          </div>
        </div>
        {/* Morro que leva à seção da Turma */}
        <div className="onda-gato" aria-hidden="true">
          <svg className="onda" viewBox="0 0 1440 96" preserveAspectRatio="none">
            <path fill="#1a5331" d="M0,70 C240,50 480,10 720,10 C960,10 1200,50 1440,70 L1440,96 L0,96 Z" />
          </svg>
        </div>
      </section>
    </>
  );
}
