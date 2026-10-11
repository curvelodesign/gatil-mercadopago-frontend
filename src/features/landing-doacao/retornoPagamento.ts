// Lembra que a pessoa saiu da landing para pagar no Mercado Pago. No Pix, o
// Mercado Pago não traz a pessoa de volta sozinho: ela volta pelo "voltar" do
// navegador e cai de novo em /doar. Com essa marca, a landing pergunta se o Pix
// foi concluído e leva para a página de agradecimento.
const CHAVE = "gatil_doacao_iniciada";
const VALIDADE = 1000 * 60 * 60 * 3; // 3 horas

export function marcarSaidaParaPagamento() {
  try {
    sessionStorage.setItem(CHAVE, String(Date.now()));
  } catch {
    // Sem sessionStorage (aba anônima restrita): só não pergunta na volta.
  }
}

/** Lê e apaga a marca; diz se a pessoa acabou de voltar do pagamento. */
export function consumirRetornoPagamento(): boolean {
  try {
    const marca = Number(sessionStorage.getItem(CHAVE));
    sessionStorage.removeItem(CHAVE);
    return Boolean(marca) && Date.now() - marca < VALIDADE;
  } catch {
    return false;
  }
}

/** Nas páginas de retorno do Mercado Pago a pergunta não é mais necessária. */
export function limparRetornoPagamento() {
  try {
    sessionStorage.removeItem(CHAVE);
  } catch {
    // nada a fazer
  }
}
