# Capacitação DSI — Aprimoramento em Desenvolvimento Auxiliado por IA

> **Nome oficial:** REI-DTIC-DSI CURSO DE APRIMORAMENTO EM DESENVOLVIMENTO AUXILIADO POR INTELIGÊNCIA ARTIFICIAL ORIENTADO À SPEC DRIVEN DEVELOPMENT - SDD

**Instituição:** Instituto Federal de Santa Catarina (IFSC) — Reitoria  
**Departamento:** DSI — Departamento de Sistemas de Informação  
**Chefe do Departamento:** Gilberto José de Souza Coutinho (gilberto.coutinho@ifsc.edu.br)  
**Carga horária:** 16 horas (7 módulos)  
**Período:** Agosto a Setembro de 2026  
**Licença:** MIT

## Instrutores

| Nome | Cargo | E-mail |
|------|-------|--------|
| Daniel Severo Estrázulas | Analista de Tecnologia da Informação | daniel.estrazulas@ifsc.edu.br |
| Samuel Bristot Loli | Analista de Tecnologia da Informação | samuel.bristot@ifsc.edu.br |

## Sobre a Capacitação

Esta capacitação foi desenvolvida pela DSI/IFSC para nivelar as equipes dos departamentos de sistemas dos institutos federais no uso de Inteligência Artificial para desenvolvimento de software. O curso aborda desde os fundamentos de LLMs até técnicas avançadas como RAG, MCP, agentes de IA e Spec-Driven Development (SDD).

Todo o material didático, códigos e projetos práticos são disponibilizados sob licença aberta, permitindo reutilização e adaptação por outras instituições.

## Estrutura da Capacitação

| Dia | Módulo | Tema | Duração | Laboratório |
| --- | --- | --- | --- | --- |
| 1 | M1 — Como LLMs Funcionam de Verdade | Autocomplete, tokens, limitações, fine-tuning vs RAG | 2h | 30 min — Diagnosticar e mitigar limitações |
| 1 | M2 — Ecossistema Open-Source e Execução Local | Ollama, Hugging Face, parâmetros, nuvem vs local | 1h30 | 30 min — Rodar modelo local vs API na nuvem |
| 2 | M3 — Prompt Engineering na Prática | 5 elementos, RTF/CARE/RISE, Zero/Few-shot, CoT | 2h30 | 45 min — Oficina de prompts em 3 cenários reais |
| 2 | M4 — RAG, Embeddings e Engenharia de Contexto | Pipeline RAG, embeddings, Graph RAG, progressive disclosure | 2h | 30 min — Visualizar embeddings e pipeline RAG |
| 3 | M5 — MCP e Agentes de IA | Arquitetura MCP, agentes, loop de execução, MCP vs Skill vs API | 2h | 30 min — Configurar MCP Server |
| 3 | M6 — Arquitetura de Contexto | Rules/Agents.md, Skills modulares, sub-agents, 4 pilares | 2h | 35 min — Criar Agents.md e skill |
| 4 | M7 — SDD e Ferramentas na Prática | 4 fases do SDD, STATE.md, frameworks, RPI, validação de código | 3h | 70 min — Workshop prático completo |

> **Totais:** ~16h (7 módulos) · ~8h teoria · ~4h30 laboratórios práticos

## Materiais Didáticos

| Arquivo / Pasta | Resumo |
| --- | --- |
| [workshop-ia-para-devs.md](plano_topicos/workshop-ia-para-devs.md) | Conteudo programatico completo do workshop, modulos 1 a 7, com topicos, laboratorios e glossario com 109 termos. |
| [material-didatico-parte1.md](plano_topicos/material-didatico-parte1.md) | Material do aluno (Modulos 1-4): explicacoes, exemplos, referencias e laboratorios. |
| [material-didatico-parte1.pdf](plano_topicos/material-didatico-parte1.pdf) | Versao PDF do material do aluno (Modulos 1-4), com imagens e links preservados. |
| [material-didatico-parte2.md](plano_topicos/material-didatico-parte2.md) | Material do aluno (Módulos 5-7): MCP e agentes, arquitetura de contexto e SDD na prática, com os slides de cada encontro. |
| [material-didatico-parte2.pdf](plano_topicos/material-didatico-parte2.pdf) | Versao PDF do material do aluno (Modulos 5-7), com imagens e links preservados. |

## Projetos Práticos Desenvolvidos

### Encontros 1 e 2 — Fundamentos (instrutor Daniel)

| Laboratório | Resumo |
| --- | --- |
| [lab-01-fundamentos](plano_topicos/labs/lab-01-fundamentos) | Diagnosticar e mitigar limitações de LLMs (data de corte, alucinações). |
| [lab-02-modelos-ecossistema](plano_topicos/labs/lab-02-modelos-ecossistema) | Comparar modelos e tomar decisões (classificação, geração de código, raciocínio complexo). |
| [lab-03-prompt-engineering](plano_topicos/labs/lab-03-prompt-engineering) | Oficina de prompts com frameworks RTF/CARE/RISE em 3 cenários reais. |
| [lab-04-rag-embeddings](plano_topicos/labs/lab-04-rag-embeddings) | Pipeline RAG, embeddings, Graph RAG e projetos demo (vetores e LangGraph). |

### Encontros 3 e 4 — Ferramentas e prática (instrutor Samuel)

| Laboratório | Resumo |
| --- | --- |
| [lab-05-mcp-agentes](plano_topicos/labs/lab-05-mcp-agentes) | Guia do módulo 5 no projeto de demonstração: os quatro servidores MCP, os chamados do GLPI simulado, o N+1 do chamado 1234 e os dois casos de injeção de instrução. |
| [lab-06-arquitetura-contexto](plano_topicos/labs/lab-06-arquitetura-contexto) | Guia do módulo 6: o `AGENTS.md`, as duas skills e o `.mcp.json` — os quatro pilares, nos arquivos do projeto. |
| [lab-07-final-sdd](plano_topicos/labs/lab-07-final-sdd) | Guia do módulo 7: as duas specs do Kiro, uma fase por branch, e os cinco achados de revisão com o comando que localiza cada um. |
| [demo-ia](plano_topicos/labs/demo-ia) | Repositório de demonstração dos encontros 3 e 4, empacotado com o histórico git. Usado pelos labs 5 e 7 — ver [BRANCHES.md](plano_topicos/labs/demo-ia/BRANCHES.md). |
| [EQUIVALENCIAS.md](plano_topicos/labs/EQUIVALENCIAS.md) | Tradução dos comandos e caminhos entre Claude Code, Kiro, Cursor e OpenCode. Usada pelos labs 5 a 7. |

## Apresentações

> Para abrir os arquivos `.excalidraw`: [Excalidraw para VS Code](https://marketplace.visualstudio.com/items?itemName=pomdtr.excalidraw-editor) · [excalidraw.com](https://excalidraw.com) (arraste o arquivo)

| Arquivo | Resumo |
| --- | --- |
| [modulo-01-llms-fundamentos.excalidraw](excalidraw/modulo-01-llms-fundamentos.excalidraw) | Fundamentos, tokens, janela de contexto, limitacoes, pre-treinamento vs fine-tuning vs RAG. |
| [modulo-02-open-source.excalidraw](excalidraw/modulo-02-open-source.excalidraw) | Modelos locais com Ollama, comparacao nuvem vs local, SLMs, matriz de decisao. |
| [modulo-03-prompt-engineering.excalidraw](excalidraw/modulo-03-prompt-engineering.excalidraw) | 5 elementos do prompt, frameworks RTF/CARE/RISE, tecnicas zero-shot, few-shot, chain of thought. |
| [modulo-04-rag-embeddings.excalidraw](excalidraw/modulo-04-rag-embeddings.excalidraw) | Pipeline RAG, embeddings, chunking, buscas semantica e hibrida, PCA, graph RAG. |
| [encontro-3--m5-m6.excalidraw](excalidraw/encontro-3--m5-m6.excalidraw) | **12 slides, o encontro 3 inteiro.** M5: novo papel do desenvolvedor, para que serve um servidor MCP, o protocolo em diagrama, segurança, anatomia do agente, ciclo de execução. M6: os 4 pilares, AGENTS.md, skills, checklist, onde cada coisa mora. |
| [encontro-4--m7-sdd-kiro.excalidraw](excalidraw/encontro-4--m7-sdd-kiro.excalidraw) | **15 slides, o encontro 4 inteiro.** Problema do prompt único, o que é SDD, a spec que envelhece, vocabulário do Kiro, onde cortar o spec, spec × harness, as quatro fases sobre o projeto real, revisão do código gerado e validação. |


