# Checar Inventário

## Ator:
Administrador

## Descrição:
Visualiza quais equipamentos estão no inventário e seus status (Em estoque, triagem, análise, doação aprovada, descartado, aguardando formatação).

## Pré-condições:
Ter o equipamento cadastrado;

## Fluxo Principal:
Administrador busca equipamentos de acordo com a situação do equipamento.

## Fluxos Alternativos:
**1-** 
    Modificar status dos equipamentos;
***

<br>
<Br>

# Visualizar Dashboard

## Ator:
Administrador

## Descrição:
Administrador analisa gráficos e logs

## Pré-condições:
Ter o equipamento cadastrado;

## Fluxo Principal:
Acompanha os dados que o sistema oferece (Pareto de defeitos, últimas atualizações, frequência de tipos de equipamentos cadastrados, logs).


## Pós-condições:
Administrador sabe quais ações tomar a partir das informações oferecidas
***

<br>
<br>

# Realizar triagem técnica (Definir destino)

## Ator:
Administrador

## Descrição:
Analisar dados que tratam sobre quantos equipamentos ainda estão na fila de descarte por meio de gráficos e listas.

## Pré-condições:
Ter o equipamento cadastrado;
Retirar armazenamentos de memória do equipamento;

## Fluxo Principal:
Administrador avalia equipamentos de maior prioridade e também escolhe se os equipamentos vão ser liberados para descarte ou doação.

## Pós-condição:
Relatórios são gerados após a avaliação.

## Fluxos de Exceção:
**1-**
    O sistema apresenta erro ao gerar o relatório de descarte;
***

<br>
<br>

# Acessar Controle de Triagem

## Ator:
Administrador

## Descrição:
Ter controle de quantos equipamentos estão na fila de espera, em andamento ou que já foram finalizados, por meio de listas.

## Pré-condições:
Ter o equipamento cadastrado;

## Fluxo Principal:
Administrador consegue ter informações específicas de cada equipamento da lista e avaliar suas condições, decidir seu destino e oferecer um diagnóstico.
***

<br>
<br>

# Cadastrar instituição parceira

## Ator:
Administrador

## Descrição:
Cadastro de dados de uma entidade beneficiária no sistema que deseja receber doações.

## Pré-condições:
Ser uma entidade válida;
Ser previamente aprovada;

## Fluxo Principal:
Administrador cadastra uma entidade que irá buscar os equipamentos disponíveis para doação, consertados ou não, e dá baixa no sistema.

## Fluxos de Exceção:
**1-**
    A empresa não atende aos requisitos e é negada;
***

<br>
<br>

# Analisar e aprovar solicitações de doação

## Ator:
Administrador

## Descrição:
Análise de critérios internos para decidir se a doação será liberada ou não.

## Pré-condições:
Equipamento ter passado pela triagem;

## Fluxo Principal:
Aprovação de doações de lotes de equipamentos para instituições cadastradas

## Fluxos Alternativos:
**1-** 
    Nenhuma instituição está interessada;