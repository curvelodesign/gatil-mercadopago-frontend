/** Compartilhar a página: menu nativo no celular, link copiado no computador. */
export function compartilhar() {
  const url = window.location.href;
  if (navigator.share) {
    navigator.share({ title: "Gatil Irmã Francisca", url }).catch(() => {});
  } else {
    navigator.clipboard?.writeText(url).catch(() => {});
  }
}
