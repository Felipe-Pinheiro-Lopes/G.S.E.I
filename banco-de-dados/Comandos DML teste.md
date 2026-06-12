```sql
-- ==========================================================
-- DML - DADOS DE TESTE
-- Projeto G.S.E.I
-- ==========================================================

-- ==========================================================
-- INSTITUICOES
-- ==========================================================

INSERT INTO Instituicoes
(NOME, CNPJ, Responsavel, Telefone, Email)
VALUES
('Escola Municipal São José',
 '12.345.678/0001-90',
 'Maria Oliveira',
 '(15) 99999-1111',
 'contato@saojose.edu.br'),

('ONG Tecnologia para Todos',
 '98.765.432/0001-10',
 'Carlos Mendes',
 '(15) 98888-2222',
 'contato@tecnologiaparatodos.org');

-- ==========================================================
-- USERS
-- ==========================================================

INSERT INTO Users
(NOME, EMAIL, SenhaHash, Role, InstituicaoID, FotoURL)
VALUES
('João Silva',
 'joao@gsei.com',
 'HASH_ADMIN_123',
 'Administrador',
 1,
 'https://site.com/fotos/joao.jpg'),

('Ana Costa',
 'ana@gsei.com',
 'HASH_TECNICO_456',
 'Tecnico',
 1,
 'https://site.com/fotos/ana.jpg'),

('Pedro Souza',
 'pedro@gsei.com',
 'HASH_USER_789',
 'Solicitante',
 2,
 'https://site.com/fotos/pedro.jpg');

-- ==========================================================
-- EQUIPAMENTOS
-- ==========================================================

INSERT INTO Equipamentos
(Codigo, Especificacoes, LOTE, MODELO, STATUS,
 InstituicaoID, Tipo, AprovadoPor)
VALUES

('PC-001',
 'Intel i5, 8GB RAM, SSD 240GB',
 'LOTE-A',
 'Dell Optiplex 7050',
 'Disponivel',
 1,
 'Computador',
 'Ana Costa'),

('MON-001',
 'Monitor LED 21 Polegadas',
 'LOTE-A',
 'LG 21MK',
 'Disponivel',
 1,
 'Monitor',
 'Ana Costa'),

('NOTE-001',
 'Intel i7, 16GB RAM, SSD 512GB',
 'LOTE-B',
 'Lenovo ThinkPad',
 'Em Triagem',
 1,
 'Notebook',
 'Ana Costa');

-- ==========================================================
-- TRIAGENS
-- ==========================================================

INSERT INTO Triagens
(EquipamentoID, CheckListJson, LaudoTecnico,
 Destino, TecnicoResponsavel)
VALUES

(
 1,
 '{"cpu":"ok","memoria":"ok","ssd":"ok"}',
 'Equipamento em perfeito estado.',
 'Reutilizacao',
 'Ana Costa'
),

(
 2,
 '{"tela":"ok","fonte":"ok"}',
 'Monitor apto para doacao.',
 'Reutilizacao',
 'Ana Costa'
),

(
 3,
 '{"bateria":"ruim","teclado":"ok"}',
 'Necessita troca de bateria.',
 'Manutencao',
 'Ana Costa'
);

-- ==========================================================
-- SOLICITACOES
-- ==========================================================

INSERT INTO Solicitacoes
(
 InstituicoesID,
 ResponsavelRetirada,
 TelefoneContato,
 FINALIDADE,
 STATUS,
 PROTOCOLO,
 PRIORIDADE
)
VALUES

(
 2,
 'Pedro Souza',
 '(15) 98888-2222',
 'Montagem de laboratorio de informatica.',
 'Aguardando',
 'SOL-2026-001',
 'Alta'
),

(
 2,
 'Pedro Souza',
 '(15) 98888-2222',
 'Substituicao de computadores antigos.',
 'Em Analise',
 'SOL-2026-002',
 'Media'
);

-- ==========================================================
-- ITENS DA SOLICITACAO
-- ==========================================================

INSERT INTO ItensSolicitacao
(SolicitacaoID, EquipamentoID, QuantidadeSolicitada)
VALUES

(1, 1, 5),
(1, 2, 5),
(2, 3, 2);

-- ==========================================================
-- CONSULTA DE VERIFICACAO
-- ==========================================================

SELECT * FROM Instituicoes;
SELECT * FROM Users;
SELECT * FROM Equipamentos;
SELECT * FROM Triagens;
SELECT * FROM Solicitacoes;
SELECT * FROM ItensSolicitacao;
```
