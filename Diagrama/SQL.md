-----------------------------------------
TABELA INSTITUICOES
-----------------------------------------
CREATE TABLE Instituicoes (
    ID SERIAL PRIMARY KEY,
    NOME VARCHAR(255) NOT NULL,
    CNPJ VARCHAR(20) UNIQUE NOT NULL,
    Responsavel VARCHAR(255),
    Telefone VARCHAR(20),
    Email VARCHAR(255),
    DataCadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-----------------------------------------
TABELA USERS                            
-----------------------------------------
-- Usuários dependem de Instituições
CREATE TABLE Users (
    ID SERIAL PRIMARY KEY,
    NOME VARCHAR(255) NOT NULL,
    EMAIL VARCHAR(255) UNIQUE NOT NULL,
    SenhaHash VARCHAR(255) NOT NULL,
    Role VARCHAR(50),
    InstituicaoID INT REFERENCES Instituicoes(ID),
    FotoURL VARCHAR(500)
);
-----------------------------------------
TABELA EQUIPAMENTOS
-----------------------------------------
-- Equipamentos dependem de Instituições
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
-----------------------------------------
TABELA SOLICITACOES
-----------------------------------------
-- Solicitações dependem de Instituições
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
-----------------------------------------
TABELA TRIAGENS
-----------------------------------------
-- Triagens dependem de Equipamentos
CREATE TABLE TRIAGENS (
    ID SERIAL PRIMARY KEY,
    EquipamentoID INT REFERENCES Equipamentos(ID),
    CheckListJson JSON,
    LaudoTecnico TEXT,
    Destino VARCHAR(255),
    DataTriagem TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    TecnicoResponsavel VARCHAR(255)
);

-----------------------------------------
TABELA ITENSSOLICITACOES
-----------------------------------------
-- Tabela associativa entre Solicitações e Equipamentos
CREATE TABLE INTENSSOLICITACAO (
    ID SERIAL PRIMARY KEY,
    SolicitacaoID INT REFERENCES Solicitacoes(ID),
    EquipamentoID INT REFERENCES Equipamentos(ID),
    QuantidadeSolicitada INT
);