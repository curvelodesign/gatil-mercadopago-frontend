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
    E devo ver um link "Fazer outra doação"

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
    E devo ver um link "Tentar novamente"

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

  Cenário: Ao voltar do Mercado Pago sem redirecionamento (Pix), a página leva ao agradecimento
    Dado que comecei uma doação e voltei do Mercado Pago
    Quando eu acesso "/doar"
    E confirmo que já fiz o Pix
    Então devo ver a página de agradecimento

  Cenário: Links do rodapé abrem a página no topo
    Quando eu acesso "/doar"
    E rolo até o rodapé e clico em "Política de Privacidade"
    Então a página deve começar do topo

  Cenário: Com o Pix dentro do site desligado, a janela continua como hoje
    Quando eu acesso "/doar"
    E eu seleciono o valor pré-definido de R$ 50
    Então não devo ver a escolha da forma de pagamento
    E devo ver o botão "Doar agora 💛"

  Cenário: Pix dentro do site: gerar o Pix e ir sozinho para o agradecimento
    Dado que o Pix dentro do site está ligado
    E que "/api/doacao/criar-pix" devolve um Pix válido
    E que o status do Pix fica "PENDENTE" e depois "APROVADO"
    Quando eu acesso "/doar?utm_source=instagram&utm_medium=organico"
    E eu seleciono o valor pré-definido de R$ 50
    E informo o e-mail "ana@email.com" e gero o Pix
    Então devo ver o QR code e o código copia e cola do Pix
    E o Pix deve ter sido pedido com o valor 50, o e-mail "ana@email.com" e a origem "instagram"
    E devo ser levado para o agradecimento quando o Pix for aprovado

  Cenário: Pix dentro do site: e-mail inválido não deixa gerar o Pix
    Dado que o Pix dentro do site está ligado
    Quando eu acesso "/doar"
    E eu seleciono o valor pré-definido de R$ 20
    E digito o e-mail "ana@email"
    Então o botão de gerar o Pix deve estar desabilitado

  Cenário: Pix dentro do site: Pix expirado oferece gerar outro
    Dado que o Pix dentro do site está ligado
    E que "/api/doacao/criar-pix" devolve um Pix válido
    E que o status do Pix fica "EXPIRADO"
    Quando eu acesso "/doar"
    E eu seleciono o valor pré-definido de R$ 20
    E informo o e-mail "ana@email.com" e gero o Pix
    Então devo ver o título "Esse Pix expirou"
    E devo ver o botão "Gerar novo Pix de R$20"

  Cenário: Pix dentro do site: cartão continua indo para o Mercado Pago
    Dado que o Pix dentro do site está ligado
    E que "/api/doacao/criar-pagamento" devolve um link de pagamento válido
    Quando eu acesso "/doar"
    E eu seleciono o valor pré-definido de R$ 50
    E escolho pagar com cartão
    E eu clico em "Doar agora 💛"
    Então devo ser redirecionado para o link de pagamento do Mercado Pago

  Cenário: Com o Pix dentro do site ligado, a volta do Mercado Pago não pergunta se concluiu
    Dado que o Pix dentro do site está ligado
    E que comecei uma doação e voltei do Mercado Pago
    Quando eu acesso "/doar"
    Então não devo ver a pergunta se concluí a doação
