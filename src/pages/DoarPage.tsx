import { useEffect, useState } from "react";
import { Topo } from "@/features/landing-doacao/secoes/Topo";
import { Meta } from "@/features/landing-doacao/secoes/Meta";
import { Sobre } from "@/features/landing-doacao/secoes/Sobre";
import { Impacto } from "@/features/landing-doacao/secoes/Impacto";
import { Confianca } from "@/features/landing-doacao/secoes/Confianca";
import { Chamada } from "@/features/landing-doacao/secoes/Chamada";
import { Turma } from "@/features/landing-doacao/secoes/Turma";
import { Destino } from "@/features/landing-doacao/secoes/Destino";
import { Acompanhe } from "@/features/landing-doacao/secoes/Acompanhe";
import { Perguntas } from "@/features/landing-doacao/secoes/Perguntas";
import { BarraDoacao } from "@/features/landing-doacao/BarraDoacao";
import { JanelaDoacao } from "@/features/landing-doacao/JanelaDoacao";
import { JanelaSaida } from "@/features/landing-doacao/JanelaSaida";

// Os textos usam espaço inquebrável (&nbsp;) depois de palavras curtas e números,
// para nenhuma linha terminar em "a", "de", "com", "300"... Ao editar um texto,
// mantenha esse cuidado.
export function DoarPage() {
  const [doacao, setDoacao] = useState<{ aberta: boolean; valor?: number }>({ aberta: false });
  const abrirDoacao = (valor?: number) => setDoacao({ aberta: true, valor });

  useEffect(() => {
    document.title = "Gatil Irmã Francisca - Ajude a cuidar de 300 gatos";
  }, []);

  return (
    <>
      <Topo onDoar={abrirDoacao} />
      <Meta onDoar={abrirDoacao} />
      <Sobre />
      <Impacto onDoar={abrirDoacao} />
      <Confianca />
      <Chamada onDoar={abrirDoacao} />
      <Turma onDoar={abrirDoacao} />
      <Destino onDoar={abrirDoacao} />
      <Acompanhe />
      <Perguntas onDoar={abrirDoacao} />
      <BarraDoacao onDoar={() => abrirDoacao()} escondida={doacao.aberta} />
      <JanelaDoacao aberta={doacao.aberta} valorInicial={doacao.valor} onFechar={() => setDoacao({ aberta: false })} />
      <JanelaSaida onDoar={abrirDoacao} />
    </>
  );
}
