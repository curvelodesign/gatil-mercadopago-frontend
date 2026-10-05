import { useEffect, useState } from "react";
import type { Foto } from "@/features/landing-doacao/fotos";

/** Fotos que trocam sozinhas a cada 3 segundos, com fade, no mesmo lugar. */
export function Carrossel({ className, rotulo, fotos }: { className: string; rotulo: string; fotos: Foto[] }) {
  const [ativa, setAtiva] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setAtiva((atual) => (atual + 1) % fotos.length), 3000);
    return () => window.clearInterval(timer);
  }, [fotos.length]);

  return (
    <section className={className} aria-roledescription="carrossel" aria-label={rotulo}>
      {fotos.map((foto, i) => (
        <div key={foto.src} className={i === ativa ? "fotos__slide ativo" : "fotos__slide"}>
          <img
            className="foto-real"
            src={foto.src}
            alt={foto.alt}
            style={{ objectPosition: foto.foco }}
            // a foto atual e a próxima já ficam carregadas: a troca nunca mostra moldura vazia
            loading={i === ativa || i === (ativa + 1) % fotos.length ? "eager" : "lazy"}
            decoding="async"
          />
        </div>
      ))}
      <div className="fotos__pontos" aria-hidden="true">
        {fotos.map((foto, i) => (
          <i key={foto.src} className={i === ativa ? "ativo" : undefined} />
        ))}
      </div>
    </section>
  );
}
