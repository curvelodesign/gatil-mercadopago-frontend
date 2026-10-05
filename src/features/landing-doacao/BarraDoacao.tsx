import { useEffect, useState } from "react";

/**
 * Barra fixa: aparece depois do topo e some enquanto o card da meta está na tela
 * ou enquanto a janela de doação está aberta.
 */
export function BarraDoacao({ onDoar, escondida }: { onDoar: () => void; escondida: boolean }) {
  const [passouDoTopo, setPassouDoTopo] = useState(false);
  const [metaNaTela, setMetaNaTela] = useState(false);

  useEffect(() => {
    const aoRolar = () => setPassouDoTopo(window.scrollY > window.innerHeight * 0.6);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    const meta = document.querySelector(".meta__cartao");
    const observador = new IntersectionObserver(([e]) => setMetaNaTela(e.isIntersecting), { threshold: 0.1 });
    if (meta) observador.observe(meta);
    return () => {
      window.removeEventListener("scroll", aoRolar);
      observador.disconnect();
    };
  }, []);

  const visivel = passouDoTopo && !metaNaTela && !escondida;

  return (
    <div className={visivel ? "barra visivel" : "barra"} aria-hidden={!visivel}>
      <span className="coracao" aria-hidden="true" />
      <div className="barra__texto">
        <strong>Ajude a&nbsp;alimentar 300&nbsp;gatos</strong>
        <span>Qualquer valor ajuda&nbsp;· doação&nbsp;segura</span>
      </div>
      <button className="botao botao-laranja" type="button" onClick={onDoar} tabIndex={visivel ? 0 : -1}>
        DOAR AGORA
      </button>
    </div>
  );
}
