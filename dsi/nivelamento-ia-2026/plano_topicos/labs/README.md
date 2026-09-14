# Laboratórios práticos

Guias por módulo, apontando onde cada assunto está nos materiais.

## Encontros 1 e 2 — Fundamentos (instrutor Daniel)

| Guia | O que cobre |
| --- | --- |
| [Lab 1 — Fundamentos de LLMs](lab-01-fundamentos/) | Diagnosticar e mitigar limitações de LLMs (data de corte, alucinações, sobrecarga de contexto) |
| [Lab 2 — Modelos e ecossistema](lab-02-modelos-ecossistema/) | Comparar modelos e tomar decisões (classificação, geração de código, raciocínio complexo) |
| [Lab 3 — Prompt Engineering](lab-03-prompt-engineering/) | Oficina de prompts com frameworks RTF/CARE/RISE em 3 cenários reais |
| [Lab 4 — RAG e Embeddings](lab-04-rag-embeddings/) | Pipeline RAG, embeddings, Graph RAG e projetos demo (vetores e LangGraph) |

## Encontros 3 e 4 — Ferramentas e prática (instrutor Samuel)

O projeto de demonstração usado nos módulos 5, 6 e 7, e um guia por módulo
apontando onde cada assunto está dentro dele.

| Guia | O que aponta |
| --- | --- |
| [Lab 5 — MCP e agentes](lab-05-mcp-agentes/) | Os quatro servidores MCP, os chamados do GLPI simulado, o N+1 do chamado 1234 e os dois casos de injeção de instrução |
| [Lab 6 — Arquitetura de contexto](lab-06-arquitetura-contexto/) | O `AGENTS.md`, as duas skills e o `.mcp.json` — os pilares, nos arquivos |
| [Lab 7 — SDD na prática](lab-07-final-sdd/) | As duas specs do Kiro, uma fase por branch, e os cinco achados de revisão |

## O repositório de demonstração

Serviço acadêmico reduzido — oferta de vagas, candidatos aprovados e matrícula —
com banco populado, chamados fictícios de um GLPI simulado e os MCPs
configurados. Está em [`demo-ia/demo-ia.zip`](demo-ia/), nesta pasta.

```bash
unzip demo-ia/demo-ia.zip
cd demo-ia && ./start.sh
```

O zip traz o **histórico git dentro**: cada etapa da construção virou um branch.

```bash
git checkout inicial                  # a aplicação antes de qualquer IA tocar nela
git checkout f02-implementation-done  # as duas features prontas
```

O mapa dos branches, o passo a passo de instalação e os problemas comuns estão
em [demo-ia/BRANCHES.md](demo-ia/BRANCHES.md).

## O que você precisa

- **Docker, Git, Java 21 e Node 20+** para subir a aplicação.
- **Um agente de código** — Claude Code, Kiro, Cursor, Copilot ou OpenCode. Os
  guias não assumem ferramenta; quando um comando ou caminho muda de nome, a
  tradução está em [EQUIVALENCIAS.md](EQUIVALENCIAS.md).
