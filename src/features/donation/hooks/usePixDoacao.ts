import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { consultarStatusPix } from "@/lib/api/doacao";
import { registrarDoacaoConcluida } from "@/lib/analytics/rastreamento";
import type { PixCriado } from "@/features/donation/types";

export type EtapaPix = "aguardando" | "aprovado" | "expirado";

/** Intervalo entre consultas de status enquanto o Pix está pendente. */
export const INTERVALO_CONSULTA_MS = 4000;
/** Tempo mostrando "Sua doação chegou!" antes de ir pro agradecimento. */
const PAUSA_APROVADO_MS = 1800;

/**
 * Acompanha um Pix gerado na janela de doação: consulta o status no backend
 * enquanto a aba está visível (e na hora em que a pessoa volta do app do
 * banco), conta o tempo até expirar e, quando aprova, registra a doação e
 * leva pra página de agradecimento.
 */
export function usePixDoacao(pix: PixCriado | null, valor: number | null) {
  const navigate = useNavigate();
  const [etapa, setEtapa] = useState<EtapaPix>("aguardando");
  const [agora, setAgora] = useState(() => Date.now());
  const concluiu = useRef(false);

  // Um Pix novo recomeça do zero
  useEffect(() => {
    setEtapa("aguardando");
    setAgora(Date.now());
    concluiu.current = false;
  }, [pix?.paymentId]);

  // Relógio da expiração
  const fim = pix ? Date.parse(pix.expiraEm) : NaN;
  const segundosRestantes = Number.isFinite(fim) ? Math.max(0, Math.floor((fim - agora) / 1000)) : null;

  useEffect(() => {
    if (!pix || etapa !== "aguardando") return;
    const id = window.setInterval(() => setAgora(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [pix, etapa]);

  useEffect(() => {
    if (pix && etapa === "aguardando" && segundosRestantes === 0) setEtapa("expirado");
  }, [pix, etapa, segundosRestantes]);

  // Consulta do status
  useEffect(() => {
    if (!pix || etapa !== "aguardando") return;
    let ativo = true;

    async function consultar() {
      if (!pix || document.visibilityState !== "visible") return;
      try {
        const status = await consultarStatusPix(pix.paymentId, pix.rastreioId);
        if (!ativo || concluiu.current) return;
        if (status === "APROVADO") {
          concluiu.current = true;
          if (valor) registrarDoacaoConcluida(valor, pix.rastreioId);
          setEtapa("aprovado");
          window.setTimeout(() => navigate("/doar/pagamento-aprovado"), PAUSA_APROVADO_MS);
        } else if (status === "EXPIRADO" || status === "CANCELADO") {
          setEtapa("expirado");
        }
      } catch {
        // Falha pontual de rede: a próxima consulta tenta de novo
      }
    }

    consultar();
    const id = window.setInterval(consultar, INTERVALO_CONSULTA_MS);
    const aoVoltarParaAba = () => {
      if (document.visibilityState === "visible") consultar();
    };
    document.addEventListener("visibilitychange", aoVoltarParaAba);

    return () => {
      ativo = false;
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", aoVoltarParaAba);
    };
  }, [pix, etapa, valor, navigate]);

  return { etapa, segundosRestantes };
}
