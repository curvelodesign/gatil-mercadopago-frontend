# language: pt
Funcionalidade: Página de escolha do número (frontend)

  Cenário: Acesso com payment_id válido mostra a grade
    Dado que "/mercadopago/verificar-pagamento" devolve um token válido
    E "/api/rifa/numeros-ocupados" devolve [3, 47, 201]
    Quando eu acesso "/pagamento-aprovado?payment_id=999030&status=approved"
    Então devo ver o título "Escolha seu número da sorte"
    E os números 3, 47 e 201 devem aparecer marcados como indisponíveis
    E o número 10 deve estar clicável

  Cenário: Acesso sem payment_id redireciona para pagamento
    Quando eu acesso "/pagamento-aprovado" sem parâmetros
    Então devo ser redirecionado para "/rifa"

  Cenário: Verificação de pagamento falha e redireciona
    Dado que "/mercadopago/verificar-pagamento" devolve 402
    Quando eu acesso "/pagamento-aprovado?payment_id=999031"
    Então devo ser redirecionado para "/pagamento-recusado"

  Cenário: Escolher um número e confirmar com sucesso
    Dado que estou na página de escolha com um token válido
    Quando eu seleciono o número 88
    E preencho nome "Maria Teste", WhatsApp "71999998888" e e-mail "maria@teste.com"
    E eu clico em "Confirmar minha participação"
    Então devo ver a mensagem de sucesso com o número 88

  Cenário: Número escolhido por outra pessoa durante o preenchimento
    Dado que estou na página de escolha com um token válido
    E já selecionei o número 88
    Quando o backend responde 409 ao tentar confirmar
    Então devo ver a mensagem "Esse número acabou de ser escolhido por outra pessoa"
    E os campos nome, WhatsApp e e-mail não devem ser apagados
