/** Perguntas frequentes. */
export function Perguntas({ onDoar }: { onDoar: (valor?: number) => void }) {
  return (
    <>
      <section className="secao faq recorte-cima recorte-cima--creme-claro" data-secao="faq">
        <div className="container">
          <p className="rotulo">Tire suas&nbsp;dúvidas</p>
          <h2 className="titulo-secao titulo-secao--escuro">Perguntas Frequentes</h2>
          <div className="faq__lista">
            <details className="faq__item" name="faq">
              <summary>A&nbsp;doação é&nbsp;segura?</summary>
              <p>
                Sim! O&nbsp;pagamento é&nbsp;processado via&nbsp;Mercado Pago, em&nbsp;ambiente criptografado.
                O&nbsp;Gatil Irmã Francisca opera com&nbsp;CNPJ <span className="nowrap">25.382.038/0001-05</span>.
              </p>
            </details>
            <details className="faq__item" name="faq">
              <summary>Existe valor mínimo para&nbsp;doar?</summary>
              <p>
                Não. A&nbsp;página aceita valor livre, além das&nbsp;faixas sugeridas de&nbsp;R$20, R$50,
                R$100&nbsp;e&nbsp;R$200.
              </p>
            </details>
            <details className="faq__item" name="faq">
              <summary>Posso ajudar de&nbsp;outra forma além da&nbsp;doação?</summary>
              <p>
                Sim: adote de&nbsp;forma responsável, seja voluntário(a), ofereça lar temporário, proponha
                uma&nbsp;parceria ou&nbsp;ajude divulgando o&nbsp;trabalho do&nbsp;Gatil. Pra&nbsp;voluntariado
                ou&nbsp;parceria, o&nbsp;contato é&nbsp;sempre pelas&nbsp;redes&nbsp;oficiais.
              </p>
            </details>
          </div>
          <div className="faq__cta">
            <button className="botao botao-laranja" type="button" onClick={() => onDoar()}>
              Quero Ajudar o&nbsp;Gatil
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
