# Os 5 Elementos de um Prompt

Um prompt bem estruturado pode ter até cinco elementos. Nenhum é obrigatório em toda situação,
mas cada um resolve um problema diferente. Quanto mais complexa a tarefa, mais elementos você
provavelmente vai precisar.

---

## Os elementos

| # | Elemento   | O que faz |
|---|------------|-----------|
| 1 | **Role**     | Define quem o modelo é — especialidade, senioridade, domínio. Muda vocabulário, hipóteses e profundidade da resposta. |
| 2 | **Contexto** | Informa o que o modelo não pode saber sozinho — ambiente, estado atual, o que já foi tentado, restrições específicas do seu sistema. |
| 3 | **Tarefa**   | Diz exatamente o que deve ser feito. Um verbo de ação claro (analise, gere, liste, reescreva) elimina ambiguidade. |
| 4 | **Output**   | Define o formato da resposta — JSON, lista numerada, tabela, código, markdown. Sem isso, o modelo escolhe o formato por conta. |
| 5 | **Exemplos** | Mostra ao modelo o padrão esperado com casos concretos. Resolve o que instruções não conseguem descrever: tom, nível de detalhe, estilo. |

---

## Por que 5 e não 4?

Os primeiros quatro (Role, Contexto, Tarefa, Output) dizem **o que fazer e como entregar**.
O quinto elemento — Exemplos — mostra **como você quer que pareça**. Instruções descrevem;
exemplos demonstram. Para tarefas onde consistência de formato e padrão importam
(mensagens de commit, documentação técnica, diagnósticos recorrentes), exemplos são
mais eficazes que qualquer instrução.

---

## Quando usar cada combinação

| Situação | Elementos recomendados |
|---|---|
| Tarefa simples com tecnologia conhecida | Role + Tarefa + Output |
| Problema com contexto específico do sistema | Role + Contexto + Tarefa + Output |
| Precisa de padrão consistente entre execuções | Role + Contexto + Tarefa + Output + **Exemplos** |
| Diagnóstico complexo com múltiplas fontes | Todos os 5 + Steps explícitos (ver RISE) |

---

## Formato do template

```
## Role
[quem o modelo deve ser]

## Contexto
[o que o modelo não pode saber sozinho]

## Tarefa
[o que exatamente deve ser feito — verbo de ação claro]

## Output
[formato da resposta esperada]

## Exemplos
[um ou mais casos concretos no padrão esperado]
```

> Os elementos **Exemplos** e **Contexto** são opcionais dependendo da tarefa.
> **Role**, **Tarefa** e **Output** raramente devem ser omitidos.

---

## Exemplo completo — análise de erro em API Spring Boot

```
## Role
Você é um desenvolvedor Java sênior com experiência em Spring Boot 3.2,
JPA/Hibernate e troubleshooting de APIs REST em produção.

## Contexto
- Serviço: pedido-service (Spring Boot 3.2, Java 21, PostgreSQL)
- Endpoint POST /api/pedidos retornando HTTP 500 desde 10:15
- Último deploy: 10:10 (adicionado novo campo 'canal_venda' NOT NULL via Flyway)
- Outros endpoints do mesmo serviço funcionam normalmente

## Tarefa
Identifique a causa raiz do erro 500, liste as evidências do stack trace
e proponha um plano de correção com código Java e SQL específicos.

## Output
Responda em JSON com os campos:
- severity: (critical / high / medium / low)
- root_cause: causa raiz em uma frase
- evidence: lista de evidências encontradas
- action_plan: passos de correção com código quando aplicável
- confidence: percentual de confiança na análise

## Exemplos
Análise anterior resolvida:
Input: campo 'tipo_pagamento' NOT NULL adicionado sem default, deploy às 09:40,
       erros 500 iniciaram às 09:42 somente no endpoint de checkout.
Output: {"severity": "critical", "root_cause": "Migration adicionou coluna NOT NULL
  sem valor default, código novo tenta inserir sem preencher o campo",
  "evidence": ["SQLIntegrityConstraintViolationException no stack trace",
  "apenas endpoints de escrita afetados", "instância antiga (sem migration) funciona"],
  "action_plan": ["ALTER TABLE pagamentos ALTER COLUMN tipo_pagamento SET DEFAULT 'CARTAO'",
  "Atualizar PedidoService para sempre preencher o campo", "Redeployar"],
  "confidence": "95%"}
```
