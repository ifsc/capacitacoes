# Ficha Lab 04 — RAG + Embeddings na Prática

> **Como usar esta ficha:**
> 1. Copie para `work/<seu-login>/ficha-lab-04.md` (ex: `work/joao.silva/ficha-lab-04.md`)
> 2. Preencha cada seção substituindo os `___` pelo que você encontrar no código e no banco
> 3. O objetivo é registrar onde cada etapa acontece e o que você observou — não precisa ser perfeito

---

## Parte 1 — Rodando o RAG do Sistema de Ingresso

Após rodar `npm run start:ingresso`, anote o que o terminal exibiu:

**Quantos chunks foram inseridos no Neo4j?**
```
___
```

**Qual foi a URL exibida no log para acessar o Neo4j Browser?**
```
___
```

**As respostas foram salvas em qual pasta?**
```
___
```

---

## Parte 2 — Explorando os Chunks no Neo4j Browser

Acesse o Neo4j Browser e conecte com:
- URL web: http://localhost:7475
- Connect URL (Bolt): `bolt://localhost:7699`
- Usuário: `neo4j`
- Senha: `password`

### 2.1 — Contagem de chunks

Execute a consulta abaixo e anote o resultado:

```cypher
MATCH (n:ChunkIngresso)
RETURN count(n) AS total_chunks
```

**Total de chunks indexados:**
```
___
```

### 2.2 — Chunks sobre perfis e acesso de usuários

Execute:

```cypher
MATCH (n:ChunkIngresso)
WHERE toLower(n.text) CONTAINS 'perfil'
   OR toLower(n.text) CONTAINS 'acesso'
   OR toLower(n.text) CONTAINS 'administrador'
RETURN n.text
LIMIT 5
```

**Quantos resultados retornou?**
```
___
```

**O conteúdo do primeiro chunk faz sentido para uma pergunta sobre adição de usuários? (sim/não/parcialmente)**
```
___
```

### 2.3 — Visualizando o vetor de embedding

Execute:

```cypher
MATCH (n:ChunkIngresso)
RETURN n
LIMIT 1
```

Clique no nó exibido no visualizador gráfico e observe as propriedades.

**O embedding está visível nas propriedades do nó? (sim/não)**
```
___
```

**Quantas dimensões o vetor tem? (olhe o tamanho do array)**
```
___
```

---

## Parte 3 — Mapeamento das Etapas no Código

Abra o projeto `projetos_demo/01_rag_tradicional_vector_store/` e para cada etapa abaixo,
cole o trecho de código responsável por ela.

> **Exemplo — Etapa 1: Carregamento e Chunking**
> Arquivo: `src/documentProcessor.ts`
> ```ts
> const loader = new PDFLoader(this.pdfPath)
> const splitter = new RecursiveCharacterTextSplitter(this.textSplitterConfig)
> ```

---

### Etapa 1 — Carregamento e Chunking

> Onde o PDF é lido e dividido em pedaços menores.

Arquivo: `___`
```ts
// cole o trecho aqui
```

---

### Etapa 2 — Geração de Embeddings

> Onde cada chunk é transformado em vetor numérico.

Arquivo: `___`
```ts
// cole o trecho aqui
```

---

### Etapa 3 — Armazenamento no Neo4j

> Onde os chunks com seus vetores são gravados no banco.

Arquivo: `___`
```ts
// cole o trecho aqui
```

---

### Etapa 4 — Busca por Similaridade

> Onde a pergunta do usuário é comparada com os chunks armazenados.

Arquivo: `___`
```ts
// cole o trecho aqui
```

---

### Etapa 5 — Injeção no Prompt e Resposta

> Onde os chunks recuperados entram no prompt enviado ao LLM.

Arquivo: `___`
```ts
// cole o trecho aqui
```

---

## Parte 4 — Experimento

Escolha **uma** das alterações abaixo, aplique em `src/config.ingresso.ts`, rode novamente e compare:

- [ ] **Opção A:** Reduza o `topK` de 4 para 1 (só o chunk mais similar)
- [ ] **Opção B:** Aumente o `chunkSize` de 1200 para 2400 (chunks maiores)
- [ ] **Opção C:** Mude o score mínimo de `0.5` para `0.8` em `src/ai.ts` (filtro mais rígido)

**Alteração escolhida e valor aplicado:**
```
___________________________________________________________________
```

**Pergunta usada no teste:**
```
___________________________________________________________________
```

**Resposta antes da alteração (resumo):**
```
___________________________________________________________________
___________________________________________________________________
```

**Resposta depois da alteração (resumo):**
```
___________________________________________________________________
___________________________________________________________________
```

**O que mudou? O que você acha que causou a diferença?**
```
___________________________________________________________________
___________________________________________________________________
```

---

## Parte 5 — Reflexão

**Qual etapa do pipeline você achou mais fácil de localizar no código? Por quê?**
```
___________________________________________________________________
```

**A separação de `nodeLabel` entre os dois RAGs (Chunk vs. ChunkIngresso) faz sentido para você agora? Explique com suas palavras:**
```
___________________________________________________________________
___________________________________________________________________
```

**Se você fosse adaptar este RAG para uma nova base de documentos do seu projeto, quais 3 arquivos você precisaria alterar?**
```
1. ___
2. ___
3. ___
```

---

## 🎁 Bônus — Explorando o Graph RAG com LangGraph

> Esta seção é opcional. Se você terminou as partes anteriores e quer ver para onde o RAG
> evolui quando o domínio tem dados relacionados, tente rodar o projeto `02_graph_rag_langgraph`.

### Como rodar

```bash
cd projetos_demo/02_graph_rag_langgraph
npm install
cp .env.example .env   # preencha sua OPENROUTER_API_KEY
npm run docker:infra:up
npm run seed           # popula o Neo4j com alunos, cursos e compras
npm start
```

Com o servidor rodando, faça uma pergunta:

```bash
curl -X POST http://localhost:4000/sales \
  -H "Content-Type: application/json" \
  -d '{"question": "Quais cursos são comprados juntos com mais frequência?"}'
```

### O que você vai notar de diferente

O pipeline do `02_graph_rag_langgraph` tem etapas extras que o `01_rag_tradicional_vector_store` não tem. Liste abaixo quais você identificou olhando o código ou o README do projeto 02:

**Etapas que existem no Graph RAG mas não existem no RAG tradicional:**

```
1. ___________________________________________________________________
2. ___________________________________________________________________
3. ___________________________________________________________________
```

**Por que o RAG tradicional não precisaria dessas etapas extras?**

```
___________________________________________________________________
___________________________________________________________________
```

**Qual tipo de pergunta o RAG tradicional responderia bem mas o Graph RAG seria excessivo? Dê um exemplo:**

```
___________________________________________________________________
```

**Qual tipo de pergunta só o Graph RAG consegue responder? Dê um exemplo:**

```
___________________________________________________________________
```
