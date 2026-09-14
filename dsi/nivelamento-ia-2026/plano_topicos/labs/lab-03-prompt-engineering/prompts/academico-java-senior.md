# Prompts — Engenharia de Prompts para Devs Java Sênior (Domínio Acadêmico)

> Público-alvo: desenvolvedores Java sênior com experiência em sistemas de gestão acadêmica (ERP universitário, SIS, portais do aluno). Os cenários usam contexto de matrícula, notas, integração com MEC/SISU, histórico acadêmico e regras de negócio típicas do domínio.

---

## 1. Sonnet vs Opus — Mesmo prompt, modelos diferentes

**Objetivo:** Mostrar que modelos diferentes geram respostas com profundidade e qualidade distintas para o mesmo prompt.

**Conceito:** Sonnet é mais rápido e barato; Opus é mais profundo e analítico. Para diagnósticos complexos com regras de negócio acadêmico, a escolha do modelo impacta diretamente a qualidade do resultado.

**Prompt:**

```
Você é um desenvolvedor Java sênior com 10 anos de experiência em sistemas acadêmicos (ERP universitário, integração MEC, SISU).

## Contexto
- Serviço: matricula-service (Spring Boot 3.2, Java 21)
- Ambiente: produção, período de matrícula em andamento (prazo encerra em 6h)
- Status: endpoint POST /api/matriculas retornando HTTP 500 desde 08:47 UTC
- Último deploy: 08:40 UTC (v3.1.2 — implementação da regra de coeficiente mínimo para rematrícula)
- Endpoints funcionando: GET /api/matriculas/{id} e GET /api/alunos/{id}/historico

## Stack trace
2026-07-14T08:47:31.441Z ERROR c.u.m.s.MatriculaService - Falha ao processar matrícula
org.springframework.dao.DataIntegrityViolationException: could not execute statement
  at org.springframework.orm.jpa.vendor.HibernateJpaDialect.convertHibernateAccessException(...)
Caused by: org.hibernate.exception.ConstraintViolationException: could not execute statement
Caused by: java.sql.SQLIntegrityConstraintViolationException:
  Duplicate entry '2024-1-CCO-101-MANHA' for key 'uk_oferta_periodo_curso_turno'

## Logs da versão anterior (v3.1.1) — ainda rodando em 1 instância
2026-07-14T08:48:02.105Z INFO  c.u.m.s.MatriculaService - Matrícula processada [alunoId=18834, ofertaId=441]
2026-07-14T08:48:05.331Z INFO  c.u.m.s.MatriculaService - Matrícula processada [alunoId=18835, ofertaId=441]

## Histórico de deploy
v3.1.2 (08:40 UTC): implementação da validação de coeficiente mínimo (CR >= 5.0) para rematrícula

## Tarefa
Identifique a causa raiz do erro 500, liste as evidências e proponha um plano de correção com código Java e SQL específicos.

## Formato de resposta
JSON com campos: severity, root_cause, evidence[], action_plan[], confidence
```

---

## 2. Os 4 Blocos — Prompt sem contexto

**Objetivo:** Demonstrar que sem contexto, o modelo dá respostas genéricas e inúteis.

**Conceito:** O bloco Role define quem responde. Sem ele, o modelo tenta cobrir todos os significados possíveis e não serve para nada.

**Prompt:**

```
O que é uma matrícula?
```

---

## 3. Os 4 Blocos — Com Role (coordenador acadêmico)

**Objetivo:** Mostrar que adicionar um Role muda completamente a interpretação da mesma pergunta.

**Conceito:** Role define a perspectiva do modelo. A mesma palavra ("matrícula") ganha significado diferente dependendo de quem responde.

**Prompt:**

```
Você é um coordenador acadêmico de uma universidade federal. O que é uma matrícula?
```

---

## 4. Os 4 Blocos — Com Role (desenvolvedor de sistema acadêmico)

**Objetivo:** Reforçar que o Role define a interpretação — mesma pergunta, resposta totalmente diferente.

**Conceito:** O modelo não "sabe" o que você quer. O Role é a primeira instrução que direciona a resposta.

**Prompt:**

```
Você é um desenvolvedor Java sênior especializado em sistemas de gestão acadêmica. O que é uma matrícula?
```

---

## 5. Os 4 Blocos — Role + Contexto

**Objetivo:** Mostrar que o Contexto personaliza a resposta para a situação específica.

**Conceito:** Role define quem responde. Contexto define para quem e em qual situação. Juntos, transformam resposta genérica em resposta útil.

**Prompt:**

```
Você é um desenvolvedor Java sênior especializado em sistemas de gestão acadêmica.
Contexto: Desenvolvedor júnior que acabou de introduzir um bug de matrícula duplicada em produção durante o período de inscrições do SISU.
O que é uma matrícula e quais são as principais invariantes de negócio que devem ser garantidas a nível de código e banco de dados?
```


---

## 6. Os 4 Blocos — Prompt ingênuo (só stack trace)

**Objetivo:** Estabelecer a linha de base — como a maioria das pessoas usa IA: joga o erro e pede para analisar.

**Conceito:** Sem Role, Contexto, Tarefa e Output, o modelo não sabe quem ele é, o que aconteceu, o que você quer e em que formato. O resultado é genérico e superficial.

**Prompt:**

```
Analise este erro:

org.springframework.dao.DataIntegrityViolationException: could not execute statement
Caused by: java.sql.SQLIntegrityConstraintViolationException:
  Duplicate entry '2024-1-CCO-101-MANHA' for key 'uk_oferta_periodo_curso_turno'
```

---

## 7. Os 4 Blocos — Com Role

**Objetivo:** Mostrar a primeira melhoria — adicionar quem está respondendo.

**Conceito:** O Role muda o vocabulário, as hipóteses e a profundidade da análise. O modelo começa a pensar em termos de ofertas, períodos letivos, constraint de banco — não apenas em "duplicate key".

**Prompt:**

```
Você é um desenvolvedor Java sênior com experiência em sistemas acadêmicos e Spring Boot.

Analise este erro:

org.springframework.dao.DataIntegrityViolationException: could not execute statement
Caused by: java.sql.SQLIntegrityConstraintViolationException:
  Duplicate entry '2024-1-CCO-101-MANHA' for key 'uk_oferta_periodo_curso_turno'
```

---

## 8. Os 4 Blocos — Role + Contexto

**Objetivo:** Mostrar que o Contexto permite correlações que antes eram impossíveis.

**Conceito:** Com o contexto do deploy recente e do período de matrícula ativo, o modelo consegue correlacionar a introdução do bug com a nova funcionalidade e entender o impacto real no negócio.

**Prompt:**

```
Você é um desenvolvedor Java sênior com experiência em sistemas acadêmicos.

## Contexto
- Serviço: matricula-service (Spring Boot 3.2, Java 21)
- Status: endpoint POST /api/matriculas retornando HTTP 500 desde 08:47 UTC
- Período crítico: matrícula SISU em andamento, prazo encerra em 6 horas
- Último deploy: 08:40 UTC (v3.1.2 — nova regra de coeficiente mínimo para rematrícula)
- Instância v3.1.1: ainda processando matrículas normalmente

## Stack trace (v3.1.2)
org.springframework.dao.DataIntegrityViolationException: could not execute statement
Caused by: java.sql.SQLIntegrityConstraintViolationException:
  Duplicate entry '2024-1-CCO-101-MANHA' for key 'uk_oferta_periodo_curso_turno'

## Logs da instância antiga (v3.1.1)
2026-07-14T08:48:02.105Z INFO  Matrícula processada [alunoId=18834, ofertaId=441]
2026-07-14T08:48:05.331Z INFO  Matrícula processada [alunoId=18835, ofertaId=441]

Analise este cenário.
```

---

## 9. Os 4 Blocos — Prompt completo (Role + Contexto + Tarefa + Output)

**Objetivo:** Mostrar o resultado final — prompt estruturado com os 4 blocos produz diagnóstico acionável.

**Conceito:** Tarefa diz exatamente o que o modelo deve fazer. Output define o formato. Juntos com Role e Contexto, transformam uma pergunta vaga em uma ferramenta de trabalho real.

**Prompt:**

```
Você é um desenvolvedor Java sênior com experiência em sistemas acadêmicos e Flyway migrations.

## Contexto
- Serviço: matricula-service (Spring Boot 3.2, Java 21, Flyway)
- Status: endpoint POST /api/matriculas retornando HTTP 500 desde 08:47 UTC
- Período crítico: matrícula SISU em andamento, prazo encerra em 6 horas
- Último deploy: 08:40 UTC (v3.1.2 — regra de coeficiente mínimo + migration que adicionou unique constraint)
- Instância v3.1.1: ainda processando normalmente

## Stack trace (v3.1.2)
org.springframework.dao.DataIntegrityViolationException: could not execute statement
Caused by: java.sql.SQLIntegrityConstraintViolationException:
  Duplicate entry '2024-1-CCO-101-MANHA' for key 'uk_oferta_periodo_curso_turno'

## Logs da instância antiga (v3.1.1)
2026-07-14T08:48:02.105Z INFO  Matrícula processada [alunoId=18834, ofertaId=441]
2026-07-14T08:48:05.331Z INFO  Matrícula processada [alunoId=18835, ofertaId=441]

## Tarefa
Identifique a causa raiz do erro 500, liste as evidências e proponha um plano de correção com código Java e SQL específicos, considerando que o sistema não pode ficar fora do ar durante o período de matrícula.

## Formato de resposta
Responda em JSON com os campos:
- severity: (critical/high/medium/low)
- root_cause: (causa raiz em uma frase)
- evidence: [lista de evidências encontradas no stack trace e contexto]
- action_plan: [passos de correção com código Java/SQL quando aplicável]
- confidence: (porcentagem de confiança na análise)
```


---

## 10. Zero-shot — Classificação de sentimento

**Objetivo:** Mostrar que zero-shot funciona bem para tarefas simples e bem definidas.

**Conceito:** Zero-shot = prompt com instruções claras, sem nenhum exemplo de resposta. Funciona quando a tarefa é objetiva e sem ambiguidade.

**Prompt:**

```
Classifique o sentimento da frase abaixo como positivo, negativo ou neutro.

Frase: "O cálculo do CR ficou mais rápido depois do refactor, mas agora a integração com o ENADE falha em alguns cursos noturnos"

Responda apenas com a classificação e uma justificativa de uma linha.
```

---

## 11. Zero-shot — Geração de código Java acadêmico

**Objetivo:** Demonstrar zero-shot em geração de código — funciona quando os requisitos são claros e objetivos.

**Conceito:** Zero-shot gera código funcional com instruções detalhadas, mas sem exemplos não garante convenções do seu domínio (como o cálculo correto do CR, tratamento de disciplinas optativas vs. obrigatórias, regras de aprovação por frequência).

**Prompt:**

```
Crie uma classe Java usando Spring Boot 3.2 que implemente a seguinte funcionalidade:

1. Um endpoint REST POST /api/matriculas que recebe um MatriculaRequest
2. Valida que o aluno não está matriculado na mesma disciplina no mesmo período letivo
3. Valida que o aluno possui o coeficiente de rendimento (CR) mínimo de 5.0 para rematrícula
4. Valida que a oferta de disciplina não excedeu o limite de vagas
5. Persiste a matrícula via JPA em uma tabela 'matriculas'
6. Publica um evento MatriculaConfirmadaEvent no RabbitMQ após salvar
7. Retorna HTTP 201 com o MatriculaResponse

A implementação deve:
- Usar Java 21 com records para DTOs (MatriculaRequest, MatriculaResponse)
- Usar Bean Validation com mensagens de erro em português
- Usar @Transactional no service com isolamento READ_COMMITTED
- Tratar ConstraintViolationException e regras de negócio com exceções específicas
- Incluir logs com SLF4J nos pontos de decisão de negócio
```

---

## 12. Zero-shot — Análise de stack trace com 4 blocos

**Objetivo:** Mostrar que zero-shot com 4 blocos funciona, mas formato e profundidade variam entre execuções.

**Conceito:** Sem exemplos de referência, não há âncora de qualidade. Rodar 2x pode gerar respostas com profundidades diferentes. Essa inconsistência é onde few-shot resolve.

**Prompt:**

```
Você é um desenvolvedor Java sênior especializado em sistemas acadêmicos.

## Contexto
- Serviço: historico-service (Spring Boot 3.2, Java 21)
- Status: endpoint GET /api/alunos/{id}/historico retornando HTTP 500 para ~30% dos alunos
- Último deploy: ontem à noite (v2.8.0 — adicionado cálculo de IRA — Índice de Rendimento Acadêmico)
- Alunos afetados: exclusivamente alunos com disciplinas cursadas antes de 2010

## Stack trace
java.lang.ArithmeticException: / by zero
  at com.universidade.historico.service.IraCalculatorService.calcular(IraCalculatorService.java:47)
  at com.universidade.historico.service.HistoricoService.gerarHistorico(HistoricoService.java:89)
  at com.universidade.historico.controller.HistoricoController.getHistorico(HistoricoController.java:34)

## Logs de alunos não afetados
2026-07-14T10:12:05.441Z INFO  Histórico gerado [alunoId=22341, totalDisciplinas=48, ira=7.83]
2026-07-14T10:12:06.112Z INFO  Histórico gerado [alunoId=22342, totalDisciplinas=31, ira=6.41]

## Tarefa
Identifique a causa raiz do erro, liste as evidências e proponha correção com código.

## Formato de resposta
JSON com campos: severity, root_cause, evidence[], action_plan[], confidence
```

---

## 13. Zero-shot vs Few-shot — Sumário de relatório de notas

**Objetivo:** Mostrar que "tom técnico e objetivo" é vago — sem exemplos, cada execução interpreta diferente. Few-shot com amostras reais do sistema resolve.

**Conceito:** Zero-shot diz O QUE fazer. Few-shot MOSTRA COMO fazer. Para relatórios que seguem padrão institucional, exemplos são mais eficazes do que instruções descritivas.

**Zero-shot:**

```
Gere um sumário executivo para o relatório de notas do curso de Ciência da Computação referente ao período 2026-1. Tom técnico e objetivo.
```

**Few-shot:**

```
Gere um sumário executivo para o relatório de notas do curso de Ciência da Computação referente ao período 2026-1, seguindo o tom e estilo dos exemplos abaixo.

## Exemplos de sumários de relatórios anteriores

Exemplo 1 (Engenharia de Software — 2025-2):
"No período 2025-2, o curso de Engenharia de Software registrou média geral de 6.8, com taxa de reprovação de 18% — 4 pontos percentuais acima da média histórica. As disciplinas de Cálculo II e Algoritmos concentraram 61% das reprovações. O índice de trancamento aumentou 12% em relação a 2025-1, com maior incidência nas turmas do turno noturno. Nenhuma disciplina registrou 100% de aprovação."

Exemplo 2 (Sistemas de Informação — 2025-2):
"O período 2025-2 encerrou com 847 alunos ativos no curso de Sistemas de Informação, média geral de 7.1 e taxa de aprovação de 79%. Três disciplinas ficaram abaixo do limiar institucional de 60% de aprovação: Banco de Dados II (54%), Redes de Computadores (57%) e Matemática Discreta (58%). A média do IRA do curso subiu 0.3 pontos em relação ao período anterior, influenciada pela renovação do corpo docente nas disciplinas de exatas."

## Dados do período 2026-1 — Ciência da Computação
- Total de alunos: 912
- Média geral: 6.5
- Taxa de aprovação: 74%
- Disciplinas abaixo de 60% de aprovação: Cálculo III (51%), Compiladores (56%)
- Variação do IRA médio em relação a 2025-2: -0.2
- Taxa de trancamento: 9%

## Agora escreva
Sumário executivo para o relatório 2026-1, mesmo tom e estilo dos exemplos acima.
```


---

## 14. Zero-shot vs Few-shot — Mensagens de commit

**Objetivo:** Mostrar que cada dev escreve commit diferente — few-shot com exemplos do repositório garante consistência.

**Conceito:** Few-shot transfere padrões implícitos que instruções não conseguem descrever. O modelo replica o formato, prefixo e nível de detalhe dos exemplos fornecidos.

**Zero-shot:**

```
Gere uma mensagem de commit para as seguintes mudanças:
- Adicionada validação de coeficiente mínimo (CR >= 5.0) antes da rematrícula
- Adicionado tratamento de ConstraintViolationException no MatriculaService
- Corrigido cálculo do IRA para alunos com disciplinas anteriores a 2010 (carga horária zerada)
```

**Few-shot:**

```
Gere uma mensagem de commit para as mudanças abaixo, seguindo o padrão dos exemplos.

## Mudanças para commitar
- Adicionada validação de coeficiente mínimo (CR >= 5.0) antes da rematrícula
- Adicionado tratamento de ConstraintViolationException no MatriculaService
- Corrigido cálculo do IRA para alunos com disciplinas anteriores a 2010 (carga horária zerada)

## Exemplos de commits do repositório
- fix: corrige cálculo de CR quando aluno possui reprovação por falta sem nota
- feat: adiciona validação de pré-requisito no fluxo de matrícula em disciplinas eletivas
- refactor: extrai regras de bloqueio acadêmico para AlunoStatusService
- feat: implementa integração com SISU para importação de convocados
- fix: resolve duplicação de matrícula em ambiente de alta concorrência no período de inscrição


- me de o comando git como resultado para enviar todas a correções em um commit
```

---

## 15. Few-shot — Análise de erros com exemplos de análises anteriores

**Objetivo:** Mostrar que exemplos de análises resolvidas ancoram formato, profundidade e raciocínio. O modelo replica o padrão.

**Conceito:** Few-shot com exemplos do próprio ambiente. Cada análise bem feita vira exemplo para as próximas — o prompt melhora com o tempo.

**Prompt:**

```
Você é um desenvolvedor Java sênior especializado em sistemas acadêmicos e Spring Boot.

## Exemplos de análises anteriores

### Exemplo 1
Input: Endpoint /api/alunos/{id}/historico com OutOfMemoryError para alunos de cursos de medicina (10 anos, ~120 disciplinas). Heap de 512MB. Crescimento de objetos Disciplina em memória sem liberação.
Análise: Correlacionei o OOM com o volume de disciplinas: query JPA carregando todas as 120 disciplinas com todos os relacionamentos (professor, horario, sala) em memória de uma vez. Sem paginação e com FetchType.EAGER em todos os relacionamentos do Disciplina.
Output: {"severity": "high", "root_cause": "FetchType.EAGER em cadeia carregando grafo completo de objetos para históricos com muitas disciplinas", "evidence": ["OOM apenas para alunos com >80 disciplinas", "heap dump mostra objetos Disciplina retendo professor, horario e sala", "query Hibernate gera JOIN com 6 tabelas sem LIMIT"], "action_plan": ["Trocar @ManyToOne(fetch=EAGER) por LAZY em Disciplina.professor e Disciplina.horario", "Usar projeção JPA (interface HistoricoProjection) no lugar de entidade completa", "Adicionar paginação no endpoint com Pageable"], "confidence": "91%"}

### Exemplo 2
Input: Serviço de emissão de histórico oficial travando durante formatura. 500 requisições simultâneas. Timeout após 60s. Banco com lock em tabela 'historicos_oficiais'.
Análise: Emissão de histórico oficial gera número de registro sequencial via SELECT MAX(numero) + 1. Com 500 requisições simultâneas, múltiplas transações leem o mesmo MAX e tentam inserir o mesmo número — deadlock na constraint unique.
Output: {"severity": "critical", "root_cause": "Race condition no gerador de número de histórico oficial via SELECT MAX + INSERT concorrente", "evidence": ["deadlock em uk_numero_historico_oficial", "500 requisições simultâneas no período de formatura", "timeout concentrado nas inscrições de formatura"], "action_plan": ["Substituir SELECT MAX por sequence do banco (CREATE SEQUENCE seq_historico_oficial)", "Usar @GeneratedValue(strategy=SEQUENCE) na entidade HistoricoOficial", "Testar com JMeter simulando 500 requisições simultâneas"], "confidence": "94%"}

## Caso atual

### Contexto
- Serviço: matricula-service (Spring Boot 3.2, Java 21)
- Status: endpoint POST /api/matriculas retornando HTTP 500 desde 08:47 UTC
- Período crítico: matrícula SISU em andamento, prazo encerra em 6 horas
- Último deploy: 08:40 UTC (v3.1.2 — regra de CR mínimo + migration adicionou unique constraint em oferta)
- Instância v3.1.1: processando normalmente

### Stack trace (v3.1.2)
org.springframework.dao.DataIntegrityViolationException: could not execute statement
Caused by: java.sql.SQLIntegrityConstraintViolationException:
  Duplicate entry '2024-1-CCO-101-MANHA' for key 'uk_oferta_periodo_curso_turno'

### Logs da instância antiga (v3.1.1)
2026-07-14T08:48:02.105Z INFO  Matrícula processada [alunoId=18834, ofertaId=441]
2026-07-14T08:48:05.331Z INFO  Matrícula processada [alunoId=18835, ofertaId=441]

### Tarefa
Identifique a causa raiz, liste as evidências e proponha correção com código Java/SQL.

### Formato de resposta
JSON com campos: severity, root_cause, evidence[], action_plan[], confidence
```


---

## 16. Chain-of-Thought — Análise de chamado sem CoT

**Objetivo:** Mostrar que sem CoT o modelo resolve apenas a superfície do chamado, sem mapear impactos, dependências e soluções completas.

**Conceito:** Chain-of-thought força o modelo a pensar passo a passo. Sem ele, a resposta tende a ser uma solução pontual que ignora casos de borda, permissões e contexto de outras funcionalidades já existentes no sistema.

**Sem CoT:**

```
Você é um desenvolvedor Java sênior especializado em sistemas acadêmicos.

Considerando os arquivos do projeto
AbandonoAulasGraduacaoQueryDao.java, CancelamentoMatriculaDiscenteValidator.java, MovimentacaoAlunoMBean.java, MovimentacaoAlunoDao.java, DiscenteDao.java,

Me de um plano para a situação abaixo.

Analise o chamado abaixo e proponha uma solução:

"Solicitamos ajuste para que o cancelamento de matrícula por tipo Abandono considere como dias consecutivos
os dias programados para aulas no contador de ausências, porque como algumas turmas não têm aulas todos
os dias da semana, inviabiliza-se lançar o cancelamento correto para estudantes destas turmas."
```

**Com CoT:**

```
Você é um desenvolvedor Java sênior especializado em sistemas acadêmicos.


Considerando os arquivos do projeto
AbandonoAulasGraduacaoQueryDao.java, CancelamentoMatriculaDiscenteValidator.java, MovimentacaoAlunoMBean.java, MovimentacaoAlunoDao.java, DiscenteDao.java,

Me de um plano para a situação abaixo.

Analise o chamado abaixo passo a passo antes de propor qualquer solução:

"Solicitamos ajuste para que o cancelamento de matrícula por tipo Abandono considere como dias consecutivos
os dias programados para aulas no contador de ausências, porque como algumas turmas não têm aulas todos
os dias da semana, inviabiliza-se lançar o cancelamento correto para estudantes destas turmas."

Raciocine seguindo estas etapas:

1. **Entenda o problema de negócio**: Analise o código atual e responda o que significa "dias consecutivos de aula" para turmas que não têm aula todo dia? Qual o impacto concreto se o contador ignorar dias sem aula?

2. **Liste as entidades do sistema envolvidas**: quais tabelas/classes provavelmente guardam a grade de aulas da turma, os registros de frequência e o motivo de cancelamento?

3. **Avalie os riscos de cada solução**: mudar a regra de contagem afeta retroativamente cancelamentos já lançados?

4. **Proponha tarefas separadas**, com o nível de complexidade estimado (alto/médio/baixo).
```

---

## 17. Chain-of-Thought — Análise de logs sem CoT

**Objetivo:** Estabelecer a linha de base — sem forçar raciocínio, o modelo responde rápido e superficialmente.

**Conceito:** Sem CoT, o modelo pula direto para uma conclusão. Com problemas de padrão temporal (timeouts periódicos), isso significa perder a correlação com processos agendados do sistema acadêmico.

**Prompt:**

```
Você é um desenvolvedor Java sênior especializado em sistemas acadêmicos.

## Logs do serviço nota-service (última hora)
2026-08-15T09:00:11.221Z INFO  c.u.n.s.NotaService - Nota lançada [disciplinaId=441, alunoId=18801]
2026-08-15T09:00:14.103Z ERROR c.u.n.r.NotaRepository - HikariPool-1 - Connection is not available, request timed out after 30000ms
2026-08-15T09:00:14.201Z ERROR c.u.n.r.NotaRepository - HikariPool-1 - Connection is not available, request timed out after 30000ms
2026-08-15T09:00:14.305Z ERROR c.u.n.c.NotaController - HTTP 500 [disciplinaId=441, alunoId=18802]
2026-08-15T09:00:14.412Z ERROR c.u.n.r.NotaRepository - HikariPool-1 - Connection is not available, request timed out after 30000ms
2026-08-15T09:00:15.001Z ERROR c.u.n.c.NotaController - HTTP 500 [disciplinaId=441, alunoId=18803]
2026-08-15T09:00:18.221Z INFO  c.u.n.s.NotaService - Nota lançada [disciplinaId=441, alunoId=18805]
2026-08-15T09:15:11.998Z INFO  c.u.n.s.NotaService - Nota lançada [disciplinaId=441, alunoId=18841]
2026-08-15T09:15:14.088Z ERROR c.u.n.r.NotaRepository - HikariPool-1 - Connection is not available, request timed out after 30000ms
2026-08-15T09:15:14.191Z ERROR c.u.n.r.NotaRepository - HikariPool-1 - Connection is not available, request timed out after 30000ms
2026-08-15T09:15:14.289Z ERROR c.u.n.c.NotaController - HTTP 500 [disciplinaId=441, alunoId=18842]
2026-08-15T09:15:18.112Z INFO  c.u.n.s.NotaService - Nota lançada [disciplinaId=441, alunoId=18843]
2026-08-15T09:30:14.051Z ERROR c.u.n.r.NotaRepository - HikariPool-1 - Connection is not available, request timed out after 30000ms
2026-08-15T09:30:14.156Z ERROR c.u.n.c.NotaController - HTTP 500 [disciplinaId=441, alunoId=18855]
2026-08-15T09:30:18.330Z INFO  c.u.n.s.NotaService - Nota lançada [disciplinaId=441, alunoId=18857]
2026-08-15T09:45:14.021Z ERROR c.u.n.r.NotaRepository - HikariPool-1 - Connection is not available, request timed out after 30000ms
2026-08-15T09:45:14.131Z ERROR c.u.n.c.NotaController - HTTP 500 [disciplinaId=441, alunoId=18870]
2026-08-15T09:45:18.200Z INFO  c.u.n.s.NotaService - Nota lançada [disciplinaId=441, alunoId=18872]

## Informação adicional
- HikariCP configurado com maximumPoolSize=10
- 6 instâncias do nota-service rodando
- Job agendado "CalculoCrPeriodoJob" recalcula o CR de todos os alunos a cada 15 minutos e executa queries pesadas nas tabelas de notas e matrículas

Qual a causa raiz?
```

---

## 18. Chain-of-Thought — Análise de logs com CoT

**Objetivo:** Mostrar que forçar raciocínio passo a passo revela a correlação temporal que a resposta direta omitia.

**Conceito:** CoT com etapas explícitas descobre que os timeouts a cada 15min coincidem exatamente com o `CalculoCrPeriodoJob` e que o pool de 10 conexões não suporta 6 instâncias + queries analíticas de CR.

**Prompt:**

```
Você é um desenvolvedor Java sênior especializado em sistemas acadêmicos.

## Logs do serviço nota-service (última hora)
2026-08-15T09:00:11.221Z INFO  c.u.n.s.NotaService - Nota lançada [disciplinaId=441, alunoId=18801]
2026-08-15T09:00:14.103Z ERROR c.u.n.r.NotaRepository - HikariPool-1 - Connection is not available, request timed out after 30000ms
2026-08-15T09:00:14.201Z ERROR c.u.n.r.NotaRepository - HikariPool-1 - Connection is not available, request timed out after 30000ms
2026-08-15T09:00:14.305Z ERROR c.u.n.c.NotaController - HTTP 500 [disciplinaId=441, alunoId=18802]
2026-08-15T09:00:14.412Z ERROR c.u.n.r.NotaRepository - HikariPool-1 - Connection is not available, request timed out after 30000ms
2026-08-15T09:00:15.001Z ERROR c.u.n.c.NotaController - HTTP 500 [disciplinaId=441, alunoId=18803]
2026-08-15T09:00:18.221Z INFO  c.u.n.s.NotaService - Nota lançada [disciplinaId=441, alunoId=18805]
2026-08-15T09:15:11.998Z INFO  c.u.n.s.NotaService - Nota lançada [disciplinaId=441, alunoId=18841]
2026-08-15T09:15:14.088Z ERROR c.u.n.r.NotaRepository - HikariPool-1 - Connection is not available, request timed out after 30000ms
2026-08-15T09:15:14.191Z ERROR c.u.n.r.NotaRepository - HikariPool-1 - Connection is not available, request timed out after 30000ms
2026-08-15T09:15:14.289Z ERROR c.u.n.c.NotaController - HTTP 500 [disciplinaId=441, alunoId=18842]
2026-08-15T09:15:18.112Z INFO  c.u.n.s.NotaService - Nota lançada [disciplinaId=441, alunoId=18843]
2026-08-15T09:30:14.051Z ERROR c.u.n.r.NotaRepository - HikariPool-1 - Connection is not available, request timed out after 30000ms
2026-08-15T09:30:14.156Z ERROR c.u.n.c.NotaController - HTTP 500 [disciplinaId=441, alunoId=18855]
2026-08-15T09:30:18.330Z INFO  c.u.n.s.NotaService - Nota lançada [disciplinaId=441, alunoId=18857]
2026-08-15T09:45:14.021Z ERROR c.u.n.r.NotaRepository - HikariPool-1 - Connection is not available, request timed out after 30000ms
2026-08-15T09:45:14.131Z ERROR c.u.n.c.NotaController - HTTP 500 [disciplinaId=441, alunoId=18870]
2026-08-15T09:45:18.200Z INFO  c.u.n.s.NotaService - Nota lançada [disciplinaId=441, alunoId=18872]

## Informação adicional
- HikariCP configurado com maximumPoolSize=10
- 6 instâncias do nota-service rodando
- Job agendado "CalculoCrPeriodoJob" recalcula o CR de todos os alunos a cada 15 minutos e executa queries pesadas nas tabelas de notas e matrículas

Analise passo a passo:
1. Liste todos os erros com timestamps
2. Identifique padrões temporais — os erros são constantes ou em rajadas?
3. Correlacione com as informações disponíveis (pool size, instâncias, job agendado)
4. Formule hipóteses ordenadas por probabilidade
5. Para cada hipótese, indique como validar (logs, métricas, configuração HikariCP)
6. Conclusão com causa mais provável e correção recomendada, incluindo:
   - Configuração correta do HikariCP (maximumPoolSize, connectionTimeout)
   - Alternativa arquitetural para isolar o job de queries analíticas (datasource separado, réplica de leitura)
   - Código de exemplo se necessário
```


---

## 19. Chain-of-Thought — Post-mortem a partir da análise

**Objetivo:** Mostrar que CoT encadeado (análise + documento) produz post-mortems contextualizados, não templates genéricos.

**Conceito:** A saída de um CoT alimenta o próximo. A investigação com raciocínio passo a passo gera dados que o post-mortem usa diretamente.

**Prompt (enviar na mesma conversa, após o prompt 18):**

```
Com base na análise acima, gere um documento de post-mortem completo para este incidente.

Pense passo a passo:
1. Use a causa raiz identificada (CalculoCrPeriodoJob esgotando o HikariCP connection pool compartilhado) como ponto de partida
2. Reconstrua a timeline do incidente com base nos timestamps dos logs
3. Separe o trigger (job de cálculo de CR) dos amplificadores (pool subdimensionado para 6 instâncias, ausência de datasource dedicado para operações analíticas, sem query timeout configurado)
4. Para cada ação corretiva, classifique como: imediata (hoje), curto prazo (< 1 semana) ou estrutural (arquitetural)
5. Avalie o impacto no negócio: quantos lançamentos de nota foram perdidos, em qual período letivo, e se há obrigação de reprocessamento
6. Identifique o que os alertas atuais pegariam (HikariCP timeout no APM) e o que não pegariam (ausência de alerta de pool utilization > 80%)
```

---

## 20. ReAct — Roteiro de estudo sem ReAct

**Objetivo:** Mostrar que sem pesquisa ativa, o modelo gera conteúdo genérico potencialmente desatualizado.

**Conceito:** Sem ReAct, o modelo responde com o que já sabe — pode estar desatualizado em relação à versão atual do Spring Boot ou às melhores práticas recentes do ecossistema Java.

**Prompt:**

```
Monte um roteiro de estudos de 4 semanas para um desenvolvedor Java sênior que quer dominar as novidades do Java 21 e Spring Boot 3.2 aplicadas a sistemas acadêmicos de grande porte.
```

---

## 21. ReAct — Roteiro de estudo com ReAct

**Objetivo:** Mostrar que com o padrão Thought/Action/Observation, o modelo pesquisa ativamente e justifica cada escolha com dados reais e atualizados.

**Conceito:** ReAct = Raciocínio + Ação em loop. O modelo pesquisa antes de recomendar — versões, features, recursos oficiais, release notes.

**Prompt:**

```
Monte um roteiro de estudos de 4 semanas para um desenvolvedor Java sênior que quer dominar as novidades do Java 21 e Spring Boot 3.2 aplicadas a sistemas acadêmicos de grande porte.

Siga o padrão de investigação abaixo para cada decisão:
- **Thought**: o que você sabe e o que precisa descobrir antes de decidir
- **Action**: pesquise na internet (release notes oficiais, Spring blog, JEPs do Java 21, repositórios de referência)
- **Observation**: registre o que encontrou
- Repita até ter informação suficiente para montar o roteiro

Não assuma nada — pesquise antes de recomendar. Para cada tópico (Virtual Threads, Records, Pattern Matching, GraalVM, etc.), mostre o raciocínio e a pesquisa que justificou a inclusão e a sequência.
```

---

## 22. ReAct — Diagnóstico de erro obscuro sem ReAct

**Objetivo:** Mostrar que sem pesquisa, o modelo chuta soluções genéricas para erros específicos de versão que podem não estar no seu treinamento.

**Conceito:** O limite do conhecimento do modelo. Erros introduzidos em versões recentes do Spring Boot ou do Hibernate podem não estar bem representados nos dados de treinamento.

**Prompt:**

```
Você é um desenvolvedor Java sênior especializado em sistemas acadêmicos.

O serviço de emissão de diploma está falhando após migração para Spring Boot 3.2 com o seguinte erro:

org.springframework.orm.jpa.JpaSystemException: Could not determine recommended JdbcType for Java type 'com.universidade.diploma.domain.StatusEmissao'
  at org.springframework.orm.jpa.EntityManagerFactoryUtils.convertJpaAccessExceptionIfPossible(...)
Caused by: org.hibernate.type.descriptor.java.spi.JdbcRecommendedSqlTypeMappingContext
Caused by: com.fasterxml.jackson.databind.exc.InvalidDefinitionException:
  Java 8 date/time type `java.time.LocalDate` not supported by default

Nunca vi esse erro nessa forma antes. Qual a causa raiz e como corrigir?
```

---

## 23. ReAct — Diagnóstico de erro obscuro com ReAct

**Objetivo:** Mostrar que com pesquisa ativa, o modelo descobre a causa real: breaking change no mapeamento de tipos do Hibernate 6 (que veio com Spring Boot 3.x) afetando enums e tipos de data.

**Conceito:** ReAct aplicado a troubleshooting de migração de versão. O modelo pesquisa o migration guide oficial, issues do GitHub e changelog do Hibernate 6, construindo o diagnóstico iterativamente — o mesmo padrão que agentes autônomos usam.

**Prompt:**

```
Você é um desenvolvedor Java sênior investigando uma falha após migração de versão em produção.

## Padrão de investigação
Siga rigorosamente o formato abaixo para cada ciclo:
- **Thought**: o que você sabe até agora e o que precisa descobrir
- **Action**: pesquise na internet (Spring Boot migration guide, Hibernate 6 changelog, issues do GitHub, Stack Overflow)
- **Observation**: registre o que encontrou
- Repita até chegar na causa raiz

Não pule etapas. Pesquise antes de concluir.

## Cenário
Serviço de emissão de diploma falha após migração de Spring Boot 2.7 para 3.2:

org.springframework.orm.jpa.JpaSystemException: Could not determine recommended JdbcType for Java type 'com.universidade.diploma.domain.StatusEmissao'
  at org.springframework.orm.jpa.EntityManagerFactoryUtils.convertJpaAccessExceptionIfPossible(...)
Caused by: org.hibernate.type.descriptor.java.spi.JdbcRecommendedSqlTypeMappingContext

## Dados disponíveis
- Spring Boot 2.7 → 3.2 (Hibernate 5 → Hibernate 6)
- StatusEmissao é um enum Java sem anotações de mapeamento explícito
- A tabela no banco armazena o enum como VARCHAR (ex: 'PENDENTE', 'EMITIDO', 'CANCELADO')
- Em desenvolvimento local (H2) o erro não ocorre — apenas em produção (PostgreSQL 14)
- Outros serviços que não usam enum sem anotação funcionam normalmente

Comece sua investigação.
```
