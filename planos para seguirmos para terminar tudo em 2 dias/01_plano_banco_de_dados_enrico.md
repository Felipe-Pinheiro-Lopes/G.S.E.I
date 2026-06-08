# Plano de Trabalho - Banco de Dados
**Responsavel:** Enrico  
**Prazo:** 2 dias  
**Professor:** Prof Andre  
**Criterios abrangidos:** Cenarios Relacional, NoSQL e Integrado (BD)

## Objetivo
Garantir que a modelagem, implementacao e documentacao do banco de dados atendam a todos os criterios de avaliacao da disciplina, atingindo a nota maxima.

## Tarefas

### 1. Dicionario de Dados (Criterio 10 - Documentacao)
Criar um arquivo `docs/banco-de-dados/dicionario-dados.md` (ou PDF) contendo:
- Tabelas: Equipamentos, Instituicoes, Solicitacoes, ItemSolicitacao, Triagens, Users, Movimentacoes
- Para cada tabela: nome, descricao, colunas (nome, tipo, nulabilidade, restricoes, default)
- Indices unicos e compostos
- Relacionamentos (chaves estrangeiras)
- Exemplos de dados representativos

Templates sugeridos:
- Tabela `Equipamentos`: Id, Codigo (UNIQUE), Modelo, Especificacoes, Lote, Status, DataEntrada, InstituicaoId (FK nullable), Tipo, AprovadoPor, LaudoDescarte
- Tabela `Triagens`: Id, EquipamentoId (FK), ChecklistJson, LaudoTecnico, Destino, DataTriagem, TecnicoResponsavel

### 2. Modelo Logico Relacional (MLD) + Normalizacao
Materializar o MLD em documento `docs/banco-de-dados/modelo-logico.md` ou `.puml`:
- Listar todas as tabelas com atributos separados por chaves
- Mostrar chaves primarias e estrangeiras explicitamente
- Indicar a forma normal alcançada (minimo 3FN) para cada tabela
- Justificar eventuais desvios (ex.: campos derivados para performance)

Envie o diagrama tambem como imagem PNG exportada do PlantUML ou draw.io.

### 3. Revisao do Esquema fisico
Verificar contra `API/Data/AppDbContext.cs` e `API/Migrations/` se ha:
- Tabelas sem indice em colunas usadas em filtros (ex.: `Equipamentos.Status`, `Triagens.EquipamentoId`)
- Inconsistencias entre o codigo e o MLD documentado

### 4. Entregas
| Arquivo | Local | Descricao |
|---------|-------|-----------|
| dicionario-dados.md | docs/banco-de-dados/ | Documento completo |
| modelo-logico.md | docs/banco-de-dados/ | MLD e normalizacao |
| modelo-logico.png | docs/banco-de-dados/ | Diagrama exportado |

## Observacoes
- Os diagramas UML de BD sao de sua responsabilidade.
- Se optar por cenário NoSQL/Hibrido, ajustar a documentacao para refletir a modelagem nao relacional tambem.
- Use o `Diagrama/diagrama de uso.puml` existente como base de nomenclatura.
