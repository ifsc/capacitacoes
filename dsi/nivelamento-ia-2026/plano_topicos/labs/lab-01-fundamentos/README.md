# Lab: Diagnóstico de Limitações
**Duração:** 30 min

## Instalação de Dependências

> **Requisito de hardware:** mínimo **16 GB de RAM** recomendado para o Lab 04 — o modelo de embedding do projeto `01_rag_tradicional_vector_store` roda localmente via HuggingFace e consome memória significativa durante a geração dos vetores.

Execute os comandos abaixo no terminal para instalar tudo necessário:

```bash
# Atualizar repositórios e instalar dependências base
sudo apt update && sudo apt install -y sqlite3 python3 python3-pip python3-venv curl

# Instalar OpenCode
curl -fsSL https://opencode.ai/install | bash

```

**Git** (necessário para os labs de módulos seguintes, verifique se já tem):

```bash
git --version || sudo apt install -y git
```

**Docker** (necessário a partir do Módulo 2, instale com antecedência):

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
# depois de rodar, saia e entre de novo na sessão (logout/login) para o
# grupo "docker" ter efeito, ou rode: newgrp docker
```

**Node.js e npm** (necessário para os labs seguintes):

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node --version && npm --version && npx --version
```

(`npx` já vem incluso com o `npm`, não precisa instalar separado — usamos ele
para rodar MCP Servers via `npx -y <pacote>`.)

**ntl** — menu interativo para rodar scripts npm sem precisar lembrar o nome exato:

```bash
sudo npm install -g ntl
```
Se você estiver usando **VS Code** ou **Kiro**, instale também as extensões:

- **Mermaid** (renderiza diagramas em blocos ` ```mermaid ` dentro do Markdown)
- **Markdown Preview / Markdown Viewer** (visualização renderizada dos
  arquivos `.md` do lab, com formatação, tabelas e links clicáveis)

Isso facilita bastante a leitura dos materiais deste lab, que são todos em
Markdown.

---

## Contas necessárias para o Lab 04

Crie as contas abaixo com antecedência — os projetos demo do Lab 04 precisam
das API keys geradas por elas:

**OpenRouter** — roteador de modelos (acesso a GPT, Claude, DeepSeek etc. numa única API):

1. Acesse [https://openrouter.ai/](https://openrouter.ai/) e crie uma conta
2. Vá em **Keys** e gere uma API key
3. Guarde a key — você vai precisar colocar no `.env` dos projetos do Lab 04

> O OpenRouter oferece modelos gratuitos — nos projetos do Lab 04 os exemplos já estão configurados para usar modelos free.

**LangSmith** — plataforma de observabilidade para agentes e pipelines LLM:

1. Acesse [https://smith.langchain.com/](https://smith.langchain.com/) e crie uma conta
2. Vá em **Settings → API Keys** e gere uma API key
3. Guarde a key — você vai precisar colocar no `.env` dos projetos do Lab 04

> Plano gratuito disponível com limite generoso para uso em workshop.

---

## O que você vai entregar

- [ ] Diagnóstico dos 3 casos (alucinação técnica, data de corte, alucinação
  científica) preenchido na [`ficha-diagnostico.md`](./ficha-diagnostico.md)
- [ ] Prompt reescrito para cada um dos 3 casos, também na ficha
- [ ] Bônus (opcional): cálculo de tokens comparando dois modelos no
  OpenRouter — ver seção [Bônus: Cálculo de Tokens](#bônus-cálculo-de-tokens)

**Prompts dos 3 casos:** ver pasta [`prompts/`](./prompts/)

> **Antes de tudo:** dentro da pasta [`work/`](./work/), crie uma subpasta com
> o seu login institucional em slug (ex: `work/joao.silva/`) e rode o OpenCode
> a partir dela (`mkdir -p work/<seu-login> && cd work/<seu-login> && opencode`).
> Isso evita que arquivos soltos gerados pelo agente (código, testes, etc.)
> fiquem espalhados na pasta do lab, e evita conflito entre o material de
> alunos diferentes.

---

## Bônus: Cálculo de Tokens

Peça para os alunos pegarem o prompt do **Caso 3 — alucinação científica**
(em
[`prompts/caso-03-alucinacao-cientifica.md`](./prompts/caso-03-alucinacao-cientifica.md))
e colarem no playground do OpenRouter, comparando dois modelos ao mesmo tempo.
Esse prompt gera um texto mais longo com referências bibliográficas, o que dá
uma visualização melhor da diferença de tokens/custo entre os modelos do que
os outros casos, mais curtos:

[OpenRouter Chat — Claude Opus 4.7 vs DeepSeek v4 Pro](https://openrouter.ai/chat?models=anthropic/claude-opus-4.7,deepseek/deepseek-v4-pro)

Prompt para colar (Caso 3):

```
Escreva um texto de 2 parágrafos sobre os impactos da inteligência artificial
generativa na produtividade de desenvolvedores de software, para um trabalho
acadêmico. Siga as normas ABNT, incluindo citação de autor no corpo do texto
(sistema autor-data) e a referência bibliográfica completa ao final.
```

**O que comparar entre os dois modelos:**

- Tokens de input/output e custo estimado (o próprio OpenRouter mostra)
- Latência de resposta
- Qualidade: qual modelo alucinou menos referências? (peça para os alunos
  conferirem no Gemini, como no Caso 3, e comparar o placar entre os dois
  modelos)