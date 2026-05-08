# Alterar o status do equipamento 

## Ator:
Técnico de Informática

## Descrição:
Atualizar a situação que se encontra o equipamento
(Recuperado, Descartado, Vendido)

## Pré-condições:
Ter o equipamento cadastrado;
O técnico autenticado;


## Fluxo Principal:
Técnico avalia a situação;
Técnico valida o status do equipamento;

## Fluxos Alternativos:
**1-** 
    Usuário faz login;
    Login falha;
    Usuário refaz a informação informada errôneamente;

**2-**
    equipamento precisa ser descartado;
    criptografa unidade de armazenamento;
    Técnico de Triagem atualiza o sistema;
    Unidades de armazenamento do equipamento são criptografadas e retiradas;


## Fluxos de Exceção:
**1-**
    Usuário abre a chamada;
    Sistema não envia o token da chamada para o técnico;

**2-**
    equipamento passa por vários processos;
    Técnico de Triagem não atualiza o sistema;

## Pós-condições:
equipamento retorna ao usuário reformado e funcionando bem.