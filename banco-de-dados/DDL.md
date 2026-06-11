# Script DDL Completo - Projeto G.S.E.I

```sql
-- ==========================================================
-- G.S.E.I - Gestão Sustentável de Equipamentos de Informática
-- Script DDL PostgreSQL
-- ==========================================================

DROP TABLE IF EXISTS ItensSolicitacao CASCADE;
DROP TABLE IF EXISTS Triagens CASCADE;
DROP TABLE IF EXISTS Solicitacoes CASCADE;
DROP TABLE IF EXISTS Equipamentos CASCADE;
DROP TABLE IF EXISTS Users CASCADE;
DROP TABLE IF EXISTS Instituicoes CASCADE;

-- ==========================================================
-- TABELA INSTITUICOES
-- ==========================================================

CREATE TABLE Instituicoes (
    ID SERIAL PRIMARY KEY,
    NOME VARCHAR(255) NOT NULL,
    CNPJ VARCHAR(20) UNIQUE NOT NULL,
    Responsavel VARCHAR(255),
    Telefone VARCHAR(20),
    Email VARCHAR(255),
    DataCadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- TABELA USERS
-- ==========================================================

CREATE TABLE Users (
    ID SERIAL PRIMARY KEY,
    NOME VARCHAR(255) NOT NULL,
    EMAIL VARCHAR(255) UNIQUE NOT NULL,
    SenhaHash VARCHAR(255) NOT NULL,
    Role VARCHAR(50),
    InstituicaoID INT,
    FotoURL VARCHAR(500),

    CONSTRAINT FK_User_Instituicao
        FOREIGN KEY (InstituicaoID)
        REFERENCES Instituicoes(ID)
);

-- ==========================================================
-- TABELA EQUIPAMENTOS
-- ==========================================================

CREATE TABLE Equipamentos (
    ID SERIAL PRIMARY KEY,
    Codigo VARCHAR(100) UNIQUE NOT NULL,
    Especificacoes TEXT,
    LOTE VARCHAR(100),
    MODELO VARCHAR(100),
    STATUS VARCHAR(50),
    DataCadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    InstituicaoID INT,
    Tipo VARCHAR(100),
    AprovadoPor VARCHAR(255),
    LaudoDescarte TEXT,

    CONSTRAINT FK_Equipamento_Instituicao
        FOREIGN KEY (InstituicaoID)
        REFERENCES Instituicoes(ID)
);

-- ==========================================================
-- TABELA SOLICITACOES
-- ==========================================================

CREATE TABLE Solicitacoes (
    ID SERIAL PRIMARY KEY,
    InstituicoesID INT,
    ResponsavelRetirada VARCHAR(255),
    TelefoneContato VARCHAR(20),
    FINALIDADE TEXT,
    STATUS VARCHAR(50),
    DataSolicitacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PROTOCOLO VARCHAR(100) UNIQUE,
    PRIORIDADE VARCHAR(50),

    CONSTRAINT FK_Solicitacao_Instituicao
        FOREIGN KEY (InstituicoesID)
        REFERENCES Instituicoes(ID)
);

-- ==========================================================
-- TABELA TRIAGENS
-- ==========================================================

CREATE TABLE Triagens (
    ID SERIAL PRIMARY KEY,
    EquipamentoID INT,
    CheckListJson JSON,
    LaudoTecnico TEXT,
    Destino VARCHAR(255),
    DataTriagem TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    TecnicoResponsavel VARCHAR(255),

    CONSTRAINT FK_Triagem_Equipamento
        FOREIGN KEY (EquipamentoID)
        REFERENCES Equipamentos(ID)
);

-- ==========================================================
-- TABELA ITENSSOLICITACAO
-- ==========================================================

CREATE TABLE ItensSolicitacao (
    ID SERIAL PRIMARY KEY,
    SolicitacaoID INT,
    EquipamentoID INT,
    QuantidadeSolicitada INT,

    CONSTRAINT FK_ItemSolicitacao_Solicitacao
        FOREIGN KEY (SolicitacaoID)
        REFERENCES Solicitacoes(ID),

    CONSTRAINT FK_ItemSolicitacao_Equipamento
        FOREIGN KEY (EquipamentoID)
        REFERENCES Equipamentos(ID)
);

-- ==========================================================
-- ÍNDICES
-- ==========================================================

CREATE INDEX IDX_Equipamentos_Status
ON Equipamentos(STATUS);

CREATE INDEX IDX_Equipamentos_Tipo
ON Equipamentos(Tipo);

CREATE INDEX IDX_Solicitacoes_Status
ON Solicitacoes(STATUS);

CREATE INDEX IDX_Triagens_Destino
ON Triagens(Destino);
```
