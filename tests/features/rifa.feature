# language: pt
Funcionalidade: Landing da Ação Solidária de Natal — Pix na tela ou cartão pelo Mercado Pago

  Cenário: A landing mostra a ação e o pagamento, sem ir direto pro Mercado Pago
    Quando eu acesso "/rifa"
    Então devo ver o título "Neste Natal, você tirou 300 gatos no amigo secreto."
    E devo ver o título "Garanta seu número"
    E devo continuar em "/rifa"

  Cenário: Com o Pix dentro do site desligado, a ação oferece só o cartão
    Dado que a rifa devolve um link de pagamento válido
    Quando eu acesso "/rifa?utm_source=instagram&utm_medium=organico"
    Então não devo ver a escolha da forma de pagamento
    Quando eu clico em "Pagar com cartão"
    Então devo ser redirecionado para o link de pagamento do Mercado Pago
    E a origem enviada no pagamento da rifa deve ser "instagram" e "organico"

  Cenário: O link antigo /rifa/pagar abre a mesma landing
    Quando eu acesso "/rifa/pagar"
    Então devo ver o título "Garanta seu número"

  Cenário: UTM que o backend não conhece não impede o pagamento
    Dado que a rifa devolve um link de pagamento válido
    Quando eu acesso "/rifa?utm_source=ig"
    E eu clico em "Pagar com cartão"
    Então devo ser redirecionado para o link de pagamento do Mercado Pago
    E a origem enviada no pagamento da rifa deve ser "" e ""

  Cenário: Pix na tela: pagar e escolher o número (jornada completa)
    Dado que o Pix dentro do site está ligado
    E que a rifa devolve um Pix válido
    E que o status do Pix da rifa fica "PENDENTE" e depois "APROVADO"
    E que "/mercadopago/verificar-pagamento" devolve um token válido
    E "/api/rifa/numeros-ocupados" devolve [3, 47, 201]
    E que a confirmação do número é aceita
    Quando eu acesso "/rifa?utm_source=instagram&utm_medium=organico"
    E informo o e-mail "ana@email.com" e gero o Pix
    Então devo ver o QR code e o código copia e cola do Pix
    E o Pix da rifa deve ter sido pedido com o e-mail "ana@email.com" e a origem "instagram"
    E devo ser levado para a escolha do número quando o Pix for aprovado
    Quando eu seleciono o número 88
    E preencho nome "Maria Teste", WhatsApp "71999998888" e e-mail "maria@teste.com"
    E eu clico em "Confirmar minha participação"
    Então devo ver a mensagem de sucesso com o número 88

  Cenário: Cartão com o Pix ligado: vai pro Mercado Pago
    Dado que o Pix dentro do site está ligado
    E que a rifa devolve um link de pagamento válido
    Quando eu acesso "/rifa"
    E escolho pagar com cartão
    E eu clico em "Pagar com cartão"
    Então devo ser redirecionado para o link de pagamento do Mercado Pago

  Cenário: Pix na tela: e-mail inválido não deixa gerar o Pix
    Dado que o Pix dentro do site está ligado
    Quando eu acesso "/rifa"
    E digito o e-mail "ana@email"
    Então o botão de gerar o Pix deve estar desabilitado

  Cenário: Pix na tela: Pix expirado oferece gerar outro
    Dado que o Pix dentro do site está ligado
    E que a rifa devolve um Pix válido
    E que o status do Pix da rifa fica "EXPIRADO"
    Quando eu acesso "/rifa"
    E informo o e-mail "ana@email.com" e gero o Pix
    Então devo ver o título "Esse Pix expirou"
    E devo ver o botão "Gerar novo Pix de R$ 100,00"

  Cenário: Números esgotados: o Pix não é gerado e a pessoa é avisada
    Dado que o Pix dentro do site está ligado
    E que "/api/rifa/criar-pix" devolve 409
    Quando eu acesso "/rifa"
    E informo o e-mail "ana@email.com" e gero o Pix
    Então devo ver a mensagem "Os números desta ação já foram todos vendidos."

  Cenário: Falha ao abrir o pagamento com cartão mostra mensagem de erro
    Dado que "/api/rifa/criar-pagamento" devolve 500
    Quando eu acesso "/rifa"
    E eu clico em "Pagar com cartão"
    Então devo ver a mensagem "Não conseguimos abrir o pagamento agora."

  Cenário: O regulamento da ação abre pelo rodapé
    Quando eu acesso "/rifa"
    E eu clico em "Regulamento Ação"
    Então devo ver o título "Regulamento · Ação Solidária de Natal do Gatil Irmã Francisca"

  Cenário: O quadro mostra os números que já têm dono
    Dado "/api/rifa/numeros-ocupados" devolve [3, 47, 201]
    Quando eu acesso "/rifa"
    Então devo ver o título "497 números esperando dono"
