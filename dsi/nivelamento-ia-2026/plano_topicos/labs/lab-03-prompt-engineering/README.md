# Lab: Oficina de Prompt Engineering

**Duração:** 45 min

## Sem instalação necessária

Este lab não requer instalação de ferramentas. Os exercícios são feitos diretamente
em modelos disponíveis via navegador — escolha um dos dois:

- **[Google Gemini](https://gemini.google.com)** — acesso gratuito, bom para comparações rápidas
- **[ChatGPT](https://chat.openai.com)** — acesso gratuito com GPT-4o mini, opcionalmente GPT-4o

> Se você tiver acesso ao **Claude (claude.ai)** ou ao **OpenRouter**, pode usá-los também.
> O que importa é ter um modelo aberto na tela para executar os prompts em tempo real.

---

## O que você vai ver

O instrutor vai conduzir as demonstrações ao vivo, mostrando na prática:

1. **Os 5 elementos de um prompt bem estruturado** — Role, Contexto, Tarefa, Output, Exemplos
2. **Os frameworks RTF, CARE e RISE** — quando usar cada um
3. **Pipeline de prompts encadeados** — a saída de um prompt vira a entrada do próximo

**Material de referência dos templates:** [`templates/`](./templates/)

---

## Contexto do lab

Você é desenvolvedor em um app financeiro e recebeu a base
[`user_feedbacks_analyser/base_reclamacoes.json`](./user_feedbacks_analyser/base_reclamacoes.json)
— um dump bruto do sistema de suporte com reclamações reais de usuários.

O problema: o dado está sujo. Tem CPF exposto no texto, número de telefone no meio de uma
reclamação, ticket de teste de desenvolvimento, resposta automática de bot e até uma reclamação
sobre atendimento presencial que nada tem a ver com o software. Nenhum dado desse chega para
análise de produto sem tratamento.

**Objetivo final:** transformar esse dataset bruto em um backlog priorizado de engenharia e
design — bugs críticos, melhorias de UX e novas funcionalidades — usando dois prompts encadeados.
Nenhuma linha de código. Só prompt bem estruturado.

---

## O que você vai fazer

O cenário do lab é um pipeline de análise de feedbacks de usuários em dois passos:

**Passo 1 — Sanitização**
Use o prompt [`user_feedbacks_analyser/prompts/data-sanitizer.md`](./user_feedbacks_analyser/prompts/data-sanitizer.md)
com a base [`user_feedbacks_analyser/base_reclamacoes.json`](./user_feedbacks_analyser/base_reclamacoes.json)
para gerar um dataset limpo e anonimizado.

**Passo 2 — Classificação e backlog**
Use o prompt [`user_feedbacks_analyser/prompts/insights-distiller.md`](./user_feedbacks_analyser/prompts/insights-distiller.md)
com o JSON gerado no passo anterior para extrair um backlog priorizado de engenharia e design.

---

## O que você vai entregar

- [ ] **Passo 1:** JSON sanitizado colado no campo correspondente da ficha
- [ ] **Passo 2:** JSON do backlog priorizado colado no campo correspondente da ficha
- [ ] **Resultado:** cole os JSONs de cada passo — ver [`resultado_pipeline_feedback_analyser.md`](./resultado_pipeline_feedback_analyser.md)


> **Pasta de trabalho:** crie uma subpasta com seu login institucional em slug dentro de `work/`
> (ex: `work/joao.silva/`) para salvar seus arquivos sem conflitar com os demais.


**O que observar:**
- Se há registros que descrevem um bug com detalhes técnicos úteis — modelo de aparelho, fluxo, condição de reprodução
- Se há registros que não têm nenhuma relação com o produto e foram corretamente descartados
- Se algum registro continha dado pessoal e o modelo tratou sem perder o contexto técnico
- Se a severidade atribuída no Passo 2 faz sentido para o tipo de problema relatado
- Se a `proposed_action` gerada é específica o suficiente para um dev agir, ou ficou genérica demais
- Se algum registro ficou numa zona cinzenta — nem claramente relevante nem claramente descartável — e como o modelo decidiu
