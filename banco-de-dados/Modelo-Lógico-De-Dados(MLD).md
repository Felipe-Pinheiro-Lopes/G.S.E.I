# Modelo Lógico de Dados (MLD) – G.S.E.I

## 1° Tabela: Instituicoes

**Chave Primária (PK)**

* ID

**Atributos**

* ID
* NOME
* CNPJ
* Responsavel
* Telefone
* Email
* DataCadastro

**Chaves Estrangeiras (FK)**

* Nenhuma

**Forma Normal**

* 3FN

**Justificativa**

* Todos os atributos dependem exclusivamente da chave primária ID.
* Não existem dependências transitivas ou grupos repetitivos.

---

## 2° Tabela: Users

**Chave Primária (PK)**

* ID

**Chaves Estrangeiras (FK)**

* InstituicaoID → Instituicoes(ID)

**Atributos**

* ID
* NOME
* EMAIL
* SenhaHash
* Role
* InstituicaoID
* FotoURL

**Forma Normal**

* 3FN

**Justificativa**

* Os atributos descrevem exclusivamente o usuário.
* A instituição é referenciada por chave estrangeira, evitando redundância.

---

## 3° Tabela: Equipamentos

**Chave Primária (PK)**

* ID

**Chaves Estrangeiras (FK)**

* InstituicaoID → Instituicoes(ID)

**Atributos**

* ID
* Codigo
* Especificacoes
* Lote
* Modelo
* Status
* DataCadastro
* InstituicaoID
* Tipo
* AprovadoPor
* LaudoDescarte

**Forma Normal**

* 3FN

**Justificativa**

* Todos os atributos dependem diretamente do equipamento identificado por ID.

---

## 4° Tabela: Solicitacoes

**Chave Primária (PK)**

* ID

**Chaves Estrangeiras (FK)**

* InstituicaoID → Instituicoes(ID)

**Atributos**

* ID
* InstituicaoID
* ResponsavelRetirada
* TelefoneContato
* Finalidade
* Status
* DataSolicitacao
* Protocolo
* Prioridade

**Forma Normal**

* 3FN

**Justificativa**

* Os dados da solicitação são independentes e dependem apenas da chave primária.

---

## 5° Tabela: Triagens

**Chave Primária (PK)**

* ID

**Chaves Estrangeiras (FK)**

* EquipamentoID → Equipamentos(ID)

**Atributos**

* ID
* EquipamentoID
* CheckListJson
* LaudoTecnico
* Destino
* DataTriagem
* TecnicoResponsavel

**Forma Normal**

* 3FN

**Justificativa**

* Os atributos representam exclusivamente uma triagem realizada sobre um equipamento.

---

## 6° Tabela: ItensSolicitacao

**Chave Primária (PK)**

* ID

**Chaves Estrangeiras (FK)**

* SolicitacaoID → Solicitacoes(ID)
* EquipamentoID → Equipamentos(ID)

**Atributos**

* ID
* SolicitacaoID
* EquipamentoID
* QuantidadeSolicitada

**Forma Normal**

* 3FN

**Justificativa**

* Resolve o relacionamento N:N entre Solicitações e Equipamentos sem redundância.
* Todos os atributos dependem da chave primária.

---

# Conclusão da Normalização

O banco encontra-se na Terceira Forma Normal (3FN).

Critérios atendidos:

* 1FN: atributos atômicos e ausência de grupos repetitivos.
* 2FN: ausência de dependências parciais.
* 3FN: ausência de dependências transitivas.

Não foram identificados campos derivados ou redundantes utilizados para otimização de desempenho.
