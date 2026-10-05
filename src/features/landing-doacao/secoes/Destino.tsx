import imgCatChicaDeitada from "@/assets/doacao/cat-chica-deitada.webp";

/** Para onde vai sua doação (sem você / com você). */
export function Destino({ onDoar }: { onDoar: (valor?: number) => void }) {
  return (
    <>
      <section className="secao destino" data-secao="destino">
        <div className="container">
          <h2 className="titulo-secao titulo-secao--escuro">Para&nbsp;onde&nbsp;vai&nbsp;sua&nbsp;doação</h2>
          <div className="destino__grade">
            <div className="bloco bloco--sem">
              <h3>Sem&nbsp;você</h3>
              <ul>
                <li>Sem&nbsp;doação, não&nbsp;temos como&nbsp;alimentar, muito&nbsp;menos cuidar dessas&nbsp;vidas.</li>
                <li>Sem&nbsp;doação, as&nbsp;dívidas de&nbsp;meses anteriores continuam crescendo, com&nbsp;juros.</li>
                <li>
                  Sem&nbsp;doação, não&nbsp;tem&nbsp;verba pública nem&nbsp;plano B: cada&nbsp;real vem
                  de&nbsp;quem&nbsp;decide&nbsp;ajudar.
                </li>
              </ul>
            </div>
            <div className="bloco bloco--com">
              <img className="adesivo gato-cima" src={imgCatChicaDeitada} alt="" />
              <h3>Com&nbsp;você</h3>
              <ul>
                <li>
                  <span className="coracao"></span>Com&nbsp;você, os&nbsp;cerca de&nbsp;300&nbsp;gatos do&nbsp;Gatil
                  podem comer e&nbsp;serem&nbsp;cuidados.
                </li>
                <li>
                  <span className="coracao"></span>Com&nbsp;você, o&nbsp;trabalho que&nbsp;a&nbsp;Irmã Francisca começou
                  continua de&nbsp;pé, ajudando quem&nbsp;mais&nbsp;precisa.
                </li>
                <li>
                  <span className="coracao"></span>Com&nbsp;você, o&nbsp;Gatil chega mais&nbsp;perto de&nbsp;quitar
                  seus&nbsp;passivos adquiridos ao&nbsp;longo dos&nbsp;anos&nbsp;- o&nbsp;maior objetivo
                  da&nbsp;instituição pros&nbsp;próximos 12&nbsp;meses.
                </li>
              </ul>
              <button className="botao botao-laranja botao-bloco" type="button" onClick={() => onDoar()}>
                Quero fazer parte&nbsp;disso
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
