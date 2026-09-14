# Equivalências entre ferramentas

Os roteiros do kit não assumem ferramenta. Quando algo muda de nome ou de
lugar, procure aqui.

> **A regra geral:** o conceito é o mesmo em todas. Aprenda o conceito; onde
> fica o arquivo você descobre em dois minutos.

## Onde fica cada coisa

| Conceito | Claude Code | Kiro | Cursor | OpenCode |
| --- | --- | --- | --- | --- |
| Instruções do projeto | `CLAUDE.md` ou `AGENTS.md` | `.kiro/steering/*.md` | `.cursor/rules/` | `AGENTS.md` |
| Conhecimento sob demanda ("skill") | `.claude/skills/<nome>/SKILL.md` | steering com `fileMatch` | rule com `globs` | arquivo de contexto |
| Configuração de MCP | `.mcp.json` | `.kiro/settings/mcp.json` | `.cursor/mcp.json` | config do projeto |
| Gerar as instruções automaticamente | `/init` | `kiro init` | — (peça pelo chat) | — (peça pelo chat) |

Onde não existe comando pronto, **peça em linguagem natural**. Funciona em
todas:

> "Analise este repositório e gere um AGENTS.md com a estrutura, as convenções
> de código e ponteiros para a documentação. Máximo 200 linhas."

## Carregamento sob demanda

**É aqui que as ferramentas realmente divergem** — e a diferença muda como você
usa. O que muda é **como o arquivo é carregado**:

- **Claude Code** — pelo campo `description` do front matter. O agente lê a
  descrição e decide se aquela skill é relevante. Descrição vaga = skill que
  nunca dispara.
- **Kiro** — pelo modo de inclusão declarado no front matter do steering:
  `always` (sempre), `fileMatch` (quando você abre certo tipo de arquivo) ou
  `manual` (você referencia com `#nome`). **Não existe disparo por descrição
  como no Claude Code** — para conhecimento acionado por intenção, o caminho é
  `manual` e você digita `#nome` no pedido.
- **Cursor** — por `globs` de arquivo, ou marcada como "always".

Por isso o passo "ajuste a descrição até disparar" do Lab 6 é diferente em cada
uma — mas o objetivo é idêntico: **fazer o agente encontrar o conhecimento
sozinho, sem você mandar.**

## Formato de uma skill (Claude Code)

```markdown
---
name: nome-em-kebab-case
description: O que faz e QUANDO usar. Escreva com as palavras que o dev usaria
  no pedido — é isso que faz o agente encontrar a skill.
---

# Título

Passos, regras e formato de saída.
```

## Sub-agentes

Nenhuma ferramenta moderna exige que você crie sub-agentes. Todas decidem
sozinhas quando isolar uma tarefa pesada em processo separado. Você foca em
escrever boas skills.

Se quiser forçar, o pedido em linguagem natural funciona em todas:

> "Faça essa varredura num sub-agente e me devolva só o resultado."

## MCP: o formato é padrão

O `.mcp.json` tem a mesma estrutura em todas as ferramentas — muda só o nome e
o lugar do arquivo:

```json
{
  "mcpServers": {
    "nome": {
      "command": "npx",
      "args": ["-y", "pacote-do-servidor"]
    }
  }
}
```

Copiar de uma ferramenta para outra costuma funcionar sem alteração nenhuma.
**Era exatamente esse o problema que o MCP resolveu.**
