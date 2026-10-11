import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import imgCatChica from "@/assets/doacao/cat-chica.webp";
import { consumirRetornoPagamento } from "@/features/landing-doacao/retornoPagamento";
import { pixNoSiteAtivo } from "@/features/donation/pixNoSite";

/**
 * Aparece quando a pessoa volta do Mercado Pago para /doar (caso típico do Pix,
 * em que o Mercado Pago não redireciona sozinho). Quem já pagou segue para o
 * agradecimento; quem não terminou pode voltar a doar.
 *
 * Com o Pix dentro do site ligado, a pergunta deixa de existir: o Pix é pago
 * aqui mesmo e o cartão volta sozinho pro agradecimento (auto_return). Quem
 * volta pelo "voltar" depois do cartão, nesse caso, provavelmente não pagou.
 */
export function JanelaRetorno({ onDoar }: { onDoar: () => void }) {
  const janela = useRef<HTMLDialogElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Lê e apaga a marca sempre, pra ela não ficar guardada de uma visita pra outra
    const voltouDoPagamento = consumirRetornoPagamento();
    if (voltouDoPagamento && !pixNoSiteAtivo()) janela.current?.showModal();
  }, []);

  const fechar = () => janela.current?.close();

  return (
    <dialog className="janela janela--centro" ref={janela} aria-labelledby="retorno-titulo">
      <img className="janela__gato" src={imgCatChica} alt="" aria-hidden="true" />
      <div className="janela__corpo">
        <button className="janela__fechar" type="button" aria-label="Fechar" onClick={fechar}>
          ×
        </button>
        <h2 id="retorno-titulo">Você concluiu sua&nbsp;doação?</h2>
        <p className="janela__texto">
          Se você já fez o&nbsp;Pix, muito obrigado! A&nbsp;confirmação chega pelo&nbsp;Mercado Pago
          em&nbsp;instantes.
        </p>
        <button
          className="botao botao-laranja botao-bloco"
          type="button"
          onClick={() => {
            fechar();
            navigate("/doar/pagamento-aprovado");
          }}
        >
          Sim, já fiz o&nbsp;Pix 💛
        </button>
        <button
          className="link-botao janela__link"
          type="button"
          onClick={() => {
            fechar();
            onDoar();
          }}
        >
          Ainda não, quero concluir
        </button>
      </div>
    </dialog>
  );
}
