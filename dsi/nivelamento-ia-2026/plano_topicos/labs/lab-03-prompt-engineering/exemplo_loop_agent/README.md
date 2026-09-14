# Exemplo: Loop Agent no OpenCode

## O que é o Loop Agent?

O **goal-agent** é um agente personalizado do OpenCode que executa tarefas de forma autônoma com limite controlado de iterações. Equivalente ao `/goal` do Claude Code.

## Como funciona

| Campo | Valor | O que faz |
|-------|-------|-----------|
| `mode` | `primary` | Aparece na rotação com Tab |
| `steps` | `15` | Máximo de 15 iterações antes de parar |
| `permission.*` | `allow` | Executa tudo sem confirmação |

### Fluxo

```
Você envia tarefa → Agente analisa → Executa iterações → Para ao completar ou atingir limite
```

## Configuração

O agente está em: `~/.config/opencode/agents/goal-agent.md`

```yaml
---
description: Agente autônomo com loops de execução controlados
mode: primary
steps: 15
permission:
  edit: allow
  bash: allow
  read: allow
  glob: allow
  grep: allow
---

Você é um agente autônomo focado em completar tarefas de forma iterativa.
Trabalhe de forma independente até atingir o objetivo definido pelo usuário.
Seja direto, eficiente e não pare até completar a tarefa.
```

## Como usar

### No TUI (Terminal)

1. Abra o opencode: `opencode`
2. Alterne para o agente com **Tab** até ver `goal-agent`
3. Digite sua tarefa e pressione Enter

### Via CLI (Non-interactive)

```bash
opencode run "Implemente uma API REST para gerenciamento de tarefas" --agent goal-agent
```

### Com arquivos

```bash
opencode run "Analise o arquivo @src/utils.ts e refatore" --agent goal-agent
```

## Diferença do Build (padrão)

| | `build` | `goal-agent` |
|--|---------|--------------|
| **Steps** | ∞ infinito | 15 limitado |
| **Modo** | Pergunta antes | Age autonomicamente |
| **Uso** | Qualquer tarefa | Objetivo claro |

## Quando usar

- Tarefas com objetivo definido: "Implemente X", "Refatore Y"
- Quando quer execução autônoma sem interrupções
- Para controle de custos (limite evita loops infinitos)

## Ajustes

Edite `~/.config/opencode/agents/goal-agent.md`:

- **Mais steps**: aumente para tarefas maiores
- **Menos steps**: reduza para tarefas simples
- **Mais permissões**: adicione `webfetch`, `task`, etc.
