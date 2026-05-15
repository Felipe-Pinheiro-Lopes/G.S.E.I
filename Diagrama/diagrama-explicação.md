# Ir para doação


## Ator:
Técnico de Informática

## Descrição:
Decide qual o fim do equipamento
(Descartado, Doado)

## Pré-condições:
Ter o equipamento cadastrado;
O técnico ser autenticado;

## Fluxo Principal:
Técnico avalia a situação e conserta o equipamento ou deleta seus arquivos para descarte;
Técnico valida o status do equipamento;

## Fluxos Alternativos:
**1-** 
    Técnico é incapaz de consertar o equipamento mas mesmo assim o libera para doação;

**2-**
    Equipamento não tem seus arquivos devidamente deletados;
    É enviado para descarte mesmo assim;


## Fluxos de Exceção:
**1-**
    Usuário abre a chamada;
    Sistema não envia o token da chamada para o técnico;

**2-**
    Equipamento passa por vários processos;
    Técnico não atualiza o sistema;

## Pós-condições:
Equipamento é liberado para doação, em lotes, ou é tratado como sucata.