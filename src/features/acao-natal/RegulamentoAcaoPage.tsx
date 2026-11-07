import { useEffect, type ReactNode } from "react"
import { Link } from "react-router-dom"
import { ACAO as CONFIG, A, IMG } from "@/features/acao-natal/config"
import { semViuvas } from "@/features/acao-natal/semViuvas"

type RuleItem = {
  number: string
  text: string
  steps?: { number: string; text: string }[]
}

type SectionData = {
  number: number
  title: string
  items: RuleItem[]
  table?: [string, string][]
}

const keepTogether = (text: string) => {
  const shortWords = /(^|[\s(])(e|a|o|de|na|no|um|que|pra|por|do|da)\s+(?=\S)/gi
  return text.replace(shortWords, "$1$2 ").replace(shortWords, "$1$2 ")
}

// Item 5 acompanha o fluxo de compra no ar (ACAO.fluxoCompleto em config.ts).
// SECAO_5_COMPLETO é o texto aprovado para o fluxo de reserva de vários números.
const ACAO_FLUXO_COMPLETO: boolean = CONFIG.fluxoCompleto
const SECAO_5_ATUAL: SectionData =
{
    number: 5,
    title: "Como comprar e pagar",
    items: [
      {
        number: "5.1",
        text: "A compra é feita apenas pela página oficial da ação, em três passos:",
        steps: [
          { number: "1", text: "Pagamento: o participante paga R$ 100,00 por Pix ou cartão de crédito (em até 2x), processado pelo Mercado Pago. Cada pagamento dá direito a um número." },
          { number: "2", text: "Escolha: com o pagamento aprovado, o participante escolhe um número livre no quadro." },
          { number: "3", text: "Confirmação: o número passa a ser do participante e a confirmação é enviada para o e-mail informado." },
        ],
      },
      { number: "5.2", text: "Quem quiser mais de um número deve fazer uma compra para cada um." },
      { number: "5.3", text: "O titular do número é sempre quem fez a compra (dono do e-mail e do CPF usados). O participante pode presentear alguém com um número, mas, se ele for sorteado, o prêmio é pago a quem fez a compra." },
      { number: "5.4", text: "Se o participante pagar e não escolher o número na hora, recebe por e-mail o link para escolher. Ele tem até 20 dias a partir da compra para escolher. Depois desse prazo, o sistema atribui um número livre aleatório e avisa por e-mail. Os lembretes são enviados no dia da compra e 5, 10, 15 e 20 dias depois." },
    ],
  }
const SECAO_5_COMPLETO: SectionData =
{
    number: 5,
    title: "Como comprar e pagar",
    items: [
      {
        number: "5.1",
        text: "A compra é feita apenas pela página oficial da ação, em três passos:",
        steps: [
          { number: "1", text: "Escolha: o participante escolhe um ou mais números livres no quadro, ou pede números aleatórios." },
          { number: "2", text: "Pagamento: o pagamento é feito por Pix ou cartão de crédito (em até 2x), processado pelo Mercado Pago." },
          { number: "3", text: "Confirmação: com o pagamento aprovado, o número passa a ser do participante e a confirmação é enviada para o e-mail informado." },
        ],
      },
      { number: "5.2", text: "Os números escolhidos (até 10 por compra) ficam reservados por 15 minutos enquanto o participante escolhe a forma de pagamento. Gerado o pagamento, o Pix ou o link do cartão vale 30 minutos, e os números continuam reservados nesse período. Se o pagamento não for confirmado no prazo, a reserva é cancelada, os números voltam a ficar livres e é preciso iniciar a compra de novo. Se um pagamento for aprovado depois do prazo e algum número já tiver outro dono, o participante recebe por e-mail um link para escolher outro número livre (com até 20 dias para isso; depois, um número livre é sorteado para ele)." },
      { number: "5.3", text: "O titular do número é sempre quem fez a compra (dono do e-mail e do CPF usados). O participante pode presentear alguém com um número, mas, se ele for sorteado, o prêmio é pago a quem fez a compra." },
      { number: "5.4", text: "Compras feitas no sistema anterior: quem comprou quando o pagamento vinha antes da escolha recebeu um e-mail com o link para escolher o número. Essa pessoa tem até 20 dias a partir da compra para escolher. Depois desse prazo, o sistema atribui um número livre aleatório e avisa por e-mail. Os lembretes são enviados no dia da compra e 5, 10, 15 e 20 dias depois." },
    ],
  }

const sections: SectionData[] = [
  {
    number: 1,
    title: "Organizadora",
    items: [
      { number: "1.1", text: "A Ação Solidária de Natal é organizada pelo Gatil Irmã Francisca, associação sem fins lucrativos inscrita no CNPJ 25.382.038/0001-05, com endereço fiscal na Rua Jornalista Marcos Vita, 04, Salvador – BA." },
      { number: "1.2", text: "A responsável legal é Ana Paula de Sousa Farias, presidente da associação." },
      { number: "1.3", text: "Canais oficiais de contato: Instagram @gatilirmafrancisca e e-mail gatilirmafrancisca@gmail.com." },
      { number: "1.4", text: "Ao comprar um ou mais números, o participante declara que leu e aceita este regulamento." },
    ],
  },
  {
    number: 2,
    title: "Finalidade",
    items: [
      { number: "2.1", text: "A ação tem caráter beneficente. O valor arrecadado será usado para quitar a dívida acumulada com ração, remédios, granulado e limpeza que mantém os gatos do abrigo." },
      { number: "2.2", text: "A meta de arrecadação é de R$50.000,00." },
      { number: "2.3", text: "A prestação de contas será publicada no Instagram do Gatil após o sorteio." },
    ],
  },
  {
    number: 3,
    title: "Quem pode participar",
    items: [
      { number: "3.1", text: "Podem participar pessoas físicas maiores de 18 anos." },
      { number: "3.2", text: "Não é preciso morar no Brasil, mas o participante precisa ter CPF ativo e uma chave Pix pertencente a uma conta de sua titularidade, pois o prêmio só é pago dessa forma (item 8)." },
      { number: "3.3", text: "Integrantes da diretoria, voluntários e seus familiares também podem participar, nas mesmas condições de qualquer outro comprador." },
    ],
  },
  {
    number: 4,
    title: "Números, preço e período de vendas",
    table: [
      ["Quantidade de números", "500 (de 001 a 500)"],
      ["Preço por número", "R$ 100,00"],
      ["Limite por pessoa", "Sem limite"],
      ["Início das vendas", "27/07/2026"],
      ["Fim das vendas", "24/12/2026, às 23h59 (horário de Brasília), ou antes, se todos os números forem vendidos"],
    ],
    items: [
      { number: "4.1", text: "Cada número só pode ter um dono. Números já vendidos aparecem como indisponíveis no quadro da página." },
    ],
  },
  ACAO_FLUXO_COMPLETO ? SECAO_5_COMPLETO : SECAO_5_ATUAL,
  {
    number: 6,
    title: "Cancelamento e reembolso",
    items: [
      { number: "6.1", text: "Desistência: como a compra é feita pela internet, o participante pode desistir em até 7 dias corridos após a confirmação do pagamento, conforme o artigo 49 do Código de Defesa do Consumidor. O pedido deve ser feito pelo e-mail gatilirmafrancisca@gmail.com e só é aceito até o fim das vendas (24/12/2026, às 23h59)." },
      { number: "6.2", text: "O valor é devolvido integralmente, pelo mesmo meio de pagamento: Pix devolvido para a conta de origem; cartão estornado pelo Mercado Pago, com o crédito aparecendo conforme o calendário da operadora. O número volta a ficar livre." },
      { number: "6.3", text: "Adiamento: se o sorteio for adiado, os números continuam valendo para a nova data. Quem preferir pode pedir o reembolso integral em até 7 dias após o anúncio do adiamento." },
      { number: "6.4", text: "Cancelamento da ação: se o sorteio for cancelado, todos os participantes recebem o valor pago de volta, integralmente." },
      { number: "6.5", text: "Fora desses casos, não há reembolso, pois o valor é uma contribuição para a causa do abrigo." },
    ],
  },
  {
    number: 7,
    title: "Sorteio",
    items: [
      { number: "7.1", text: "O sorteio acontece em 25/12/2026, às 20h (horário de Brasília), com transmissão ao vivo no Instagram @gatilirmafrancisca." },
      { number: "7.2", text: "O número ganhador é sorteado pela plataforma sorteios.org, entre todos os 500 números (001 a 500), vendidos ou não. O sorteio acontece na data marcada mesmo que nem todos os números tenham sido vendidos. Os números não vendidos pertencem ao Gatil: se um deles for sorteado, o Gatil é o ganhador e o valor do prêmio fica com o abrigo, destinado à finalidade do item 2." },
      { number: "7.3", text: "Haverá um único número ganhador." },
      { number: "7.4", text: "Falha da plataforma: se a sorteios.org apresentar falha, o sorteio será feito em outra plataforma de sorteio online, anunciada ao vivo no momento da troca." },
      { number: "7.5", text: "Falha da transmissão: se a live no Instagram falhar, o sorteio será transmitido ao vivo pelo YouTube do Gatil, com o link divulgado nos stories do Instagram." },
    ],
  },
  {
    number: 8,
    title: "Prêmio",
    items: [
      { number: "8.1", text: "O prêmio é de R$10.000,00 (dez mil reais) em dinheiro, pago ao titular do número sorteado." },
      { number: "8.2", text: "Após o sorteio, o Gatil entra em contato com o ganhador pelo e-mail ou telefone informados na compra." },
      { number: "8.3", text: "Para receber, o ganhador deve enviar uma foto do RG ou da CNH para confirmar a identidade, e informar uma chave Pix cadastrada em uma conta de sua titularidade. O prêmio não é pago a terceiros." },
      { number: "8.4", text: "O pagamento é feito via Pix até 26/12/2026. Se o contato ou a confirmação de identidade só forem concluídos depois dessa data, o pagamento é feito assim que forem concluídos." },
      { number: "8.5", text: "O ganhador tem 30 dias corridos a partir do sorteio para responder ao contato do Gatil. Durante esse período, o Gatil tentará o contato repetidas vezes. Sem resposta até o fim do prazo, o direito ao prêmio se encerra e o valor fica com o Gatil, destinado à finalidade do item 2." },
      { number: "8.6", text: "Eventuais tributos incidentes sobre o prêmio seguem a legislação vigente." },
    ],
  },
  {
    number: 9,
    title: "Divulgação do ganhador",
    items: [
      { number: "9.1", text: "O número sorteado é anunciado ao vivo, durante a transmissão." },
      { number: "9.2", text: "O nome ou o @ do ganhador só serão divulgados se ele autorizar antes, por escrito (por e-mail ou mensagem). Sem autorização, o Gatil divulga apenas o número sorteado e a confirmação de que o prêmio foi pago." },
    ],
  },
  {
    number: 10,
    title: "Dados pessoais",
    items: [
      { number: "10.1", text: "Os dados informados na compra (nome, e-mail e telefone) são usados apenas para confirmar a compra, enviar avisos sobre a ação, realizar o sorteio e pagar o prêmio." },
      { number: "10.2", text: "O tratamento desses dados segue a Lei Geral de Proteção de Dados (Lei 13.709/2018) e a Política de Privacidade do Gatil, disponível na página da ação." },
      { number: "10.3", text: "Se a compra não for paga, os dados informados (nome, e-mail e telefone) são apagados em até 7 dias. Para limitar reservas automáticas, o site usa uma verificação anti-robô (Cloudflare Turnstile) e guarda só um código derivado do endereço IP, apagado junto com esses dados." },
    ],
  },
  {
    number: 11,
    title: "Disposições gerais",
    items: [
      { number: "11.1", text: "A compra de números não tem nenhuma relação com adoção de gatos. Para adotar, o interessado deve consultar o destaque \"Disponíveis\" no Instagram do Gatil e preencher o formulário de adoção no link da bio." },
      { number: "11.2", text: "Dúvidas e casos não previstos neste regulamento são resolvidos pela diretoria do Gatil, pelos canais do item 1.3." },
      { number: "11.3", text: "O Gatil pode corrigir este regulamento para esclarecer pontos ou ajustar datas. Qualquer alteração será publicada na página da ação e no Instagram do Gatil, sem prejuízo aos números já comprados." },
    ],
  },
]

function SectionLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <ol>
      {sections.map((section) => (
        <li key={section.number}>
          <a
            href={`#secao-${section.number}`}
            onClick={(e) => {
              e.preventDefault()
              onNavigate?.()
              document.getElementById(`secao-${section.number}`)?.scrollIntoView({ block: "start" })
            }}
          >
            <strong>{section.number}.</strong> {keepTogether(section.title)}
          </a>
        </li>
      ))}
    </ol>
  )
}

function Rule({ number, children }: { number: string; children: ReactNode }) {
  return (
    <li className="regulation-rule">
      <strong>{number}.</strong>
      <div>{children}</div>
    </li>
  )
}

export function RegulamentoAcaoPage() {
  useEffect(() => {
    document.title = "Regulamento · Ação Solidária de Natal do Gatil Irmã Francisca"
    window.scrollTo({ top: 0 })
  }, [])
  useEffect(() => semViuvas(".acao"), [])


  return (
    <div className="acao regulation-page">
      <header className="site-header regulation-header">
        <Link className="brand" to="/rifa" aria-label="Gatil Irmã Francisca">
          <img src={`${IMG}/logo-gatil-header-vermelho.png`} alt="Gatil Irmã Francisca" width={876} height={216} />
        </Link>
        <nav><Link className="header-link" to="/rifa">Página da ação</Link></nav>
      </header>

      <main className="regulation-main">
        <div className="regulation-hero">
          <Link className="button regulation-back" to="/rifa">← Voltar para a ação</Link>
          <h1>{keepTogether("Regulamento · Ação Solidária de Natal do Gatil Irmã Francisca")}</h1>
          <p>Atualizado em 05/11/2026</p>
        </div>

        <details className="regulation-mobile-index">
          <summary>{keepTogether("Ir para a seção")}</summary>
          <SectionLinks onNavigate={() => document.querySelector(".regulation-mobile-index")?.removeAttribute("open")} />
        </details>

        <div className="regulation-layout">
          <aside className="regulation-index" aria-label="Índice de seções">
            <h2>Seções</h2>
            <SectionLinks />
          </aside>

          <article className="regulation-content">
            {sections.map((section) => (
              <section id={`secao-${section.number}`} key={section.number}>
                <h2>{section.number}. {keepTogether(section.title)}</h2>
                {section.table && (
                  <div className="regulation-table-wrap">
                    <table>
                      <thead><tr><th>Item</th><th>Condição</th></tr></thead>
                      <tbody>
                        {section.table.map(([item, condition]) => (
                          <tr key={item}><td>{keepTogether(item)}</td><td>{keepTogether(condition)}</td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <ol className="regulation-rules">
                  {section.items.map((item) => (
                    <Rule number={item.number} key={item.number}>
                      <p>{keepTogether(item.text)}</p>
                      {item.steps && (
                        <ol className="regulation-steps">
                          {item.steps.map((step) => (
                            <Rule number={step.number} key={step.number}><p>{keepTogether(step.text)}</p></Rule>
                          ))}
                        </ol>
                      )}
                    </Rule>
                  ))}
                </ol>
              </section>
            ))}
          </article>
        </div>
      </main>

      <footer className="cane-strip-top regulation-footer">
        <div className="footer-top">
          <div><img src={`${A}/logo-gatil-verde.png`} alt="Gatil Irmã Francisca" /><img src={`${A}/acao-solidaria-rodape.png`} alt="Ação Solidária" /></div>
          <nav>
            <a href={CONFIG.links.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
            <Link to={CONFIG.links.doacao}>Página de doação</Link>
            <Link to={CONFIG.links.privacidade}>Política de Privacidade</Link>
            <Link to={CONFIG.links.regulamento}>Regulamento Ação</Link>
          </nav>
        </div>
        <h3>{keepTogether("Cuidado que continua, um gato de cada vez.")}</h3>
        <p>{keepTogether("Revelação em 25/12, ao vivo no @gatilirmafrancisca.")}</p>
        <hr />
        <div className="footer-base">
          <small>{keepTogether("Ação solidária do Gatil Irmã Francisca · CNPJ 25.382.038/0001-05 · Salvador, BA · Com CNPJ desde 2016 · Contato: ")}<a href={`mailto:${CONFIG.email}`}>{CONFIG.email}</a></small>
          <small>{keepTogether("Desenvolvido por ")}<a href="https://curvelo.art.br" target="_blank" rel="noreferrer">Curvelo</a>.</small>
        </div>
      </footer>
    </div>
  )
}
