# Modelo Lógico Relacional (MLR)

## Projeto: G.S.E.I – Gestão Sustentável de Equipamentos de Informática

### 1. INSTITUICOES

**INSTITUICOES** (
ID **PK**,
Nome,
CNPJ **UNIQUE**,
Responsavel,
Telefone,
Email,
DataCadastro
)

**Descrição:** Armazena os dados das instituições parceiras responsáveis pelo fornecimento, recebimento ou solicitação de equipamentos.

---

### 2. USERS

**USERS** (
ID **PK**,
Nome,
Email **UNIQUE**,
SenhaHash,
Role,
FotoURL,
InstituicaoID **FK**
)

**FK:**

* InstituicaoID → INSTITUICOES(ID)

**Descrição:** Armazena os usuários do sistema, incluindo administradores, técnicos e representantes das instituições.

---

### 3. EQUIPAMENTOS

**EQUIPAMENTOS** (
ID **PK**,
Codigo **UNIQUE**,
Tipo,
Modelo,
Lote,
Especificacoes,
Status,
DataCadastro,
InstituicaoID **FK**,
AprovadoPor,
LaudoDescarte
)

**FK:**

* InstituicaoID → INSTITUICOES(ID)

**Descrição:** Armazena os equipamentos cadastrados no sistema e seu respectivo estado durante o processo de reaproveitamento.

---

### 4. SOLICITACOES

**SOLICITACOES** (
ID **PK**,
InstituicaoID **FK**,
ResponsavelRetirada,
TelefoneContato,
Finalidade,
Status,
Protocolo **UNIQUE**,
Prioridade,
DataSolicitacao
)

**FK:**

* InstituicaoID → INSTITUICOES(ID)

**Descrição:** Registra solicitações de equipamentos realizadas pelas instituições participantes.

---

### 5. TRIAGENS

**TRIAGENS** (
ID **PK**,
EquipamentoID **FK**,
CheckListJson,
LaudoTecnico,
Destino,
TecnicoResponsavel,
DataTriagem
)

**FK:**

* EquipamentoID → EQUIPAMENTOS(ID)

**Descrição:** Registra a avaliação técnica realizada nos equipamentos recebidos.

---

### 6. ITENSSOLICITACAO

**ITENSSOLICITACAO** (
ID **PK**,
SolicitacaoID **FK**,
EquipamentoID **FK**,
QuantidadeSolicitada
)

**FKs:**

* SolicitacaoID → SOLICITACOES(ID)
* EquipamentoID → EQUIPAMENTOS(ID)

**Descrição:** Tabela associativa responsável por relacionar equipamentos às solicitações.

---

# Relacionamentos

INSTITUICOES (1) ---- (N) USERS

INSTITUICOES (1) ---- (N) EQUIPAMENTOS

INSTITUICOES (1) ---- (N) SOLICITACOES

EQUIPAMENTOS (1) ---- (N) TRIAGENS

SOLICITACOES (1) ---- (N) ITENSSOLICITACAO

EQUIPAMENTOS (1) ---- (N) ITENSSOLICITACAO

---

# Observações de Integridade

* Todas as entidades possuem chave primária (PK).
* Os relacionamentos são implementados por chaves estrangeiras (FK).
* Os campos CNPJ, Email, Codigo e Protocolo possuem restrição UNIQUE.
* O modelo encontra-se normalizado até a Terceira Forma Normal (3FN).
* Índices devem ser aplicados nas chaves estrangeiras e colunas frequentemente utilizadas em filtros.
