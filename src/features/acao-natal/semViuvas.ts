// Sem viúvas: palavras curtas ("a", "de", "com"...) grudam na palavra seguinte
// com espaço inquebrável, pra nenhuma linha terminar nelas. Roda no texto já
// renderizado e acompanha o que o React mudar depois.
const CURTAS = /(^|[\s(])(a|e|o|à|é|as|os|ao|aos|um|uma|de|da|do|das|dos|em|no|na|nos|nas|pra|pro|por|com|que|se|só|ou|até|sem|seu|sua|mas|mais|R\$)\s+(?=\S)/gi

export function semViuvas(seletor: string) {
  const raiz = document.querySelector(seletor)
  if (!raiz) return
  const ajustar = () => {
    const andador = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT)
    let no = andador.nextNode()
    while (no) {
      const pai = no.parentElement
      if (pai && !["SCRIPT", "STYLE", "OPTION", "TEXTAREA", "CODE"].includes(pai.tagName)) {
        const texto = no.textContent?.replace(CURTAS, "$1$2 ").replace(CURTAS, "$1$2 ")
        if (texto && texto !== no.textContent) no.textContent = texto
      }
      no = andador.nextNode()
    }
  }
  ajustar()
  const observador = new MutationObserver(ajustar)
  observador.observe(raiz, { childList: true, subtree: true, characterData: true })
  return () => observador.disconnect()
}
