# language: pt
Funcionalidade: Telas de pendente e recusado

  Cenário: Redirecionado como pendente (típico de PIX)
    Quando eu acesso "/pagamento-pendente?payment_id=999040"
    Então devo ver uma explicação sobre pagamento em processamento
    E devo ver um botão "Já paguei, verificar agora"

  Cenário: Clicar em "verificar agora" com pagamento já aprovado
    Dado que estou em "/pagamento-pendente?payment_id=999040"
    E "/mercadopago/verificar-pagamento" agora devolve um token válido para "999040"
    Quando eu clico em "Já paguei, verificar agora"
    Então devo ser redirecionado para "/pagamento-aprovado?payment_id=999040"

  Cenário: Redirecionado como recusado
    Quando eu acesso "/pagamento-recusado?payment_id=999041"
    Então devo ver uma explicação de que o pagamento não foi aprovado
    E devo ver um botão "Tentar novamente"

  Cenário: Clicar em "tentar novamente" gera novo pagamento
    Dado que estou em "/pagamento-recusado"
    Quando eu clico em "Tentar novamente"
    Então devo ser redirecionado para "/rifa"
