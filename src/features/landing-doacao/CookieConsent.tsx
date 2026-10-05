import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { aoAbrirPreferencias, lerConsentimento, salvarConsentimento } from "@/lib/analytics/consentimento";

/** Aviso de cookies e janela de preferências. Nada é rastreado antes do aceite. */
export function CookieConsent() {
  const [avisoAberto, setAvisoAberto] = useState(() => !lerConsentimento());
  const [estatisticos, setEstatisticos] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const janela = useRef<HTMLDialogElement>(null);

  // enquanto o aviso está na tela, a barra fixa de doação espera
  useEffect(() => {
    document.documentElement.toggleAttribute("data-aviso-cookies", avisoAberto);
    return () => document.documentElement.removeAttribute("data-aviso-cookies");
  }, [avisoAberto]);

  useEffect(
    () =>
      aoAbrirPreferencias(() => {
        const atual = lerConsentimento();
        setEstatisticos(atual?.stats ?? false);
        setMarketing(atual?.marketing ?? false);
        janela.current?.showModal();
      }),
    [],
  );

  function salvar(stats: boolean, mkt: boolean) {
    const retirou = salvarConsentimento(stats, mkt);
    setAvisoAberto(false);
    janela.current?.close();
    // ferramentas já carregadas não podem ser descarregadas: recarrega sem elas
    if (retirou) window.location.reload();
  }

  return (
    <>
      {avisoAberto && (
        <section className="cookies" aria-label="Aviso de cookies">
          <p>
            Usamos cookies para&nbsp;entender como você chega até&nbsp;aqui e&nbsp;medir nossas campanhas (Google
            Analytics e&nbsp;Meta&nbsp;Pixel). Cookies necessários ao&nbsp;funcionamento do&nbsp;site continuam ativos
            de&nbsp;qualquer forma. <Link to="/politica-de-privacidade">Ver política de&nbsp;privacidade</Link>
          </p>
          <div className="cookies__acoes">
            <button className="botao botao-verde" type="button" onClick={() => salvar(true, true)}>
              Aceitar
            </button>
            <button className="link-texto" type="button" onClick={() => janela.current?.showModal()}>
              Personalizar
            </button>
          </div>
        </section>
      )}

      <dialog
        className="janela"
        ref={janela}
        aria-labelledby="cookies-titulo"
        onClick={(e) => {
          if (e.target === janela.current) janela.current?.close();
        }}
      >
        <div className="janela__corpo janela__corpo--sem-gato">
          <button className="janela__fechar" type="button" aria-label="Fechar" onClick={() => janela.current?.close()}>
            ×
          </button>
          <h2 id="cookies-titulo">Preferências de&nbsp;cookies</h2>
          <div className="preferencia">
            <div>
              <strong>Necessários</strong>
              <small>Essenciais pro&nbsp;site funcionar. Não&nbsp;podem ser&nbsp;desligados.</small>
            </div>
            <label className="chave">
              <input type="checkbox" checked disabled readOnly aria-label="Cookies necessários" />
              <span />
            </label>
          </div>
          <div className="preferencia">
            <div>
              <strong>Estatísticos (GA4)</strong>
              <small>Entender quais páginas e&nbsp;campanhas funcionam.</small>
            </div>
            <label className="chave">
              <input
                type="checkbox"
                checked={estatisticos}
                onChange={(e) => setEstatisticos(e.target.checked)}
                aria-label="Cookies estatísticos"
              />
              <span />
            </label>
          </div>
          <div className="preferencia">
            <div>
              <strong>Marketing (Meta Pixel)</strong>
              <small>Medir e&nbsp;otimizar os&nbsp;anúncios.</small>
            </div>
            <label className="chave">
              <input
                type="checkbox"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
                aria-label="Cookies de marketing"
              />
              <span />
            </label>
          </div>
          <button
            className="botao botao-verde botao-bloco preferencias__salvar"
            type="button"
            onClick={() => salvar(estatisticos, marketing)}
          >
            Salvar preferências
          </button>
          <p className="preferencias__recusar">
            <button className="link-texto" type="button" onClick={() => salvar(false, false)}>
              Recusar não&nbsp;essenciais
            </button>
          </p>
        </div>
      </dialog>
    </>
  );
}
