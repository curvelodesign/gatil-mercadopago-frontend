import { useEffect } from "react";
import { Link } from "react-router-dom";
import imgLogoGreen from "@/assets/doacao/logo-green.webp";

export function TermosPage() {
  useEffect(() => {
    document.title = "Termos de Uso e Doação | Gatil Irmã Francisca";
  }, []);

  return (
    <>
      <header className="topo-documento">
        <Link to="/doar" aria-label="Gatil Irmã Francisca - voltar para a página de doação">
          <img src={imgLogoGreen} alt="Gatil Irmã Francisca" />
        </Link>
      </header>
      <main className="documento">
        <div className="container">
          <h1>Termos de&nbsp;Uso e&nbsp;Doação</h1>
          <p className="documento__data">Última atualização: 5&nbsp;de&nbsp;outubro de&nbsp;2026</p>

          <h2>1. Aceitação</h2>
          <p>
            Ao&nbsp;acessar este&nbsp;site ou&nbsp;fazer uma&nbsp;doação, você concorda com&nbsp;estes&nbsp;Termos.
            Se&nbsp;não&nbsp;concordar, pedimos que&nbsp;não&nbsp;utilize o&nbsp;site.
          </p>

          <h2 id="doacao">2. Sobre&nbsp;o&nbsp;site e&nbsp;a&nbsp;natureza da&nbsp;doação</h2>
          <p>
            Este&nbsp;site é&nbsp;mantido pelo&nbsp;Gatil Irmã Francisca (CNPJ&nbsp;
            <span className="nowrap">25.382.038/0001-05</span>) para&nbsp;informar sobre&nbsp;o&nbsp;trabalho
            do&nbsp;abrigo e&nbsp;viabilizar doações. Não&nbsp;é&nbsp;uma&nbsp;loja&nbsp;- nenhuma doação dá direito
            a&nbsp;produto ou&nbsp;serviço em&nbsp;troca. A&nbsp;doação é&nbsp;voluntária e&nbsp;espontânea.
          </p>
          <ul>
            <li>
              <strong>Dedutibilidade fiscal:</strong> o&nbsp;Gatil é&nbsp;uma&nbsp;ONG independente, sem&nbsp;título
              de&nbsp;Utilidade Pública ou&nbsp;OSCIP&nbsp;- por&nbsp;isso&nbsp;a&nbsp;doação não&nbsp;pode
              ser&nbsp;declarada como&nbsp;dedução no&nbsp;Imposto de&nbsp;Renda.
            </li>
            <li>
              <strong>Recorrência:</strong> este&nbsp;site processa apenas doações pontuais (uma&nbsp;única&nbsp;vez).
              Não&nbsp;há&nbsp;opção de&nbsp;doação recorrente nesta&nbsp;página.
            </li>
          </ul>

          <h2>3. Processamento e&nbsp;valores</h2>
          <p>
            O&nbsp;pagamento é&nbsp;processado pelo&nbsp;Mercado Pago, em&nbsp;ambiente criptografado. Aceitamos valor
            livre e&nbsp;valores sugeridos (atualmente R$20, R$50,&nbsp;R$100&nbsp;e&nbsp;R$200),
            sem&nbsp;valor&nbsp;mínimo.
          </p>

          <h2>4. Reembolso</h2>
          <p>
            Por&nbsp;ser&nbsp;uma&nbsp;doação voluntária já&nbsp;destinada ao&nbsp;cuidado diário dos&nbsp;gatos,
            doações não&nbsp;são&nbsp;reembolsáveis, exceto em&nbsp;caso de&nbsp;erro comprovado (ex.: cobrança
            duplicada por&nbsp;falha técnica do&nbsp;gateway). Nesses casos, entre&nbsp;em&nbsp;contato
            pelo&nbsp;Instagram{" "}
            <a href="https://www.instagram.com/gatilirmafrancisca" target="_blank" rel="noopener">
              @gatilirmafrancisca
            </a>{" "}
            ou&nbsp;pelo&nbsp;<span className="nowrap">e-mail</span>{" "}
            <a href="mailto:contato@gatilirmafrancisca.org">contato@gatilirmafrancisca.org</a>{" "}
            em&nbsp;até&nbsp;20&nbsp;dias após&nbsp;a&nbsp;doação.
          </p>

          <h2>5. Como&nbsp;usamos sua&nbsp;doação</h2>
          <p>
            Os&nbsp;recursos são&nbsp;usados no&nbsp;cuidado diário dos&nbsp;cerca de&nbsp;300&nbsp;gatos
            sob&nbsp;responsabilidade do&nbsp;Gatil: alimentação, tratamento veterinário, castração, vacinação
            e&nbsp;manutenção da&nbsp;estrutura. Publicamos comprovantes e&nbsp;relatórios mensalmente
            no&nbsp;Instagram.
          </p>

          <h2>6. Metas de&nbsp;arrecadação</h2>
          <p>
            Quando&nbsp;esta&nbsp;página apresenta uma&nbsp;meta de&nbsp;arrecadação, ela&nbsp;reflete
            uma&nbsp;necessidade real de&nbsp;custeio&nbsp;- e&nbsp;não&nbsp;é&nbsp;vinculante: a&nbsp;arrecadação
            continua mesmo após&nbsp;a&nbsp;meta ser&nbsp;atingida, pois o&nbsp;cuidado dos&nbsp;animais
            é&nbsp;contínuo.
          </p>

          <h2>7. Uso permitido do&nbsp;site</h2>
          <p>
            Não&nbsp;é&nbsp;permitido usar o&nbsp;site para&nbsp;fins ilegais ou&nbsp;fraudulentos, tentar acessar áreas
            restritas ou&nbsp;dados de&nbsp;outros usuários, ou&nbsp;reproduzir o&nbsp;conteúdo do&nbsp;site (textos,
            fotos, identidade visual, personagens da&nbsp;Turma do&nbsp;Gatil) para&nbsp;fins comerciais
            sem&nbsp;autorização.
          </p>

          <h2>8. Propriedade&nbsp;intelectual</h2>
          <p>
            Todo&nbsp;o&nbsp;conteúdo deste site&nbsp;- textos, fotos, identidade visual, personagens da&nbsp;Turma
            do&nbsp;Gatil (Chica, Mingau, Axé, Amelie, Fami e&nbsp;Acerola)&nbsp;- pertence ao&nbsp;Gatil Irmã Francisca
            ou&nbsp;é&nbsp;usado com&nbsp;autorização.
          </p>

          <h2>9. Links e&nbsp;serviços de&nbsp;terceiros</h2>
          <p>
            Este&nbsp;site se&nbsp;conecta a&nbsp;serviços de&nbsp;terceiros (Mercado&nbsp;Pago,&nbsp;Instagram).
            O&nbsp;Gatil não&nbsp;é&nbsp;responsável pelo&nbsp;conteúdo, disponibilidade ou&nbsp;política desses
            serviços, que&nbsp;têm&nbsp;termos&nbsp;próprios.
          </p>

          <h2>10. Limitação de&nbsp;responsabilidade</h2>
          <p>
            Fazemos o&nbsp;possível para&nbsp;manter o&nbsp;site disponível e&nbsp;as&nbsp;informações corretas,
            mas&nbsp;não&nbsp;garantimos disponibilidade ininterrupta nem&nbsp;ausência total de&nbsp;erros, inclusive
            falhas de&nbsp;terceiros (ex.: instabilidade&nbsp;do&nbsp;Mercado Pago) que&nbsp;impactem uma&nbsp;doação.
          </p>

          <h2>11. Lei aplicável e&nbsp;foro</h2>
          <p>
            Estes&nbsp;Termos são&nbsp;regidos pelas&nbsp;leis brasileiras. Fica eleito o&nbsp;foro da&nbsp;comarca
            de&nbsp;Salvador, BA, para&nbsp;dirimir eventuais controvérsias.
          </p>

          <h2>12. Contato</h2>
          <p>
            Dúvidas sobre&nbsp;estes&nbsp;Termos:&nbsp;Instagram{" "}
            <a href="https://www.instagram.com/gatilirmafrancisca" target="_blank" rel="noopener">
              @gatilirmafrancisca
            </a>{" "}
            ou&nbsp;<span className="nowrap">e-mail</span>{" "}
            <a href="mailto:contato@gatilirmafrancisca.org">contato@gatilirmafrancisca.org</a>.
          </p>
        </div>
      </main>
    </>
  );
}
