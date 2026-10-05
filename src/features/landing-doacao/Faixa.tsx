import { useEffect, useRef } from "react";

const TEXTO = "100% Sustentado por doações";

/**
 * Faixa inclinada que corre. Anda pela margem do trilho (e não por transform)
 * para o navegador redesenhar o texto já inclinado, sem serrilhar; pausa fora da tela.
 */
export function Faixa() {
  const trilho = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = trilho.current;
    if (!el) return;
    const devagar = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const velocidade = devagar ? 22 : 48; // pixels por segundo
    let deslocamento = 0;
    let antes = performance.now();
    let visivel = true;
    let quadro = 0;

    const observador = new IntersectionObserver(([e]) => {
      visivel = e.isIntersecting;
    });
    observador.observe(el);

    const andar = (agora: number) => {
      if (visivel) {
        const metade = el.scrollWidth / 2; // o conteúdo é repetido duas vezes
        deslocamento = (deslocamento + (velocidade * (agora - antes)) / 1000) % metade;
        el.style.marginLeft = `${-deslocamento.toFixed(1)}px`;
      }
      antes = agora;
      quadro = requestAnimationFrame(andar);
    };
    quadro = requestAnimationFrame(andar);
    return () => {
      cancelAnimationFrame(quadro);
      observador.disconnect();
    };
  }, []);

  const item = (
    <div className="faixa__item">
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className="faixa__frase">
          {TEXTO} <span className="coracao" />
        </span>
      ))}
    </div>
  );

  return (
    <div className="faixa-moldura">
      <div className="faixa">
        <p className="sr-only">{TEXTO}</p>
        <div className="faixa__trilho" ref={trilho} aria-hidden="true">
          {item}
          {item}
        </div>
      </div>
    </div>
  );
}
