# language: pt
Funcionalidade: Telas de pendente e recusado

  Cenário: Redirecionado como pendente (típico de PIX)
    Quando eu acesso "/rifa/pagamento-pendente?payment_id=999040"
    Então devo ver uma explicação sobre pagamento em processamento
    E devo ver um botão "Já paguei, verificar agora"

  Cenário: Clicar em "verificar agora" com pagamento já aprovado
    Dado que estou em "/rifa/pagamento-pendente?payment_id=999040"
    E "/mercadopago/verificar-pagamento" agora devolve um token válido para "999040"
    Quando eu clico em "Já paguei, verificar agora"
    Então devo ser redirecionado para "/rifa/pagamento-aprovado?payment_id=999040"

  Cenário: Redirecionado como recusado
    Quando eu acesso "/rifa/pagamento-recusado?payment_id=999041"
    Então devo ver uma explicação de que o pagamento não foi aprovado
    E devo ver um botão "Tentar novamente"

  Cenário: Clicar em "tentar novamente" gera novo pagamento
    Dado que estou em "/rifa/pagamento-recusado"
    Quando eu clico em "Tentar novamente"
    Então devo ser redirecionado para "/rifa"

  Cenário: Tela de pendente da rifa não existe fora de /rifa
    Quando eu acesso "/pagamento-pendente?payment_id=999042"
    Então devo ver o título "Página não encontrada"
    E não devo ver o botão "Já paguei, verificar agora"

  Cenário: Tela de recusado da rifa não existe fora de /rifa
    Quando eu acesso "/pagamento-recusado"
    Então devo ver o título "Página não encontrada"
    E não devo ver o botão "Tentar novamente"
