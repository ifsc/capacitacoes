# RISE — Role / Input / Steps / Expectation

| Sigla           | Em português |
|-----------------|--------------|
| **R**ole        | Papel        |
| **I**nput       | Entrada      |
| **S**teps       | Passos       |
| **E**xpectation | Expectativa  |

**Quando usar:** Problemas que envolvem múltiplas fontes de dados e exigem um raciocínio em etapas
bem definidas. O bloco **Steps** força o modelo a seguir um fluxo explícito — equivale a aplicar
Chain-of-Thought diretamente no framework. Ideal para diagnósticos técnicos complexos, análises
com critérios de qualidade altos e situações onde você quer auditabilidade do raciocínio do modelo.

---

## Formato do prompt

```
Role:        [quem o modelo é — especialidade, nível, domínio de conhecimento]

Input:       [todos os dados disponíveis — logs, stack trace, chamado, configurações]

Steps:       1. [primeiro passo do raciocínio]
             2. [segundo passo]
             3. [...]
             (quantos passos forem necessários)

Expectation: [critério de qualidade da resposta — o que uma boa resposta deve conter
              e o que ela não deve omitir]
```

---

## Exemplo — chamado de suporte em sistema acadêmico

```
Role:        Você é um especialista em suporte de sistemas acadêmicos com conhecimento
             de Spring Boot, JPA/Hibernate, PostgreSQL e regras de negócio de lançamento
             de notas em instituições de ensino superior.

Input:       Chamado #4471 — Prioridade Alta.
             Relato: "Não consigo lançar nota para a turma CCO-101-A. Erro desde
             hoje de manhã. Preciso lançar até sexta-feira."
             Dados adicionais:
             - Outros professores lançam notas normalmente
             - Período de lançamento: aberto (encerra sexta 23:59)
             - Último deploy: há 3 dias, sem alteração no módulo de notas
             - Turma CCO-101-A: 38 alunos, semestre 2026-1

Steps:       1. Liste as causas mais comuns de bloqueio de lançamento de nota
                restrito a uma turma específica (vínculo professor-turma, oferta
                ativa, permissão de perfil, período de lançamento por curso).
             2. Para cada causa, indique a consulta SQL ou log que confirma ou
                descarta a hipótese.
             3. Ordene as hipóteses da mais provável para a menos provável com
                base nos dados disponíveis no Input.
             4. Redija a resposta ao professor: o que está sendo investigado,
                prazo de retorno e o que ele pode fazer enquanto isso.

Expectation: Diagnóstico objetivo com hipóteses ranqueadas e justificadas.
             Cada hipótese deve ter sua verificação prática.
             A resposta ao usuário deve ser clara, sem jargão técnico e transmitir
             senso de urgência compatível com o prazo de sexta-feira.
```

---

## Exemplo real — Sistema de Ingresso IFSC (Chamado #19677 / #14119)

```
Role:        Você é analista de suporte do DSI/IFSC com domínio no Sistema de
             Ingresso (PHP/MySQL, banco coing_ingresso). Conhece as tabelas
             candidatos, comum.candidatos_aprovados e o fluxo de chamadas do
             processo seletivo (INS → CLA → APV). Sabe identificar efeitos
             colaterais de um retrocesso antes de executá-lo.

Input:       Chamado #33478 — Solicitante: DEING .
             Relato: "Precisamos retroceder a chamada do curso Técnico Integrado
             em Edificações (idCurso=15284) e Técnico Integrado em Saneamento
             (idCurso=15290), processo idProcesso=10128. A 13ª chamada foi gerada
             com candidatos errados. Nenhum candidato efetivou matrícula ainda."
             Dados adicionais:
             - Situação atual: candidatos com situacao='APV' e chamada=13
             - Matrículas efetivadas: nenhuma (confirmado pelo DEING)
             - Recurso "Retroceder Situação Primeira Chamada" ainda não está
               liberado para o DEING neste processo — requer intervenção do DSI
             - Prazo: antes do início do período de matrícula (amanhã às 8h)

Steps:       1. Verifique se existem pré-condições que impedem o retrocesso seguro:
                matrículas efetivadas, candidatos já importados no SIGAA,
                candidatos em comum.candidatos_aprovados. Liste cada verificação
                com a consulta SQL correspondente.
             2. Se as verificações passarem, escreva o script de retrocesso em
                ordem: primeiro apagar os registros de comum.candidatos_aprovados,
                depois atualizar a tabela candidatos devolvendo situacao='CLA',
                zerando situacaodeClassificacao e chamada=NULL.
             3. Inclua uma consulta de conferência final que confirme que nenhum
                candidato ficou com chamada=13 após o retrocesso.
             4. Redija o retorno ao DEING informando o que foi feito, o que eles
                devem verificar na interface antes de gerar a nova chamada e se
                há alguma limitação que persiste.

Expectation: Script SQL seguro, com comentários explicando cada bloco.
             As verificações do passo 1 devem vir antes de qualquer UPDATE/DELETE.
             A resposta ao DEING deve ser objetiva: o que foi feito, o que checar
             na interface, e se precisam aguardar alguma ação adicional do DSI.
             Não omitir riscos caso alguma verificação retorne resultado inesperado.
```
