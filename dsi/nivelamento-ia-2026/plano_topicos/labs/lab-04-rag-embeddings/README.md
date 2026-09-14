# Lab 04 — RAG + Embeddings na Prática

**Duração:** 40 min

---

## O que você vai aprender

Neste lab você vai rodar um RAG real do zero: um assistente que lê uma base de chamados do
**Sistema de Ingresso do IFSC** e responde perguntas de suporte em linguagem natural, buscando
os trechos mais relevantes via busca vetorial no Neo4j.

Você vai ver cada etapa do pipeline funcionando, inspecionar os chunks armazenados diretamente
no banco, e identificar no código onde cada peça se encaixa.

---

## Contexto — O que é Neo4j e Vector Store

**Neo4j** é um banco de dados orientado a grafos que também suporta busca vetorial. Neste lab
ele é usado como **vector store**: cada chunk de texto é armazenado como um nó com um vetor
de 384 dimensões, e a busca por similaridade encontra os nós mais próximos da pergunta.

**Cypher** é a linguagem de consulta do Neo4j. Você vai usá-la para inspecionar os chunks
diretamente no banco após a indexação.

---

## Projeto do Lab

```
projetos_demo/01_rag_tradicional_vector_store/
```

Este projeto implementa um RAG tradicional com dois modos:

| Script | Documento base | Contexto |
|--------|---------------|---------|
| `npm start` | `base_documental/modulo01.pdf` | Perguntas sobre TensorFlow/ML |
| `npm run start:ingresso` | `base_documental/rag_ingresso_doc_chamados.pdf` | Suporte ao Sistema de Ingresso IFSC |

> **O foco do lab é o `start:ingresso`** — base de chamados real do IFSC com soluções documentadas.

---

## Pré-requisitos

- Node.js v22.13.1 ou superior
- Docker e Docker Compose instalados
- Arquivo `.env` configurado (veja `env.example`)

---

## Passo a Passo

### 1. Instalar dependências

```bash
cd projetos_demo/01_rag_tradicional_vector_store
npm install
```

### 2. Subir o Neo4j

```bash
npm run infra:up
```

Aguarde o container subir. O Neo4j ficará disponível em:

- **Neo4j Browser:** http://localhost:7475
- **Bolt URI:** `bolt://localhost:7699`
- **Usuário:** `neo4j`
- **Senha:** `password`

### 3. Configurar o `.env`

Copie o arquivo de exemplo e preencha sua chave do OpenRouter:

```bash
cp .env.example .env
```

Edite o `.env` e substitua `sk-or-v1-sua-chave-aqui` pela sua chave de API do OpenRouter.
As demais variáveis já estão configuradas para o ambiente local.

### 4. Rodar o RAG do Sistema de Ingresso

```bash
npm run start:ingresso
```

O sistema vai:
1. Carregar e dividir o PDF de chamados em chunks
2. Gerar embeddings localmente via HuggingFace (sem API externa)
3. Armazenar os chunks no Neo4j com label `ChunkIngresso`
4. Executar 2 perguntas de exemplo e salvar as respostas em `respostas/`

Ao final você verá no terminal:

```
🗄️  Visualize os embeddings no Neo4j Browser: http://localhost:7475
     Consulta: MATCH (n:ChunkIngresso) RETURN n LIMIT 25
```

---

## Explorando os Chunks no Neo4j Browser

### Acessar o Neo4j Browser

1. Abra **http://localhost:7475** no navegador
2. Na tela de conexão, preencha:
   - **Connect URL:** `bolt://localhost:7699`
   - **Username:** `neo4j`
   - **Password:** `password`
3. Clique em **Connect**

### Consultas para explorar os dados

**Ver os primeiros 25 chunks indexados:**
```cypher
MATCH (n:ChunkIngresso)
RETURN n.text, n.id
LIMIT 25
```

**Contar quantos chunks existem:**
```cypher
MATCH (n:ChunkIngresso)
RETURN count(n) AS total_chunks
```

**Buscar chunks sobre adição de usuários/perfis de acesso:**
```cypher
MATCH (n:ChunkIngresso)
WHERE toLower(n.text) CONTAINS 'perfil'
   OR toLower(n.text) CONTAINS 'acesso'
   OR toLower(n.text) CONTAINS 'administrador'
RETURN n.text
LIMIT 10
```

**Buscar chunks sobre retrocesso de chamada:**
```cypher
MATCH (n:ChunkIngresso)
WHERE toLower(n.text) CONTAINS 'retroceder'
   OR toLower(n.text) CONTAINS 'chamada'
RETURN n.text
LIMIT 10
```

**Ver um chunk completo com todas as propriedades (incluindo o vetor):**
```cypher
MATCH (n:ChunkIngresso)
RETURN n
LIMIT 1
```

> Clique no nó no visualizador gráfico para ver o vetor de embedding armazenado.
> Ele tem 384 dimensões — cada número representa uma dimensão do espaço semântico.

---

## Identificando as Etapas do Pipeline no Código

Após rodar o `start:ingresso`, abra o código e localize cada etapa do pipeline.
Use a tabela abaixo como guia:

| Etapa | O que procurar | Arquivo |
|-------|---------------|---------|
| **1. Carregamento do PDF** | `PDFLoader`, `loadAndSplit` | `src/documentProcessor.ts` |
| **2. Chunking** | `chunkSize`, `chunkOverlap`, `RecursiveCharacterTextSplitter` | `src/documentProcessor.ts` |
| **3. Geração de Embeddings** | `HuggingFaceTransformersEmbeddings`, `modelName` | `src/index.ingresso.ts` |
| **4. Armazenamento no Neo4j** | `Neo4jVectorStore.fromDocuments`, `nodeLabel: "ChunkIngresso"` | `src/index.ingresso.ts` |
| **5. Busca por Similaridade** | `similaritySearchWithScore`, `topK` | `src/ai.ts` |
| **6. Injeção no Prompt** | `ChatPromptTemplate.fromTemplate`, `context` | `src/ai.ts` |
| **7. Configuração do Prompt** | `role`, `task`, `instructions` | `prompts/answerPrompt.ingresso.json` |

### O que observar em cada etapa

**Chunking (`src/documentProcessor.ts`):**
- `chunkSize: 1200` — cada chunk tem no máximo 1200 caracteres
- `chunkOverlap: 300` — os últimos 300 caracteres de um chunk aparecem no início do próximo
- Por que o overlap existe? Para não perder contexto que fica na fronteira entre chunks

**Embeddings (`src/index.ingresso.ts`):**
- O modelo `all-MiniLM-L6-v2` roda **localmente** — sem chamar API externa
- Gera vetores de 384 dimensões por chunk
- `dtype: "fp32"` — qualidade máxima (vs. versões quantizadas menores e mais rápidas)

**Dois índices separados no mesmo Neo4j:**
- `start` usa `nodeLabel: "Chunk"` e `indexName: "tensors_index"`
- `start:ingresso` usa `nodeLabel: "ChunkIngresso"` e `indexName: "ingresso_index"`
- Isso evita que os embeddings de documentos diferentes se misturem na busca

**Busca vetorial (`src/ai.ts`):**
- `similaritySearchWithScore` retorna os chunks mais próximos com seu score de similaridade
- Chunks com score `< 0.5` são descartados
- Os chunks válidos são concatenados e injetados como `{context}` no prompt

**Prompt de suporte (`prompts/answerPrompt.ingresso.json`):**
- `role` define o personagem do assistente
- `instructions` orientam priorizar soluções pela interface do sistema
- `temperature: 0.2` — mais determinístico que o RAG de tensores (0.3)

---

## Preenchendo a Ficha

Abra a **[ficha-lab-04.md](./ficha-lab-04.md)** e registre o que você encontrou.

---

## Limpeza

Para parar e remover o Neo4j:

```bash
npm run infra:down
```

Para limpar os chunks e reindexar do zero (sem parar o container):
```cypher
-- No Neo4j Browser
MATCH (n:ChunkIngresso) DETACH DELETE n
```
