# Matriz de Decisão — Lab Módulo 2

**Nome/Dupla:** ___________________________

Preencha esta matriz para cada um dos 3 casos em `prompts/`. Use os campos
abaixo para registrar o que observou e a decisão que tomaria em produção.

---

## Caso 1 — Classificação Simples

| Critério | Local (Ollama) | Nuvem (cloud) |
|---|---|---|
| Categoria retornada | | |
| Seguiu o formato? (só a categoria) | sim / não | sim / não |
| Latência (segundos) | | |
| Tokens de output | — (local, sem custo de API) | |
| Custo estimado (USD) | R$ 0,00 | |

**Para 10.000 classificações/dia, você usaria local ou nuvem?**

> _Escreva sua justificativa aqui (custo, latência, privacidade):_


---

## Caso 2 — Geração de Código

| Critério | Local (Ollama) | Nuvem (cloud) |
|---|---|---|
| Código funciona? | sim / não | sim / não |
| Latência (segundos) | | |
| Tokens de output | — | |
| Qualidade (1–3) | | |

**O que diferenciou as respostas? (estilo, corretude, completude):**


**Para geração de código utilitário em alta frequência, você usaria local ou nuvem?**

> _Justificativa:_


---

## Caso 3 — Raciocínio Complexo

| Critério | Local (Ollama) | Nuvem (cloud) |
|---|---|---|
| Riscos identificados foram relevantes? | sim / parcial / não | sim / parcial / não |
| Sugestão alternativa fez sentido? | sim / parcial / não | sim / parcial / não |
| Latência (segundos) | | |
| Tokens de output | — | |

**Qual modelo você usaria para uma decisão arquitetural real? Por quê?**

> _Justificativa:_


---

## Síntese — Arquitetura Híbrida

Com base nos 3 casos, complete a tabela abaixo com o tipo de tarefa que você
colocaria em cada lado de uma arquitetura híbrida:

| Tipo de tarefa | Local (SLM) | Nuvem (LLM grande) |
|---|---|---|
| Classificação de texto (alto volume) | ✅ | |
| Geração de código simples | | |
| Análise arquitetural / decisões críticas | | |
| Code review de PR crítico | | |
| Resumo de documentos internos (dados sensíveis) | | |
| Debugging multi-arquivo | | |

> **Regra de ouro:** custo de um erro alto + baixa frequência → nuvem.
> Alto volume + erro tolerável + dados sensíveis → local.

---

## Para os 5 min finais de discussão

**Qual dos 3 casos mostrou a maior diferença entre local e nuvem?**


**Em que situação do seu dia a dia faria mais sentido usar um modelo local?**


**Uma coisa que você mudaria na forma como escolhe o modelo para cada tarefa:**

