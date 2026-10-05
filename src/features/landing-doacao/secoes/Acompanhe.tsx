import { FeedInstagram } from "@/features/landing-doacao/FeedInstagram";
import imgCatAxeBrincando from "@/assets/doacao/cat-axe-brincando.webp";
import imgIconYarnLaranja from "@/assets/doacao/icon-yarn-laranja.webp";

/** Acompanhe o Gatil: feed do Instagram (SociableKIT), com reserva enquanto carrega. */
export function Acompanhe() {
  return (
    <>
      <section className="secao acompanhe recorte-cima recorte-cima--branco" data-secao="acompanhe">
        <div className="container">
          <p className="rotulo">Acompanhe o&nbsp;Gatil</p>
          <h2 className="titulo-secao">Vem fazer parte da&nbsp;nossa&nbsp;comunidade!</h2>
          <p className="acompanhe__texto">
            Já&nbsp;reunimos no&nbsp;nosso&nbsp;perfil um&nbsp;grupo com&nbsp;mais&nbsp;de&nbsp;40&nbsp;mil gateiros,
            é&nbsp;por&nbsp;lá que&nbsp;a&nbsp;gente mostra a&nbsp;rotina, os&nbsp;gatos disponíveis para&nbsp;adoção
            e&nbsp;fala com&nbsp;quem&nbsp;quer ser&nbsp;voluntário ou&nbsp;parceiro!
          </p>
          <div className="grade-posts-moldura">
            <div className="brincadeira" aria-hidden="true">
              <img className="novelo" src={imgIconYarnLaranja} alt="" />
              <img className="gato" src={imgCatAxeBrincando} alt="" />
            </div>
            <FeedInstagram>
              <a className="post" href="https://www.instagram.com/gatilirmafrancisca" target="_blank" rel="noopener">
                <span className="coracao"></span>
                <b>@gatilirmafrancisca</b>
              </a>
              <a className="post" href="https://www.instagram.com/gatilirmafrancisca" target="_blank" rel="noopener">
                <span className="coracao"></span>
                <b>@gatilirmafrancisca</b>
              </a>
              <a className="post" href="https://www.instagram.com/gatilirmafrancisca" target="_blank" rel="noopener">
                <span className="coracao"></span>
                <b>@gatilirmafrancisca</b>
              </a>
              <a className="post" href="https://www.instagram.com/gatilirmafrancisca" target="_blank" rel="noopener">
                <span className="coracao"></span>
                <b>@gatilirmafrancisca</b>
              </a>
              <a className="post" href="https://www.instagram.com/gatilirmafrancisca" target="_blank" rel="noopener">
                <span className="coracao"></span>
                <b>@gatilirmafrancisca</b>
              </a>
              <a className="post" href="https://www.instagram.com/gatilirmafrancisca" target="_blank" rel="noopener">
                <span className="coracao"></span>
                <b>@gatilirmafrancisca</b>
              </a>
            </FeedInstagram>
          </div>
          <a
            className="link-instagram"
            href="https://www.instagram.com/gatilirmafrancisca"
            target="_blank"
            rel="noopener"
          >
            📸&nbsp;Instagram&nbsp;- @gatilirmafrancisca
          </a>
        </div>
      </section>
    </>
  );
}
