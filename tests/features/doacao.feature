# language: pt
Funcionalidade: Página de doação avulsa (frontend)

  Cenário: Escolher um valor pré-definido e ser redirecionado ao Mercado Pago
    Dado que "/api/doacao/criar-pagamento" devolve um link de pagamento válido
    Quando eu acesso "/doar?utm_source=instagram&utm_medium=organico"
    E eu seleciono o valor pré-definido de R$ 50
    E eu clico em "Doar agora"
    Então devo ser redirecionado para o link de pagamento do Mercado Pago
    E a origem enviada ao backend deve ser "instagram" e "organico"

  Cenário: Digitar um valor personalizado válido
    Dado que "/api/doacao/criar-pagamento" devolve um link de pagamento válido
    Quando eu acesso "/doar"
    E eu digito "35" no campo de valor da doação
    E eu clico em "Doar agora"
    Então devo ser redirecionado para o link de pagamento do Mercado Pago

  Cenário: Valor abaixo do mínimo mantém o botão desabilitado
    Quando eu acesso "/doar"
    E eu digito "0" no campo de valor da doação
    Então o botão "Doar agora" deve estar desabilitado

  Cenário: Falha ao criar o pagamento mostra mensagem de erro
    Dado que "/api/doacao/criar-pagamento" devolve erro 500
    Quando eu acesso "/doar"
    E eu seleciono o valor pré-definido de R$ 20
    E eu clico em "Doar agora"
    Então devo ver a mensagem "Não conseguimos abrir o pagamento agora. Tenta de novo em instantes."

  Cenário: Tela de doação confirmada mostra agradecimento
    Quando eu acesso "/doacao-confirmada"
    Então devo ver o título "Muito obrigado pela sua doação!"
    E devo ver um botão "Fazer outra doação"

  Cenário: Tela de doação pendente explica o PIX
    Quando eu acesso "/doacao-pendente"
    Então devo ver o título "Recebemos sua doação"

  Cenário: Tela de doação recusada permite tentar novamente
    Quando eu acesso "/doacao-recusada"
    Então devo ver o título "Essa doação não foi concluída"
    E devo ver um botão "Tentar novamente"