# language: pt
@reserva
Funcionalidade: Ação de Natal com reserva — escolhe os números, guarda por 15 minutos e paga o total

  Contexto:
    Dado "/api/rifa/numeros-ocupados" devolve [3, 47, 201]

  Cenário: Jornada completa no Pix: escolher, reservar, pagar e receber os números
    Dado que a reserva dos números é aceita
    E que o Pix da reserva é criado
    E que o status do Pix da rifa fica "PENDENTE" e depois "APROVADO"
    E que a reserva consultada está "PAGO" com os números 10, 120 e 250
    Quando eu acesso "/rifa?utm_source=instagram&utm_medium=organico"
    E eu escolho os números 10, 120 e 250 no quadro
    E eu clico em "Continuar"
    Então a reserva deve ter sido pedida com os números 10, 120 e 250
    E devo ver o título "Como você quer pagar?"
    E devo ver que os números ficam guardados
    Quando preencho meus dados de contato e aceito os termos
    E eu clico em "Gerar Pix de R$ 300,00"
    Então devo ver o QR code do Pix da reserva
    E o Pix da reserva deve ter sido pedido com os meus dados e sem valor
    E devo ver os bilhetes "010", "120" e "250" quando o Pix for aprovado

  Cenário: Alguém tirou um número um segundo antes: ele sai da seleção e o total é atualizado
    Dado que a reserva devolve o 120 como indisponível
    Quando eu acesso "/rifa"
    E eu escolho os números 10, 120 e 250 no quadro
    E eu clico em "Continuar"
    Então devo ver a mensagem "alguém tirou o 120 um segundo antes de você"
    E devo ver o botão "Gerar Pix de R$ 200,00"

  Cenário: Todos os números escolhidos acabaram de ganhar dono
    Dado que a reserva responde 409 com o 120 indisponível
    Quando eu acesso "/rifa"
    E eu escolho os números 120 no quadro
    E eu clico em "Continuar"
    Então devo ver a mensagem "O 120 acabou de ganhar dono. Escolhe outro?"
    E devo ver o título "Ainda sem número"

  Cenário: Limite de reservas mostra a mensagem do servidor
    Dado que a reserva responde 429 com a mensagem "Você já tem reservas abertas."
    Quando eu acesso "/rifa"
    E eu escolho os números 10 no quadro
    E eu clico em "Continuar"
    Então devo ver a mensagem "Você já tem reservas abertas."

  Cenário: Os 15 minutos da reserva passam e os números voltam ao quadro
    Dado que o relógio do navegador está controlado
    E que a reserva dos números é aceita
    Quando eu acesso "/rifa"
    E eu escolho os números 10 e 11 no quadro
    E eu clico em "Continuar"
    E passam 15 minutos
    Então devo ver a mensagem "Os 15 minutos passaram e seus números voltaram pro quadro"
    E devo ver o título "Ainda sem número"

  Cenário: O Pix vence em 30 minutos sem pagamento
    Dado que o relógio do navegador está controlado
    E que a reserva dos números é aceita
    E que o Pix da reserva é criado
    E que o status do Pix da rifa fica "PENDENTE"
    Quando eu acesso "/rifa"
    E eu escolho os números 10 no quadro
    E eu clico em "Continuar"
    E preencho meus dados de contato e aceito os termos
    E eu clico em "Gerar Pix de R$ 100,00"
    Então devo ver o QR code do Pix da reserva
    Quando passam 31 minutos
    Então devo ver o título "Esse Pix expirou"
    E devo ver o botão "Escolher de novo"

  Cenário: Sem aceitar os termos, o pagamento não é gerado
    Dado que a reserva dos números é aceita
    E que o Pix da reserva é criado
    Quando eu acesso "/rifa"
    E eu escolho os números 10 no quadro
    E eu clico em "Continuar"
    E preencho meus dados de contato sem aceitar os termos
    E eu clico em "Gerar Pix de R$ 100,00"
    Então devo ver a mensagem "Para continuar, aceite o Regulamento e a Política de Privacidade."
    E nenhum Pix da reserva deve ter sido pedido

  Cenário: WhatsApp sem DDD não gera o pagamento
    Dado que a reserva dos números é aceita
    E que o Pix da reserva é criado
    Quando eu acesso "/rifa"
    E eu escolho os números 10 no quadro
    E eu clico em "Continuar"
    E preencho meus dados de contato com o WhatsApp "9999"
    E eu clico em "Gerar Pix de R$ 100,00"
    Então devo ver a mensagem "Informe um WhatsApp com DDD."
    E nenhum Pix da reserva deve ter sido pedido

  Cenário: Reserva vencida no servidor ao gerar o Pix volta ao quadro
    Dado que a reserva dos números é aceita
    E que "/api/rifa/criar-pix" devolve 410
    Quando eu acesso "/rifa"
    E eu escolho os números 10 no quadro
    E eu clico em "Continuar"
    E preencho meus dados de contato e aceito os termos
    E eu clico em "Gerar Pix de R$ 100,00"
    Então devo ver a mensagem "Sua reserva venceu e os números voltaram pro quadro."

  Cenário: Trocar os números libera a reserva
    Dado que a reserva dos números é aceita
    E que liberar a reserva é aceito
    Quando eu acesso "/rifa"
    E eu escolho os números 10 e 11 no quadro
    E eu clico em "Continuar"
    E eu clico em "Trocar números"
    Então a reserva deve ter sido liberada
    E devo ver o título "Você tirou 2 números"

  Cenário: No máximo 10 números por compra
    Quando eu acesso "/rifa"
    E eu escolho os números 1, 2, 4, 5, 6, 7, 8, 9, 10, 11 e 12 no quadro
    Então devo ver o título "Você tirou 10 números"
    E devo ver a mensagem "Dá pra levar até 10 números por compra"

  Cenário: Cartão: vai pro Mercado Pago com a reserva e os dados, sem valor
    Dado que a reserva dos números é aceita
    E que o cartão da reserva devolve um link
    Quando eu acesso "/rifa"
    E eu escolho os números 10, 11 e 12 no quadro
    E eu clico em "Continuar"
    E escolho pagar com cartão
    E preencho meus dados de contato e aceito os termos
    E eu clico em "Pagar R$ 300,00 no cartão"
    Então devo ser redirecionado para o link de pagamento do Mercado Pago
    E o cartão da reserva deve ter sido pedido com os meus dados e sem valor

  Cenário: Recarregar a página com o Pix gerado retoma a reserva
    Dado que a reserva dos números é aceita
    E que o Pix da reserva é criado
    E que o status do Pix da rifa fica "PENDENTE"
    Quando eu acesso "/rifa"
    E eu escolho os números 10 no quadro
    E eu clico em "Continuar"
    E preencho meus dados de contato e aceito os termos
    E eu clico em "Gerar Pix de R$ 100,00"
    E que a reserva consultada está aguardando o Pix
    E eu recarrego a página
    Então devo ver o QR code do Pix da reserva

  Cenário: Volta do cartão aprovado mostra os números
    Dado que a compra consultada está "PAGO" com os números 72 e 73
    Quando eu acesso "/rifa/compra/aprovada?payment_id=555001&external_reference=11111111-2222-4333-8444-555555555555&status=approved"
    Então devo ver o título "Tirou! Os números são seus"
    E devo ver a mensagem "072 · 073"
    E a compra deve ter sido consultada com o pagamento "555001"

  Cenário: Volta do cartão aprovado depois de um número se perder mostra o link para escolher outro
    Dado que a compra consultada está "PAGO_PARCIAL" com os números 72 e 1 a escolher
    Quando eu acesso "/rifa/compra/aprovada?payment_id=555002&external_reference=11111111-2222-4333-8444-555555555555"
    Então devo ver a mensagem "072"
    E devo ver um link "Escolher o 1º número"

  Cenário: Cartão em análise
    Dado que a compra consultada está "AGUARDANDO_PAGAMENTO" com o pagamento "PENDENTE"
    Quando eu acesso "/rifa/compra/pendente?payment_id=555003&external_reference=11111111-2222-4333-8444-555555555555"
    Então devo ver o título "Pagamento em análise"

  Cenário: Cartão recusado
    Dado que a compra consultada está "AGUARDANDO_PAGAMENTO" com o pagamento "CANCELADO"
    Quando eu acesso "/rifa/compra/recusada?payment_id=555004&external_reference=11111111-2222-4333-8444-555555555555"
    Então devo ver o título "O pagamento não foi aprovado"
    E devo ver um link "Voltar e tentar de novo"

  Cenário: O link antigo de escolha com o pagamento de uma compra leva para a compra
    Dado que "/mercadopago/verificar-pagamento" responde que o pagamento é da compra "11111111-2222-4333-8444-555555555555"
    E que a compra consultada está "PAGO" com os números 72 e 73
    Quando eu acesso "/rifa/pagamento-aprovado?payment_id=555005"
    Então devo ver o título "Tirou! Os números são seus"

  Cenário: A política de privacidade explica os dados da reserva
    Quando eu acesso "/politica-de-privacidade"
    Então devo ver a mensagem "Ao participar da Ação Solidária de Natal"

  Cenário: Os headers de segurança estão configurados no deploy
    Então o deploy deve mandar os headers de segurança

  Cenário: O comando do Pix de teste existe no console da /rifa e liga o modo teste
    Dado que a reserva dos números é aceita
    Quando eu acesso "/rifa"
    E eu ligo o Pix de teste pelo console com a chave "chave-teste"
    E eu escolho os números 10 no quadro
    E eu clico em "Continuar"
    Então a reserva deve ter sido pedida com o header de teste "chave-teste"
