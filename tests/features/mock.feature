# language: pt
@mock
Funcionalidade: Modo mock (npm run dev:mock) — a jornada inteira sem backend

  Cenário: Escolher, reservar, pagar no Pix e receber os números, só com o backend falso
    Quando eu acesso "/rifa"
    E eu escolho os números 10 e 11 no quadro
    E eu clico em "Continuar"
    E preencho meus dados de contato e aceito os termos
    E eu clico em "Gerar Pix de R$ 200,00"
    Então devo ver o QR code do Pix da reserva
    E devo ver os bilhetes "010" e "011" quando o Pix for aprovado

  Cenário: Corrida simulada no modo mock
    Quando eu acesso "/rifa?mock=corrida"
    E eu escolho os números 10 e 11 no quadro
    E eu clico em "Continuar"
    Então devo ver a mensagem "alguém tirou o 010 um segundo antes de você"

  Cenário: Cartão no modo mock volta aprovado
    Quando eu acesso "/rifa"
    E eu escolho os números 20 no quadro
    E eu clico em "Continuar"
    E escolho pagar com cartão
    E preencho meus dados de contato e aceito os termos
    E eu clico em "Pagar R$ 100,00 no cartão"
    Então devo ver o título "Tirou! O número é seu"
    E devo ver a mensagem "020"
