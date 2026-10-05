import { useEffect, useRef } from "react";
import imgCatAcerola from "@/assets/doacao/cat-acerola.webp";

/** Lembrete quando a pessoa vai sair da página (só no computador, uma vez por visita). */
export function JanelaSaida({ onDoar }: { onDoar: (valor?: number) => void }) {
  const janela = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (window.matchMedia("(max-width: 900px)").matches) return;
    let mostrou = false;
    const aoSair = (e: MouseEvent) => {
      if (mostrou || e.clientY > 0 || e.relatedTarget || document.querySelector("dialog[open]")) return;
      mostrou = true;
      janela.current?.showModal();
    };
    document.addEventListener("mouseout", aoSair);
    return () => document.removeEventListener("mouseout", aoSair);
  }, []);

  const doar = (valor?: number) => {
    janela.current?.close();
    onDoar(valor);
  };

  return (
    <dialog
      className="janela janela--centro"
      ref={janela}
      aria-labelledby="saida-titulo"
      onClick={(e) => {
        if (e.target === janela.current) janela.current?.close();
      }}
    >
      <img className="janela__gato" src={imgCatAcerola} alt="" aria-hidden="true" />
      <div className="janela__corpo">
        <button className="janela__fechar" type="button" aria-label="Fechar" onClick={() => janela.current?.close()}>
          ×
        </button>
        <h2 id="saida-titulo">
          Antes de&nbsp;ir, não&nbsp;esqueça: R$5&nbsp;garante 1&nbsp;dia de&nbsp;ração para&nbsp;1&nbsp;gato.
        </h2>
        <p className="janela__texto">Qualquer valor ajuda a&nbsp;manter o&nbsp;cuidado dos&nbsp;gatos do&nbsp;Gatil.</p>
        <button className="botao botao-laranja botao-bloco" type="button" onClick={() => doar(5)}>
          Doar R$5&nbsp;agora
        </button>
        <button className="link-botao janela__link" type="button" onClick={() => doar()}>
          Escolher outro&nbsp;valor
        </button>
      </div>
    </dialog>
  );
}
