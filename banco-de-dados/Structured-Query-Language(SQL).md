# Estrutura Física do Banco de Dados

## Projeto G.S.E.I - Gestão Sustentável de Equipamentos de Informática

Este documento apresenta o modelo físico do banco de dados PostgreSQL utilizado pelo sistema.

---

# Tabela: Instituicoes

```sql
CREATE TABLE Instituicoes (
    ID SERIAL PRIMARY KEY,
    NOME VARCHAR(255) NOT NULL,
    CNPJ VARCHAR(20) UNIQUE NOT NULL,
    Responsavel VARCHAR(255),
    Telefone VARCHAR(20),
    Email VARCHAR(255),
    DataCadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Restrições

| Tipo | Campo |
| ---- | ----- |
| PK   | ID    |
| UK   | CNPJ  |

---

# Tabela: Users

```sql
CREATE TABLE Users (
    ID SERIAL PRIMARY KEY,
    NOME VARCHAR(255) NOT NULL,
    EMAIL VARCHAR(255) UNIQUE NOT NULL,
    SenhaHash VARCHAR(255) NOT NULL,
    Role VARCHAR(50),
    InstituicaoID INT REFERENCES Instituicoes(ID),
    FotoURL VARCHAR(500)
);
```

### Restrições

| Tipo | Campo         |
| ---- | ------------- |
| PK   | ID            |
| FK   | InstituicaoID |
| UK   | EMAIL         |

---

# Tabela: Equipamentos

```sql
CREATE TABLE Equipamentos (
    ID SERIAL PRIMARY KEY,
    Codigo VARCHAR(100) UNIQUE NOT NULL,
    Especificacoes TEXT,
    LOTE VARCHAR(100),
    MODELO VARCHAR(100),
    STATUS VARCHAR(50),
    DataCadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    InstituicaoID INT REFERENCES Instituicoes(ID),
    Tipo VARCHAR(100),
    AprovadoPor VARCHAR(255),
    LaudoDescarte TEXT
);
```

### Restrições

| Tipo | Campo         |
| ---- | ------------- |
| PK   | ID            |
| FK   | InstituicaoID |
| UK   | Codigo        |

---

# Tabela: Solicitacoes

```sql
CREATE TABLE Solicitacoes (
    ID SERIAL PRIMARY KEY,
    InstituicoesID INT REFERENCES Instituicoes(ID),
    ResponsavelRetirada VARCHAR(255),
    TelefoneContato VARCHAR(20),
    FINALIDADE TEXT,
    STATUS VARCHAR(50),
    DataSolicitacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PROTOCOLO VARCHAR(100) UNIQUE,
    PRIORIDADE VARCHAR(50)
);
```

### Restrições

| Tipo | Campo          |
| ---- | -------------- |
| PK   | ID             |
| FK   | InstituicoesID |
| UK   | PROTOCOLO      |

---

# Tabela: Triagens

```sql
CREATE TABLE TRIAGENS (
    ID SERIAL PRIMARY KEY,
    EquipamentoID INT REFERENCES Equipamentos(ID),
    CheckListJson JSON,
    LaudoTecnico TEXT,
    Destino VARCHAR(255),
    DataTriagem TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    TecnicoResponsavel VARCHAR(255)
);
```

### Restrições

| Tipo | Campo         |
| ---- | ------------- |
| PK   | ID            |
| FK   | EquipamentoID |

---

# Tabela: ItensSolicitacao

```sql
CREATE TABLE ITENSSOLICITACAO (
    ID SERIAL PRIMARY KEY,
    SolicitacaoID INT REFERENCES Solicitacoes(ID),
    EquipamentoID INT REFERENCES Equipamentos(ID),
    QuantidadeSolicitada INT
);
```

### Restrições

| Tipo | Campo         |
| ---- | ------------- |
| PK   | ID            |
| FK   | SolicitacaoID |
| FK   | EquipamentoID |

---

# Relacionamentos

* Instituicoes (1) → (N) Users
* Instituicoes (1) → (N) Equipamentos
* Instituicoes (1) → (N) Solicitacoes
* Equipamentos (1) → (N) Triagens
* Solicitacoes (N) ↔ (N) Equipamentos (via ItensSolicitacao)

---

# Observações

* Banco de dados: PostgreSQL
* Chaves primárias utilizam SERIAL.
* Integridade referencial garantida por FOREIGN KEYS.
* Campos únicos utilizam UNIQUE.
* Datas de cadastro são preenchidas automaticamente com CURRENT_TIMESTAMP.
    