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

  Cenário: Valor pré-definido preenche o campo e editar o campo desmarca o preset
    Quando eu acesso "/doar"
    E eu seleciono o valor pré-definido de R$ 50
    Então o campo de valor da doação deve mostrar "50"
    E o valor pré-definido de R$ 50 deve estar selecionado
    Quando eu digito "60" no campo de valor da doação
    Então o valor pré-definido de R$ 50 não deve estar selecionado

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

  Cenário: Tela de doação aprovada mostra agradecimento
    Quando eu acesso "/doar/pagamento-aprovado?payment_id=999060&status=approved"
    Então devo ver o título "Muito obrigado pela sua doação!"
    E devo ver um botão "Fazer outra doação"

  Cenário: "Fazer outra doação" volta para a landing de doação
    Dado que estou em "/doar/pagamento-aprovado?payment_id=999060&status=approved"
    Quando eu clico em "Fazer outra doação"
    Então devo ser redirecionado para "/doar"

  Cenário: Tela de doação pendente explica o PIX
    Quando eu acesso "/doar/pagamento-pendente?payment_id=999061&status=pending"
    Então devo ver o título "Recebemos sua doação"

  Cenário: Tela de doação recusada permite tentar novamente
    Quando eu acesso "/doar/pagamento-recusado?payment_id=999062&status=rejected"
    Então devo ver o título "Essa doação não foi concluída"
    E devo ver um botão "Tentar novamente"

  Cenário: "Tentar novamente" volta para a landing de doação
    Dado que estou em "/doar/pagamento-recusado"
    Quando eu clico em "Tentar novamente"
    Então devo ser redirecionado para "/doar"

  Esquema do Cenário: Os caminhos antigos de retorno da doação não existem mais
    Quando eu acesso "<caminho>"
    Então devo ver o título "Página não encontrada"
    E devo continuar em "<caminho>"
    E não devo ver o título "<titulo>"

    Exemplos:
      | caminho            | titulo                          |
      | /doacao-confirmada | Muito obrigado pela sua doação! |
      | /doacao-pendente   | Recebemos sua doação            |
      | /doacao-recusada   | Essa doação não foi concluída   |

  Esquema do Cenário: As telas de retorno da doação não existem fora de /doar
    Quando eu acesso "<caminho>"
    Então devo ver o título "Página não encontrada"
    E não devo ver o título "<titulo>"

    Exemplos:
      | caminho             | titulo                          |
      | /pagamento-aprovado | Muito obrigado pela sua doação! |
      | /pagamento-pendente | Recebemos sua doação            |
      | /pagamento-recusado | Essa doação não foi concluída   |

  Cenário: A barra da meta acompanha o total arrecadado no mês
    Dado que o total arrecadado do mês é R$ 7500
    Quando eu acesso "/doar"
    Então a barra da meta deve mostrar 50% preenchido

  Cenário: Sem o total do mês, a barra da meta não aparece
    Dado que o total arrecadado do mês não está disponível
    Quando eu acesso "/doar"
    Então a barra da meta não deve aparecer
