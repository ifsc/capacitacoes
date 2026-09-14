# Lab 6 — Arquitetura de contexto no repositório de demonstração

Os quatro pilares do **Módulo 6**, e onde cada um está escrito no projeto de
demonstração.

## Rodar

Para ler os arquivos deste módulo não é preciso subir nada — basta descompactar:

```bash
unzip ../demo-ia/demo-ia.zip
cd demo-ia
```

Como subir a aplicação e trocar de branch: [demo-ia/BRANCHES.md](../demo-ia/BRANCHES.md).

## Onde está cada pilar

| Pilar | Arquivo no projeto | Branch |
| --- | --- | --- |
| Rules / AGENTS.md | `AGENTS.md` (66 linhas) | todos |
| Skills | `.kiro/skills/analisar-chamado/SKILL.md` | todos |
| Skills | `.kiro/skills/pull-request-description/SKILL.md` + `references/pull_request_template.md` | `main` em diante |
| Servidores MCP | `.mcp.json`, e `.kiro/settings/mcp.json` apontando para ele | todos |
| Sub-agentes | nada — a ferramenta gerencia sozinha | — |

## AGENTS.md

Sessenta e seis linhas para um projeto com backend, frontend, banco e mock de
GLPI. A proporção é o que interessa: muito ponteiro, pouco detalhe, e uma seção
de armadilhas conhecidas no fim.

```bash
wc -l AGENTS.md
cat AGENTS.md
```

Repare no que **não** está lá: nada que o agente descubra lendo o `pom.xml` ou o
`package.json`. O arquivo gasta as linhas no que só quem trabalha no projeto
sabe.

## As duas skills

`analisar-chamado` é a mais curta e serve de molde: front matter com `name` e
`description`, depois passos, formato de saída e regras.

```bash
cat .kiro/skills/analisar-chamado/SKILL.md
```

A `description` é o que faz a skill disparar sozinha, então ela é escrita com as
palavras que apareceriam no pedido real. Descrição vaga é skill que nunca
carrega — e cada ferramenta dispara de um jeito diferente (ver
[EQUIVALENCIAS.md](../EQUIVALENCIAS.md)).

`pull-request-description` mostra o passo seguinte: uma skill que carrega um
arquivo de apoio.

```bash
git checkout main
cat .kiro/skills/pull-request-description/SKILL.md
cat .kiro/skills/pull-request-description/references/pull_request_template.md
```

O `references/` só entra no contexto quando a skill é acionada. É o
carregamento sob demanda que o módulo chama de *progressive disclosure*.

## Como conferir cada coisa

**A diferença que o AGENTS.md faz.** Renomeie o arquivo, abra uma sessão nova e
peça algo convencional — *"cria um endpoint de listagem de candidatos por
curso"*. Anote o que sai errado: nome de pacote, padrão de resposta, tratamento
de erro. Restaure o arquivo, abra outra sessão nova e repita o mesmo pedido.

```bash
mv AGENTS.md AGENTS.md.off    # ... e depois mv AGENTS.md.off AGENTS.md
```

É o mesmo modelo nas duas vezes. Muda só o que ele sabia do projeto.

**O resultado real desse pedido.** Os dois branches de feature são exatamente
esse endpoint, gerado ao vivo por caminhos diferentes:

```bash
git diff main feature/1234-test -- backend/
git diff main feature/3456     -- backend/
```

**Uma skill sendo alterada.** O `feature/3456` mexe na skill de descrição de
merge request, além do código:

```bash
git diff main feature/3456 -- .kiro/
```

**A skill disparando.** Abra uma sessão nova e peça a análise de um chamado sem
mencionar a skill. No Kiro o gatilho é a referência explícita
(`#analisar-chamado`); no Claude Code, a `description` casa com o pedido e ela
carrega sozinha. Mesmo conceito, gatilho diferente.

**Que o MCP é um pilar separado.** O `.kiro/settings/mcp.json` é um link
simbólico para o `.mcp.json` da raiz — um arquivo só, lido por duas ferramentas:

```bash
ls -l .kiro/settings/mcp.json
```
