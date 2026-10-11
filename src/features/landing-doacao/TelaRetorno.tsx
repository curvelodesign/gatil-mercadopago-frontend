import { useEffect, type ReactNode } from "react";
import { Link } from "react-router-dom";
import imgLogoGreen from "@/assets/doacao/logo-green.webp";
import { limparRetornoPagamento } from "@/features/landing-doacao/retornoPagamento";

interface Props {
  titulo: string;
  tituloAba: string;
  rotulo: string;
  gato: string;
  /** Gato deitado é mais largo: usa a medida própria */
  gatoDeitado?: boolean;
  children: ReactNode;
  acoes: ReactNode;
}

/** Moldura das páginas de retorno do Mercado Pago, no visual da landing. */
export function TelaRetorno({ titulo, tituloAba, rotulo, gato, gatoDeitado, children, acoes }: Props) {
  useEffect(() => {
    document.title = `${tituloAba} | Gatil Irmã Francisca`;
    // Quem chegou aqui pelo Mercado Pago não precisa da pergunta "concluiu o Pix?"
    limparRetornoPagamento();
  }, [tituloAba]);

  return (
    <>
      <header className="topo-documento">
        <Link to="/doar" aria-label="Gatil Irmã Francisca - voltar para a página de doação">
          <img src={imgLogoGreen} alt="Gatil Irmã Francisca" />
        </Link>
      </header>
      <main className="retorno">
        <div className="container">
          <div className="retorno__cartao">
            <img
              className={gatoDeitado ? "retorno__gato retorno__gato--deitado" : "retorno__gato"}
              src={gato}
              alt=""
              aria-hidden="true"
            />
            <p className="rotulo">{rotulo}</p>
            <h1>{titulo}</h1>
            <div className="retorno__texto">{children}</div>
            <div className="retorno__acoes">{acoes}</div>
          </div>
        </div>
      </main>
    </>
  );
}
