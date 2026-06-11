
# Dicionário de Dados

Este documento descreve a estrutura do banco de dados para o sistema de gestão de equipamentos e triagens.

## 1. Tabela: `Equipamentos`
Descrição: Armazena os equipamentos que passam pelo sistema.

| Coluna          | Tipo            | Nulabilidade | Restrições             | Default           |
| :---            | :---            | :---         | :---                   | :---              |
| `Id`            | INT             | NOT NULL     | PK, Auto Increment     | -                 |
| `Codigo`        | VARCHAR(50)     | NOT NULL     | UNIQUE                 | -                 |
| `Modelo`        | VARCHAR(100)    | NOT NULL     | -                      | -                 |   
| `Especificacoes`| TEXT            | NULL         | -                      | -                 |
| `Lote`          | VARCHAR(50)     | NULL         | -                      | -                 |
| `Status`        | VARCHAR(20)     | NOT NULL     | -                      | 'PENDENTE'        |
| `DataEntrada`   | TIMESTAMP       | NOT NULL     | -                      | CURRENT_TIMESTAMP |
| `InstituicaoId` | INT             | NULL         | FK -> Instituicoes(Id) | -                 |
| `Tipo`          | VARCHAR(50)     | NOT NULL     | -                      | -                 |
| `AprovadoPor`   | VARCHAR(100)    | NULL         | -                      | -                 |
| `LaudoDescarte` | TEXT            | NULL         | -                      | -                 |

---

## 2. Tabela: `Instituicoes`
Descrição: Cadastro de instituições parceiras ou detentoras dos equipamentos.

| Coluna | Tipo        | Nulabilidade | Restrições          | Default |
| :---   | :---        | :---         | :---                | :---    |
| `Id`   | INT         | NOT NULL     | PK, Auto Increment  | -       |
| `Nome` | VARCHAR(150)| NOT NULL     | -                   | -       |
| `CNPJ` | VARCHAR(14) | NOT NULL     | UNIQUE              | -       |

---

## 3. Tabela: `Solicitacoes`
Descrição: Registros de solicitações de movimentação ou triagem.

| Coluna           | Tipo       | Nulabilidade | Restrições           | Default           |
| :---             | :---       | :---         | :---                 | :---              |
| `Id`             | INT        | NOT NULL     | PK, Auto Increment   | -                 |
| `SolicitanteId`  | INT        | NOT NULL     | FK -> Users(Id)      | -                 |
| `DataSolicitacao`| TIMESTAMP  | NOT NULL     | -                    | CURRENT_TIMESTAMP |
| `Status`         | VARCHAR(20)| NOT NULL     | -                    | 'ABERTA'          |

---

## 4. Tabela: `ItemSolicitacao`
Descrição: Itens individuais vinculados a uma solicitação.

| Coluna          | Tipo | Nulabilidade | Restrições             | Default |
| :---            | :--- | :---         | :---                   | :---    |
| `Id`            | INT  | NOT NULL     | PK, Auto Increment     | -       |
| `SolicitacaoId` | INT  | NOT NULL     | FK -> Solicitacoes(Id) | -       |
| `EquipamentoId` | INT  | NOT NULL     | FK -> Equipamentos(Id) | -       |

---

## 5. Tabela: `Triagens`
Descrição: Registro técnico da avaliação de um equipamento.

| Coluna              | Tipo        | Nulabilidade | Restrições             | Default           |
| :---                | :---        | :---         | :---                   |:---               |
| `Id`                | INT         | NOT NULL     | PK, Auto Increment     | -                 |
| `EquipamentoId`     | INT         | NOT NULL     | FK -> Equipamentos(Id) | -                 |
| `ChecklistJson`     | JSON        | NOT NULL     | -                      | -                 |
| `LaudoTecnico`      | TEXT        | NULL         | -                      | -                 |
| `Destino`           | VARCHAR(50) | NULL         | -                      | -                 |
| `DataTriagem`       | TIMESTAMP   | NOT NULL     | -                      | CURRENT_TIMESTAMP |
| `TecnicoResponsavel`| VARCHAR(100)| NOT NULL     | -                      | -                 |

---

## 6. Tabela: `Users`
Descrição: Usuários do sistema.

| Coluna  | Tipo         | Nulabilidade | Restrições         | Default |
| :---    | :---         | :---         | :---               | :---    |
| `Id`    | INT          | NOT NULL     | PK, Auto Increment | -       |
| `Nome`  | VARCHAR(100) | NOT NULL     | -                  | -       |
| `Email` | VARCHAR(100) | NOT NULL     | UNIQUE             | -       |

---

## 7. Tabela: `Movimentacoes`
Descrição: Histórico de movimentações dos equipamentos.

| Coluna            | Tipo          | Nulabilidade | Restrições             | Default |
| :---              | :---          | :---         | :---                   | :---    |
| `Id`              | INT           | NOT NULL     | PK, Auto Increment     | -       |
| `EquipamentoId`   | INT           | NOT NULL     | FK -> Equipamentos(Id) | -       |
| `Origem`          | VARCHAR(100)  | NOT NULL     | -                      | -       |
| `Destino`         | VARCHAR(100)  | NOT NULL     | -                      | -       |
| `DataMovimentacao`| TIMESTAMP     | NOT NULL     | CURRENT_TIMESTAMP      | -       |

---

## Relacionamentos Principais
- `Equipamentos.InstituicaoId` -> `Instituicoes.Id` (N:1)
- `ItemSolicitacao.SolicitacaoId` -> `Solicitacoes.Id` (N:1)
- `ItemSolicitacao.EquipamentoId` -> `Equipamentos.Id` (N:1)
- `Triagens.EquipamentoId` -> `Equipamentos.Id` (1:1 ou 1:N)
- `Solicitacoes.SolicitanteId` -> `Users.Id` (N:1)
- `Movimentacoes.EquipamentoId` -> `Equipamentos.Id` (N:1)

## Exemplos de Dados
- **Equipamentos**: (1, 'EQP-001', 'Monitor cardíaco', 'Modelo X200', 'Lote A', 'DISPONIVEL', '2026-06-01', 1, 'Médico', 'Admin', NULL)
- **Instituicoes**: (1, 'Hospital Central', '12345678000101')
dicionario-dados.md
Exibindo dicionario-dados.md.