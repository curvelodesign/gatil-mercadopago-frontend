import { Link } from "react-router-dom";
import { abrirPreferenciasCookies } from "@/lib/analytics/consentimento";
import imgLogoCream from "@/assets/doacao/logo-cream.webp";

/** Rodapé: redes, documentos e preferências de cookies. */
export function Rodape() {
  return (
    <>
      <footer className="rodape recorte-cima recorte-cima--branco">
        <div className="container">
          <div className="rodape__topo">
            <div>
              <img className="rodape__logo" src={imgLogoCream} alt="Gatil Irmã Francisca" />
              <p className="rodape__frase">Cuidado que&nbsp;continua, um&nbsp;gato de&nbsp;cada&nbsp;vez.</p>
              <div className="redes">
                <a
                  href="https://www.instagram.com/gatilirmafrancisca"
                  target="_blank"
                  rel="noopener"
                  aria-label="Instagram do Gatil Irmã Francisca"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4.2" />
                    <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/gatilirmafrancisca"
                  target="_blank"
                  rel="noopener"
                  aria-label="Facebook do Gatil Irmã Francisca"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M13.6 21v-7.6h2.6l.4-3h-3V8.5c0-.9.3-1.5 1.5-1.5h1.6V4.3c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.9v3h2.6V21h3.1Z" />
                  </svg>
                </a>
                <a
                  href="https://www.tiktok.com/@gatilirmafrancisca"
                  target="_blank"
                  rel="noopener"
                  aria-label="TikTok do Gatil Irmã Francisca"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M16.6 3c.3 2.1 1.6 3.5 3.7 3.7v3c-1.4.1-2.6-.3-3.7-1v6.1c0 3.3-2.4 5.7-5.6 5.7-3.1 0-5.6-2.4-5.6-5.5 0-3.4 2.9-5.9 6.4-5.4v3.1c-1.6-.4-3.2.7-3.2 2.3 0 1.3 1 2.4 2.4 2.4 1.5 0 2.5-1.1 2.5-2.7V3h3.1Z" />
                  </svg>
                </a>
              </div>
            </div>
            <ul className="rodape__links">
              <li>
                <Link to="/politica-de-privacidade">Política de&nbsp;Privacidade</Link>
              </li>
              <li>
                <Link to="/termos">Termos de&nbsp;Uso</Link>
              </li>
              <li>
                <Link to="/termos#doacao">Política de&nbsp;Doação</Link>
              </li>
              <li>
                <button className="link-rodape" type="button" onClick={abrirPreferenciasCookies}>
                  Gerenciar cookies
                </button>
              </li>
            </ul>
          </div>
          <p className="rodape__legal">
            <span className="nowrap">CNPJ 25.382.038/0001-05</span>&nbsp;·&nbsp;©&nbsp;2026&nbsp;Gatil Irmã
            Francisca&nbsp;·&nbsp;Todos&nbsp;os&nbsp;direitos&nbsp;reservados
            <br />
            Salvador, BA
          </p>
          <p className="rodape__credito">
            Desenvolvido por{" "}
            <a href="https://curvelo.art.br" target="_blank" rel="noopener">
              Curvelo
            </a>
            .
          </p>
        </div>
      </footer>
    </>
  );
}
