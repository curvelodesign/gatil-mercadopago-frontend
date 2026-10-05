import { useEffect } from "react";
import { Link } from "react-router-dom";
import { abrirPreferenciasCookies } from "@/lib/analytics/consentimento";
import imgLogoGreen from "@/assets/doacao/logo-green.webp";

export function PoliticaPrivacidadePage() {
  useEffect(() => {
    document.title = "Política de Privacidade | Gatil Irmã Francisca";
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
          <h1>Política de&nbsp;Privacidade</h1>
          <p className="documento__data">Última atualização: 5&nbsp;de&nbsp;outubro de&nbsp;2026</p>

          <h2>1. Sobre&nbsp;o&nbsp;Gatil</h2>
          <p>
            O&nbsp;Gatil Irmã Francisca (CNPJ&nbsp;<span className="nowrap">25.382.038/0001-05</span>)
            é&nbsp;uma&nbsp;ONG independente dedicada ao&nbsp;cuidado diário de&nbsp;gatos abandonados em&nbsp;Salvador,
            BA. Respeitamos sua&nbsp;privacidade e&nbsp;a&nbsp;proteção dos&nbsp;seus&nbsp;dados, em&nbsp;conformidade
            com&nbsp;a&nbsp;Lei Geral de&nbsp;Proteção de&nbsp;Dados{" "}
            <span className="nowrap">(LGPD&nbsp;-&nbsp;Lei&nbsp;nº 13.709/18)</span> e&nbsp;o&nbsp;Marco Civil
            da&nbsp;Internet (Lei&nbsp;nº&nbsp;12.965/14).
          </p>

          <h2>2. Quais&nbsp;dados&nbsp;coletamos</h2>
          <ul>
            <li>
              <strong>Ao&nbsp;fazer uma&nbsp;doação:</strong> nome e&nbsp;<span className="nowrap">e-mail</span>.
              O&nbsp;processamento do&nbsp;pagamento em&nbsp;si (dados de&nbsp;cartão,&nbsp;chave Pix) é&nbsp;feito
              pelo&nbsp;Mercado Pago&nbsp;- o&nbsp;Gatil não&nbsp;armazena nem&nbsp;tem&nbsp;acesso
              a&nbsp;essas&nbsp;informações sensíveis, só&nbsp;à&nbsp;confirmação
              de&nbsp;que&nbsp;a&nbsp;doação&nbsp;ocorreu.
            </li>
            <li>
              <strong>Ao&nbsp;navegar no&nbsp;site:</strong> páginas visitadas, tempo de&nbsp;permanência, dispositivo
              e&nbsp;origem do&nbsp;acesso, coletados via&nbsp;Google Analytics e&nbsp;Meta&nbsp;Pixel.
            </li>
            <li>
              <strong>Ao&nbsp;entrar em&nbsp;contato:</strong> se&nbsp;você nos&nbsp;escreve pelo&nbsp;Instagram
              ou&nbsp;pelo&nbsp;<span className="nowrap">e-mail</span>{" "}
              <a href="mailto:contato@gatilirmafrancisca.org">contato@gatilirmafrancisca.org</a>, guardamos
              essa&nbsp;troca como&nbsp;qualquer canal de&nbsp;atendimento&nbsp;guarda.
            </li>
          </ul>

          <h2>3. Com&nbsp;quem&nbsp;compartilhamos os&nbsp;dados</h2>
          <ul>
            <li>
              <strong>Mercado Pago</strong>&nbsp;- processamento do&nbsp;pagamento da&nbsp;doação.
            </li>
            <li>
              <strong>Meta (Instagram/Facebook)</strong>&nbsp;- via&nbsp;Pixel, para&nbsp;medir a&nbsp;eficácia
              de&nbsp;campanhas.
            </li>
            <li>
              <strong>Google Analytics</strong>&nbsp;- métricas de&nbsp;navegação no&nbsp;site.
            </li>
          </ul>
          <p>
            Não&nbsp;vendemos, alugamos ou&nbsp;compartilhamos seus&nbsp;dados para&nbsp;fins de&nbsp;marketing
            de&nbsp;terceiros fora dessas ferramentas.
          </p>

          <h2>4. Cookies</h2>
          <p>
            Este&nbsp;site usa cookies não&nbsp;essenciais (Meta&nbsp;Pixel,&nbsp;Google&nbsp;Analytics) para&nbsp;medir
            campanhas e&nbsp;navegação. Eles&nbsp;só&nbsp;são&nbsp;ativados depois do&nbsp;seu&nbsp;consentimento,
            através do&nbsp;banner de&nbsp;cookies exibido ao&nbsp;entrar no&nbsp;site. Você pode mudar sua&nbsp;escolha
            a&nbsp;qualquer momento pelo&nbsp;link{" "}
            <button className="link-documento" type="button" onClick={abrirPreferenciasCookies}>
              Gerenciar cookies
            </button>{" "}
            no&nbsp;rodapé.
          </p>

          <h2>5. Armazenamento e&nbsp;segurança</h2>
          <p>
            Seus&nbsp;dados ficam armazenados pelo&nbsp;tempo necessário à&nbsp;finalidade da&nbsp;coleta (ex.:
            registro&nbsp;contábil&nbsp;de&nbsp;doações) e&nbsp;são&nbsp;descartados de&nbsp;forma segura
            quando&nbsp;deixam de&nbsp;ser&nbsp;necessários. Dados de&nbsp;pagamento nunca passam
            pelos&nbsp;nossos&nbsp;servidores&nbsp;- são&nbsp;processados em&nbsp;ambiente criptografado
            do&nbsp;Mercado&nbsp;Pago.
          </p>

          <h2>6. Seus&nbsp;direitos&nbsp;(LGPD)</h2>
          <p>
            Você pode, a&nbsp;qualquer momento: confirmar se&nbsp;tratamos seus&nbsp;dados e&nbsp;acessá-los; corrigir
            dados incompletos; solicitar exclusão (exceto quando&nbsp;a&nbsp;lei exigir retenção, como&nbsp;registro
            contábil de&nbsp;doação); e&nbsp;revogar consentimento de&nbsp;navegação.
          </p>

          <h2>7. Canal de&nbsp;contato</h2>
          <p>
            Para&nbsp;qualquer assunto sobre&nbsp;seus&nbsp;dados:&nbsp;Instagram{" "}
            <a href="https://www.instagram.com/gatilirmafrancisca" target="_blank" rel="noopener">
              @gatilirmafrancisca
            </a>{" "}
            ou&nbsp;<span className="nowrap">e-mail</span>{" "}
            <a href="mailto:contato@gatilirmafrancisca.org">contato@gatilirmafrancisca.org</a>.
          </p>

          <h2>8. Atualizações</h2>
          <p>
            Esta&nbsp;política pode ser&nbsp;atualizada a&nbsp;qualquer momento. A&nbsp;data da&nbsp;última atualização
            estará sempre no&nbsp;topo da&nbsp;página.
          </p>
        </div>
      </main>
    </>
  );
}
