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

**2-**
    Cadastra e apaga equipamentos;
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
Horário de turno anotado;

## Fluxo Principal:
Acompanha os dados que o sistema oferece (Pareto de defeitos, últimas atualizações, frequência de tipos de equipamentos cadastrados, logs).


## Pós-condições:
Administrador sabe quais ações tomar a partir das informações oferecidas
***

<br>
<br>

# Definir Destino Final

## Ator:
Administrador

## Descrição:
Analisar dados que tratam sobre equipamentos descartados por mês, total descartado e quantos ainda estão na fila de descarte por meio de gráficos e listas.

## Pré-condições:
Ter o equipamento cadastrado;
Retirar armazenamentos de memória do equipamento;

## Fluxo Principal:
Administrador escolhe se o equipamento vai ser liberado para descarte e gera relatórios.

## Fluxos de Exceção:
**1-**
    O equipamento não é resetado e mesmo assim é mandado para descarte;

**2-**
    Equipamento passa por vários processos;
    Administrador não atualiza o sistema;
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

# Cadastrar Entidade Beneficiária no Sistema

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
    A empresa não atende aos requisitos e é negada

**2-**
    Falta de controle no estoque de equipamentos;
***

<br>
<br>

# Analisar Doações

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

**2-**
    Cadastra e apaga equipamentos;