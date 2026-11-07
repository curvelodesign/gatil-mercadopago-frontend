import { useEffect, useMemo, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { CheckoutAcao } from "@/features/acao-natal/CheckoutAcao"
import { CheckoutReserva } from "@/features/acao-natal/CheckoutReserva"
import { useAvailableNumbers } from "@/features/raffle/hooks/useAvailableNumbers"
import { ACAO, A, IMG } from "@/features/acao-natal/config"
import { semViuvas } from "@/features/acao-natal/semViuvas"
import { instalarComandoPixTeste } from "@/features/pix/pixTeste"

const pad = (n: number) => String(n).padStart(3, "0")

const ranges = [1, 101, 201, 301, 401]

const testimonials = [
  { tag: "Acompanha todo mês, inclusive os difíceis", text: "Pra nós que estamos aqui sempre acompanhando vocês, que vemos o sufoco de cada mês, essa notícia é um alívio tão bom... sei que é só uma parte de tudo que falta, mas é bom demais saber que avançaram nessa questão! ❤️", user: "miauverso6" },
  { tag: "Doou e chamou mais gente", text: "(...) mais tarde vou compartilhar o post de vocês ❤️ de 1 em 1, vocês vão chegar lá!", user: "agataylor" },
  { tag: "Chegou Dua Lipa, virou Amora", text: "Dua Lipa virou \"Amora\", nossa paixãozinha da casa. ❤️ Carinhosa, um chameguinho só e já completamente dona dos nossos corações! 🥹🐾", user: "stephaniegnovais" },
  { tag: "Adotou o Diamante Negro. Hoje ele atende por Banguela Snape", text: "Eu vendo o post com o Diamante Negro, agora Banguela Snape, encostado na minha perna 😍", user: "graci.braga" },
  { tag: "Adotou dois adultos de uma vez", text: "adotar um gatinho adulto é ótimo!!! eles já têm a personalidade formada. adotei Belinha e Guto no gatil, e são os maiores amores que eu poderia ter! 😍", user: "_dudafelice" },
  { tag: "Apoiadora", text: "Ajudarei 🙌 e o mínimo que eu posso fazer diante desse trabalho lindo", user: "calmiranda_carolina" },
]

const faqTop: [string, React.ReactNode][] = [
  ["Como o bilhete é sorteado?", <>O bilhete ganhador é sorteado pela plataforma sorteios.org. A revelação é ao vivo no Instagram do Gatil em 25/12, às 20h.</>],
  ["Pra onde vai o dinheiro?", <>Meta: R$ 50.000. Prestação de contas no Instagram após o sorteio.</>],
  ["E se nem todos os bilhetes forem vendidos?", <>O sorteio acontece em 25/12 do mesmo jeito, entre todos os 500 bilhetes. Os bilhetes que não forem vendidos pertencem ao Gatil: se um deles for sorteado, o valor do prêmio fica com o abrigo e vai para a causa.</>],
  ["Ganhei! E agora?", <>Depois da revelação, a gente entra em contato com o ganhador pelo telefone ou e-mail informado na compra. O prêmio é pago via Pix até 26/12, a partir do momento em que conseguimos falar com você.</>],
  ["Dá pra ajudar sem concorrer?", <>Sim! Doe qualquer valor na nossa <Link to={ACAO.links.doacao}>página de doação</Link>.</>],
]
const faqMore: [string, React.ReactNode][] = [
  ["Posso comprar mais de um bilhete?", ACAO.fluxoCompleto ? <>Pode, e na mesma compra: toque em até {ACAO.maxNumeros} bilhetes no quadro antes de pagar. Quer mais? É só fazer outra compra. Cada bilhete custa R$ 100, e cada um é uma chance a mais na revelação.</> : <>Pode. Cada pagamento vale um bilhete: depois de escolher o primeiro, é só voltar aqui e fazer outra compra. Cada bilhete custa R$ 100, e cada um é uma chance a mais na revelação.</>],
  ["Posso dar um bilhete de presente?", <>Pode. Compre com o seu e-mail e passe o bilhete pra quem você quiser. Se ele for sorteado, o prêmio é pago a quem fez a compra, e vocês se acertam.</>],
  ["Paguei e ainda não escolhi meu bilhete. O que eu faço?", <>Procure o e-mail que enviamos no dia da compra: ele traz o link para escolher. Você tem até 20 dias a partir da compra; se não escolher nesse prazo, o sistema sorteia um bilhete livre para você e avisa por e-mail. Os lembretes chegam no dia da compra e 5, 10, 15 e 20 dias depois.</>],
  ["Preciso comprar bilhete pra adotar um gato?", <>Não. A ação serve só para arrecadar dinheiro e não tem nenhuma ligação com adoção. Se você quer adotar, entre no nosso <a href={ACAO.links.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>, veja os gatos no destaque “Disponíveis” e clique no link da bio para preencher o formulário de adoção.</>],
  ["Ainda dá pra comprar?", <>Dá, sim. Enquanto tiver bilhete livre no quadro, as vendas continuam abertas, até 24/12, às 23h59.</>],
]

const gallery = [
  { caption: "Doação de ração", src: `${IMG}/galeria-hora-da-racao.webp`, alt: "Gato ao lado dos pacotes de ração do abrigo" },
  { caption: "Teste FIV/FeLV", src: `${IMG}/galeria-vets.webp`, alt: "Teste veterinário sendo preparado para um gato do Gatil" },
  { caption: "Negresco ganhou um lar", src: `${IMG}/galeria-negresco.webp`, alt: "Gato Negresco descansando em seu novo lar" },
  { caption: "Presidente da ONG", src: `${IMG}/galeria-nossa-equipe.webp`, alt: "Integrante da equipe cuidando de um gato no abrigo" },
  { caption: "Ala de filhotes", src: `${IMG}/galeria-ala-filhotes.webp`, alt: "Filhotes acolhidos na ala do abrigo" },
  { caption: "Ambiente do abrigo", src: `${IMG}/galeria-ambiente-abrigo.webp`, alt: "Gatos no ambiente interno do abrigo" },
]
const heroSlides = [
  { src: `${IMG}/carrossel-acao-solidaria-1.webp`, alt: "Gatos reunidos no pátio do abrigo" },
  { src: `${IMG}/carrossel-acao-solidaria-2.webp`, alt: "Gatos se alimentando no abrigo" },
  { src: `${IMG}/carrossel-acao-solidaria-3.webp`, alt: "Gato bebendo água no abrigo" },
  { src: `${IMG}/carrossel-acao-solidaria-4.webp`, alt: "Ambiente interno preparado para acolher os gatos do abrigo" },
  { src: `${IMG}/carrossel-acao-solidaria-5.webp`, alt: "Equipe preparando materiais para os cuidados veterinários" },
  { src: `${IMG}/carrossel-acao-solidaria-6.webp`, alt: "Dois gatos no ambiente do abrigo" },
  { src: `${IMG}/carrossel-acao-solidaria-7.webp`, alt: "Gatos descansando junto à área verde do abrigo" },
  { src: `${IMG}/carrossel-acao-solidaria-8.webp`, alt: "Gato descansando em uma toca de madeira" },
]

function countdown() {
  const now = new Date(); const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const xmas = new Date(now.getFullYear(), 11, 25)
  if (+today === +xmas) return { days: 0, today: true }
  if (today > xmas) xmas.setFullYear(xmas.getFullYear() + 1)
  return { days: Math.round((+xmas - +today) / 864e5), today: false }
}
const goTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })

/* ---------- peças decorativas ---------- */
const IgIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="17.3" cy="6.7" r="1.2" fill="currentColor" /></svg>
)
const Verified = () => (
  <svg className="verified" viewBox="0 0 24 24" width="16" height="16" role="img" aria-label="Comentário real do Instagram">
    <path fill="#0095f6" d="M12 1.5l2.6 1.9 3.2-.2 1 3.1 2.7 1.8-1 3.1 1 3.1-2.7 1.8-1 3.1-3.2-.2L12 22.5l-2.6-1.9-3.2.2-1-3.1-2.7-1.8 1-3.1-1-3.1 2.7-1.8 1-3.1 3.2.2z" />
    <path d="M7.6 12.3l2.9 2.9 5.9-6" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const Flake = ({ className = "", style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={`flake ${className}`} style={style} viewBox="-24 -24 48 48" aria-hidden="true">
    <g stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" fill="none">
      {[0, 60, 120].map((a) => (<g key={a} transform={`rotate(${a})`}><line x1="0" y1="-20" x2="0" y2="20" /><polyline points="-6,-15 0,-10 6,-15" /><polyline points="-6,15 0,10 6,15" /></g>))}
    </g>
  </svg>
)
function Snow({ count = 30 }: { count?: number }) {
  const flakes = useMemo(() => Array.from({ length: count }, (_, i) => ({
    left: (i * 37.7) % 100, size: 3 + ((i * 7) % 5), dur: 9 + ((i * 13) % 9), delay: -((i * 3.1) % 14), drift: ((i % 5) - 2) * 12,
  })), [count])
  return (
    <div className="snow" aria-hidden="true">
      {flakes.map((f, i) => (<i key={i} style={{ left: `${f.left}%`, width: f.size, height: f.size, animationDuration: `${f.dur}s`, animationDelay: `${f.delay}s`, ["--drift" as string]: `${f.drift}px` } as React.CSSProperties} />))}
    </div>
  )
}
/** Varal de luzes: cada trecho tem seu fio e sua lâmpada, então nunca desalinha */
function Garland({ className = "" }: { className?: string }) {
  const colors = ["#ff9d3b", "#1a5331", "#fb6161", "#fffde6"]
  return (
    <div className={`garland ${className}`} aria-hidden="true">
      {Array.from({ length: 48 }, (_, i) => (
        <span key={i} style={{ ["--c" as string]: colors[i % 4], ["--d" as string]: `${(i % 7) * -0.35}s` } as React.CSSProperties}>
          <svg viewBox="0 0 64 22" preserveAspectRatio="none"><path d="M0 2 Q32 22 64 2" fill="none" stroke="#1e1b1c" strokeWidth="2" /></svg>
          <b />
        </span>
      ))}
    </div>
  )
}
const Bow = () => (
  <svg className="bow" viewBox="0 0 60 40" aria-hidden="true">
    <g stroke="#1e1b1c" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
      <path d="M30 22 C22 4 4 6 6 18 C8 28 22 26 30 22Z" fill="#b0293b" />
      <path d="M30 22 C38 4 56 6 54 18 C52 28 38 26 30 22Z" fill="#b0293b" />
      <circle cx="30" cy="22" r="5" fill="#b0293b" />
    </g>
  </svg>
)
const GiftBow = ({ className = "" }: { className?: string }) => (
  <svg className={`decorative-bow ${className}`} viewBox="0 0 80 70" aria-hidden="true">
    <g stroke="#1F1A1A" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
      <path d="M35 34 22 67l12-6 8 8 2-34Z" fill="#B0293B" />
      <path d="m45 34 13 33-12-6-8 8-2-34Z" fill="#B0293B" />
      <path d="M40 35C31 13 5 10 6 28c1 14 21 17 34 7Z" fill="#B0293B" />
      <path d="M40 35c9-22 35-25 34-7-1 14-21 17-34 7Z" fill="#B0293B" />
      <path d="M36 31C29 23 20 20 12 24c6 1 14 6 20 13Z" fill="#8E1F2E" stroke="none" />
      <path d="M44 31c7-8 16-11 24-7-6 1-14 6-20 13Z" fill="#8E1F2E" stroke="none" />
      <path d="M15 22c5-5 12-4 17 1" fill="none" stroke="#D9485C" strokeWidth="3" />
      <path d="M65 22c-5-5-12-4-17 1" fill="none" stroke="#D9485C" strokeWidth="3" />
      <circle cx="40" cy="35" r="9" fill="#B0293B" />
      <path d="M35 31c3-3 7-3 10-1" fill="none" stroke="#D9485C" strokeWidth="2.5" />
    </g>
  </svg>
)
function Ornament({ n, color }: { n: number; color: string }) {
  return (<span className="ornament-step" style={{ ["--c" as string]: color } as React.CSSProperties}><i className="cap" /><b>{n}</b></span>)
}
/* ========================================================= */
export function AcaoNatalPage() {
  const [rangeStart, setRangeStart] = useState(1)
  const { takenNumbers, isLoading, error } = useAvailableNumbers()
  const [openFaq, setOpenFaq] = useState<string | null>(null)
  const [moreFaq, setMoreFaq] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [slide, setSlide] = useState(0)
  const [galleryDot, setGalleryDot] = useState(0)
  const heroTrackRef = useRef<HTMLDivElement>(null)
  const heroScrollTimerRef = useRef<number | undefined>(undefined)
  const galleryRef = useRef<HTMLDivElement>(null)
  const cd = countdown()
  // Fluxo completo: bilhetes escolhidos no quadro e comprados nesta visita
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [purchased, setPurchased] = useState<Set<number>>(new Set())
  const sold = useMemo(() => new Set([...takenNumbers, ...purchased]), [takenNumbers, purchased])
  const sorted = [...selected].sort((a, b) => a - b)
  const completo = ACAO.fluxoCompleto
  const toggle = (n: number) => {
    if (sold.has(n)) return
    // Até ACAO.maxNumeros por compra (o backend confere de novo)
    setSelected((cur) => { const next = new Set(cur); if (next.has(n)) next.delete(n); else if (next.size < ACAO.maxNumeros) next.add(n); return next })
  }
  const addRandom = (k: number) => {
    const pool = Array.from({ length: ACAO.totalNumeros }, (_, i) => i + 1).filter((n) => !sold.has(n) && !selected.has(n))
    const picks: number[] = []
    const vagas = Math.max(0, ACAO.maxNumeros - selected.size)
    for (let i = 0; i < Math.min(k, vagas) && pool.length; i++) picks.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0])
    if (!picks.length) return
    setRangeStart(Math.floor((picks[picks.length - 1] - 1) / 100) * 100 + 1)
    setSelected((cur) => new Set([...cur, ...picks]))
  }
  const free = ACAO.totalNumeros - sold.size
  const freeIn = (start: number) => Array.from({ length: 100 }, (_, i) => start + i).filter((n) => !sold.has(n)).length

  useEffect(() => { document.title = "Ação Solidária de Natal · Gatil Irmã Francisca" }, [])
  // gatilPixTeste("<PIX_TESTE_CHAVE>") no console liga o Pix de teste de R$ 0,01 (pixTeste.ts)
  useEffect(() => { instalarComandoPixTeste() }, [])
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 10)
    on(); window.addEventListener("scroll", on, { passive: true }); return () => window.removeEventListener("scroll", on)
  }, [])
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const t = window.setInterval(() => setSlide((s) => (s + 1) % heroSlides.length), 4000); return () => window.clearInterval(t)
  }, [])
  useEffect(() => {
    const track = heroTrackRef.current
    if (!track) return
    track.scrollTo({ left: track.clientWidth * slide, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })
  }, [slide])
  useEffect(() => semViuvas(".acao"), [])

  const BuyButton = ({ wide = false, children = <>Escolher meu bilhete · R$ 100</> }: { wide?: boolean; children?: React.ReactNode }) => (
    <button className={`button bowed ${wide ? "wide" : ""}`} onClick={() => goTo("participar")}>{children}<Bow /></button>
  )

  return (
    <div className="acao">
    <main>
      {/* 3.1 HEADER */}
      <header className={`site-header ${scrolled ? "scrolled" : ""}`} id="topo">
        <a className="brand" href="#inicio" aria-label="Gatil Irmã Francisca"><img src={`${IMG}/logo-gatil-header-vermelho.png`} alt="Gatil Irmã Francisca" width={876} height={216} /></a>
        <nav>
          <button type="button" className="header-link" onClick={() => goTo("escolher-numero")}>Como funciona <span aria-hidden="true">→</span></button>
          <a className="ig" href={ACAO.links.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram do Gatil"><IgIcon /></a>
          <button className="button small" onClick={() => goTo("participar")}><span className="desk">Escolher meu bilhete</span><span className="mob">Participar</span></button>
        </nav>
      </header>

      {/* 3.2 HERO */}
      <section className="hero" id="inicio">
        <Snow count={34} />
        <Garland className="hero-garland" />
        {["enfeite-1.svg", "enfeite-2.svg", "enfeite-3.svg", "enfeite-4.svg", "enfeite-5.svg", "enfeite-6.svg"].map((src, i) => (
          <div className={`ornament ornament-${i + 1}`} key={src}><img src={`${A}/${src}`} alt="" /><i className="ornament-shine" /><i className="twinkle twinkle-one">✦</i><i className="twinkle twinkle-two">✦</i></div>
        ))}
        <div className="hero-inner">
          <div className="hero-copy">
            <div className="pills"><span>Ação Solidária de Natal</span><span>10 anos de Gatil</span></div>
            <h1>Neste Natal, você tirou 300 gatos no amigo secreto.</h1>
            <p className="offer">R$ 100 por bilhete. <strong>R$ 10 mil</strong> para quem for revelado na noite de Natal.</p>
            <p className="support">Só 500 bilhetes · Cada um ajuda a quitar a dívida que manteve 300 gatos alimentados.</p>
            <div className="counter">
              <div className="xmas-ball"><i className="cap" /><i className="holly" /><i className="shine" />
                <b>{cd.today ? "🎄" : cd.days}</b>{!cd.today && <span>{cd.days === 1 ? "DIA" : "DIAS"}</span>}
              </div>
              <div>
                <h2>{cd.today ? "A revelação é hoje!" : "pra revelação"}</h2>
                <p>Sorteio em 25/12, às {ACAO.horario}, ao vivo no Instagram do Gatil</p>
                <div className="progress"><span style={{ width: `${(sold.size / ACAO.totalNumeros) * 100}%` }} /></div>
                <small><b>{sold.size}</b> bilhetes já têm dono · faltam <b>{free}</b> bilhetes</small>
              </div>
            </div>
            <p className="deadline">Vendas até {ACAO.prazo}</p>
            <div className="actions">
              <BuyButton />
              <button className="button button-outline" onClick={() => goTo("escolher-numero")}>Ver como funciona</button>
            </div>
          </div>
          <div className="hero-art">
            <div className="action-logo"><img src={`${IMG}/acao-solidaria-animada-fundo-claro.png`} alt="Ação Solidária" /></div>
            <div className="photo-frame" aria-label="Fotos do abrigo">
              <div className="slides-track" ref={heroTrackRef} onScroll={(e) => {
                const track = e.currentTarget
                window.clearTimeout(heroScrollTimerRef.current)
                heroScrollTimerRef.current = window.setTimeout(() => {
                  const current = Math.round(track.scrollLeft / Math.max(1, track.clientWidth))
                  if (current !== slide) setSlide(Math.min(heroSlides.length - 1, current))
                }, 80)
              }}>
                {heroSlides.map((photo, i) => (
                  <div key={photo.src} className={`slide ${i === slide ? "on" : ""}`}>
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      width={1200}
                      height={800}
                      loading={i === 0 ? "eager" : "lazy"}
                      decoding="async"
                      fetchPriority={i === 0 ? "high" : undefined}
                    />
                  </div>
                ))}
              </div>
              <button className="carousel-arrow prev" type="button" onClick={() => setSlide((slide - 1 + heroSlides.length) % heroSlides.length)} aria-label="Foto anterior">
                <svg viewBox="0 0 14 24" aria-hidden="true"><path d="M10.5 3 3.5 12l7 9" /></svg>
              </button>
              <button className="carousel-arrow next" type="button" onClick={() => setSlide((slide + 1) % heroSlides.length)} aria-label="Próxima foto">
                <svg viewBox="0 0 14 24" aria-hidden="true"><path d="m3.5 3 7 9-7 9" /></svg>
              </button>
              <div className="dots">{heroSlides.map((_, i) => <button key={i} className={i === slide ? "on" : ""} onClick={() => setSlide(i)} aria-label={`Foto ${i + 1}`} />)}</div>
            </div>
            <div className="cats">
              <div><img className="hat hat-1" src={`${A}/gorro.svg`} alt="" /><img src={`${A}/gata-chica.png`} alt="Gata Chica" /></div>
              <div><img className="hat hat-2" src={`${A}/gorro.svg`} alt="" /><img src={`${A}/gato-fami.png`} alt="Gato Fami" /></div>
              <div><img className="hat hat-3" src={`${A}/gorro.svg`} alt="" /><img src={`${A}/gato-axe.png`} alt="Gato Axé" /></div>
            </div>
          </div>
        </div>
      </section>

      {/* 3.3 FAIXA */}
      <div className="ticker"><div className="ticker-band"><div className="ticker-track">{Array.from({ length: 12 }, (_, i) => <span key={i}>R$ 10 MIL NA NOITE DE NATAL <b>★</b></span>)}</div></div></div>

      {/* 3.4 SELETOR */}
      <section className="section raffle" id="escolher-numero">
        <Flake className="f1 red" /><Flake className="f2 green" />
        <span className="label">Sua participação</span>
        <h2>Hora de tirar o seu bilhete</h2>
        <div className="raffle-intro">
          <ol className="steps">
            <li><Ornament n={1} color="#ff9d3b" /><p>{completo ? "Escolha um ou mais bilhetes. Sem ideia? O 🎲 escolhe por você." : "Pague R$ 100 no Pix, aqui mesmo no site, ou no cartão em até 2x."}</p></li>
            <li><Ornament n={2} color="#368c5e" /><p>{completo ? `Seus bilhetes ficam guardados por ${ACAO.minutosReserva} minutos. Pague no Pix ou no cartão em até 2x: o pagamento vale ${ACAO.minutosPagamento} minutos.` : "Com o pagamento confirmado, escolha o seu bilhete entre os livres do quadro."}</p></li>
            <li><Ornament n={3} color="#b0293b" /><p>Receba a confirmação por e-mail e acompanhe a revelação ao vivo em 25/12.</p></li>
          </ol>
          <div className="prize gift"><i className="ribbon-v" /><GiftBow className="gift-bow" />
            <span className="gift-kicker">O presente que volta</span>
            <strong>R$ 10.000</strong>
            <span>Só 500 bilhetes · Sorteio dia 25/12 mesmo se não vender tudo</span>
          </div>
        </div>
        <div className="raffle-layout" id="participar">
          {free <= 0 && !isLoading ? (
            <div className="soldout-card"><span>500 de 500</span><h3>Todos os bilhetes já encontraram dono.</h3><p>Obrigado por fazer parte desta noite de Natal com o Gatil.</p></div>
          ) : (
            <div className="number-board cane-thin">
              <div className="board-top">
                <div><h3>{isLoading ? "…" : free} <span>bilhetes esperando dono</span></h3><p>{completo ? `Toque em até ${ACAO.maxNumeros} bilhetes. Tocou de novo, desmarca.` : "Você escolhe o seu logo depois do pagamento. Aqui dá pra ver quais ainda estão livres."}</p></div>
                {completo && <button className="button green bowed" onClick={() => addRandom(1)}>Me surpreenda 🎲<Bow /></button>}
              </div>
              {error && <p className="board-error" role="alert">{error}</p>}
              <div className="tabs" role="tablist">
                {ranges.map((s) => <button key={s} role="tab" aria-selected={rangeStart === s} className={rangeStart === s ? "active" : ""} onClick={() => setRangeStart(s)}><b>{pad(s)}–{pad(s + 99)}</b><small>{isLoading ? "…" : freeIn(s)} livres</small></button>)}
              </div>
              <div className="number-grid" aria-busy={isLoading}>
                {Array.from({ length: 100 }, (_, i) => rangeStart + i).map((n) => (
                  completo ? (
                    <button key={n} aria-pressed={selected.has(n)} disabled={sold.has(n)} aria-label={sold.has(n) ? `${pad(n)} já tem dono` : pad(n)}
                      className={`raffle-number ${selected.has(n) ? "selected" : ""} ${sold.has(n) ? "owned" : ""}`} onClick={() => toggle(n)}>{pad(n)}</button>
                  ) : (
                    <span key={n} aria-label={sold.has(n) ? `${pad(n)} já tem dono` : `${pad(n)} livre`}
                      className={`raffle-number ${sold.has(n) ? "owned" : ""}`}>{pad(n)}</span>
                  )
                ))}
              </div>
              <div className="legend"><span><i />Livre</span>{completo && <span><i className="orange" />Escolhido por você</span>}<span><i className="taken" />Já tem dono</span></div>
            </div>
          )}
          {(free > 0 || isLoading) && (completo ? (
            <CheckoutReserva selected={sorted} onRemove={toggle} onRandom={addRandom}
              onTaken={(nums) => setSelected((cur) => { const next = new Set(cur); nums.forEach((n) => next.delete(n)); return next })}
              onComplete={(nums) => { setPurchased((p) => new Set([...p, ...nums])); setSelected(new Set()) }}
              onClear={() => setSelected(new Set())} />
          ) : <CheckoutAcao />)}
        </div>
      </section>

      {/* 3.5 POR QUE */}
      <section className="section story cream scallop-top">
        <Flake className="f1 red" /><Flake className="f2 green" />
        <img className="sleeping-cat" src={`${A}/gato-dormindo.png`} alt="Gato dormindo com gorro de Natal" />
        <span className="label">Por que uma ação solidária</span>
        <h2>A gente nunca deixou o pote vazio. A conta disso ainda está aberta.</h2>
        <p className="reading">Todo gato daqui já foi abandonado uma vez. Em 10 anos, quando a doação atrasava, a ração ia no cartão. Fome não espera. Hoje, parte do que você doa paga juros antes de chegar aos gatos.</p>
        <div className="pledge"><i className="pledge-ribbon" /><GiftBow className="pledge-bow" />
          <span className="pledge-kicker">Por isso a ação</span>
          <strong>A ação fecha essa conta, para que a próxima doação volte a ser ração, remédio e cuidado.</strong>
        </div>
        <div className="gallery" ref={galleryRef} onScroll={(e) => { const el = e.currentTarget; setGalleryDot(Math.round(el.scrollLeft / Math.max(1, el.scrollWidth - el.clientWidth) * (gallery.length - 1))) }}>
          {gallery.map((photo) => <figure key={photo.src}><div className="gallery-photo"><img src={photo.src} alt={photo.alt} width={1200} height={900} loading="lazy" decoding="async" /></div><figcaption>{photo.caption}</figcaption></figure>)}
        </div>
        <div className="gallery-dots" aria-hidden="true">{gallery.map((_, i) => <i key={i} className={i === galleryDot ? "on" : ""} />)}</div>
        <div className="goal">
          <div className="goal-top"><span className="label">Nossa meta</span><b>Meta: {ACAO.meta}</b></div>
          <div className="goal-bar"><span style={{ width: `${(sold.size / ACAO.totalNumeros) * 100}%` }} /></div>
          <p><b>R$ {(sold.size * 100).toLocaleString("pt-BR")}</b> arrecadados com <b>{sold.size}</b> bilhetes · faltam <b>{free}</b></p>
        </div>
        <div className="actions centered">
          <BuyButton />
          <Link className="button button-outline" to={ACAO.links.doacao}>Prefiro doar sem concorrer</Link>
        </div>
      </section>

      {/* 3.6 PROVA SOCIAL */}
      <section className="section social red scallop-top" id="quem-participa">
        <Garland className="under-scallop" />
        <Flake className="f1 cr" /><Flake className="f2 cr" /><Flake className="f3 cr" />
        <span className="label light">Quem já faz parte</span>
        <h2>Quem conhece o Gatil de perto costuma ficar.</h2>
        <p className="intro">Adotantes, doadores de todo mês e gente que confere cada prestação de contas. E {sold.size} bilhetes desta ação já têm dono.</p>
        <div className="ig-grid">
          {testimonials.map((t) => (
            <article className="ig-card cane" key={t.user + t.tag}>
              <header><span className="avatar">{t.user.replace(/[^a-z]/gi, "").slice(0, 1).toUpperCase() || "?"}</span>
                <p>@{t.user}</p><Verified /><span className="from-ig"><IgIcon /></span></header>
              <b className="tag">{t.tag}</b><p>{t.text}</p>
            </article>
          ))}
        </div>
        <blockquote className="trust-quote">“Transparência com responsabilidade 👏”<small>@nesle.maia</small></blockquote>
        <a className="button button-light" href={ACAO.links.instagram} target="_blank" rel="noopener noreferrer"><IgIcon /> Ver o Gatil no Instagram · @gatilirmafrancisca</a>
        <ul className="seals">
          <li><b>CNPJ</b>25.382.038/0001-05</li><li><b>Desde 2016</b>com CNPJ ativo</li><li><b>10 anos</b>cuidando de gatos</li><li><b>Prestação de contas</b>aberta no Instagram</li>
        </ul>
        <BuyButton>Escolher meu bilhete e <br /> entrar pra essa turma</BuyButton>
      </section>

      {/* 3.7 FAQ */}
      <section className="section faq cream scallop-top cane-strip-top" id="duvidas">
        <Flake className="f1 red" /><Flake className="f2 green" />
        <span className="label">Tire suas dúvidas</span>
        <h2>Antes de tirar o seu bilhete</h2>
        <div className="faq-list">
          {[...faqTop, ...(moreFaq ? faqMore : [])].map(([q, a]) => (
            <div className={`faq-item ${openFaq === q ? "open" : ""}`} key={q}>
              <button aria-expanded={openFaq === q} onClick={() => setOpenFaq(openFaq === q ? null : q)}><span>{q}</span><i className="faq-ball">+</i></button>
              <div><p>{a}</p></div>
            </div>
          ))}
        </div>
        {!moreFaq && <button className="button button-outline" onClick={() => setMoreFaq(true)}>Ver mais perguntas</button>}
        <p className="faq-foot">Ainda com dúvida? Fale com a gente no <a href={ACAO.links.instagram} target="_blank" rel="noopener noreferrer">Instagram</a> ou pelo e-mail <a href={`mailto:${ACAO.email}`}>{ACAO.email}</a> · <Link to={ACAO.links.regulamento}>Regulamento Ação</Link>.</p>
        <BuyButton />
      </section>

      {/* 3.8 CTA FINAL */}
      <section className="closing scallop-top">
        <Garland className="under-scallop" /><Snow count={24} />
        <div className="closing-logo"><img src={`${IMG}/acao-solidaria-animada-fundo-verde.png`} alt="Ação Solidária" /></div>
        <div className="closing-copy">
          <h2>Faltam <strong>{free}</strong> bilhetes pra fechar essa conta. Um deles pode ser o seu.</h2>
          <BuyButton />
          <p className="deadline">Vendas até {ACAO.prazo}</p>
        </div>
      </section>

      {/* 3.9 RODAPÉ */}
      <footer className="cane-strip-top">
        <div className="footer-top">
          <div><img src={`${A}/logo-gatil-verde.png`} alt="Gatil Irmã Francisca" /><img src={`${A}/acao-solidaria-rodape.png`} alt="Ação Solidária" /></div>
          <nav><a href={ACAO.links.instagram} target="_blank" rel="noopener noreferrer">Instagram</a><Link to={ACAO.links.doacao}>Página de doação</Link><Link to={ACAO.links.privacidade}>Política de Privacidade</Link><Link to={ACAO.links.regulamento}>Regulamento Ação</Link></nav>
        </div>
        <h3>Cuidado que continua, um gato de cada vez.</h3>
        <p>Revelação em 25/12, ao vivo no @gatilirmafrancisca.</p>
        <hr />
        <div className="footer-base">
          <small>Ação solidária do Gatil Irmã Francisca · CNPJ 25.382.038/0001-05 · Salvador, BA · Com CNPJ desde 2016 · Contato: <a href={`mailto:${ACAO.email}`}>{ACAO.email}</a></small>
          <small>Desenvolvido por <a href="https://curvelo.art.br" target="_blank" rel="noreferrer">Curvelo</a> e <a href="https://www.linkedin.com/in/daniel-vasconcelos-7bb1a5274/" target="_blank" rel="noreferrer">daniel-vasconcelos</a>.</small>
        </div>
      </footer>

      {completo && selected.size > 0 && (
        <button className="selection-bar" onClick={() => document.querySelector(".cart")?.scrollIntoView({ behavior: "smooth", block: "start" })}>
          {selected.size} {selected.size === 1 ? "bilhete" : "bilhetes"} · R$ {(selected.size * 100).toLocaleString("pt-BR")} · <b>Continuar ↓</b>
        </button>
      )}
    </main>
    </div>
  )
}
