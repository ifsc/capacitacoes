# CARE — Context / Action / Result / Example

| Sigla      | Em português |
|------------|--------------|
| **C**ontext  | Contexto     |
| **A**ction   | Ação         |
| **R**esult   | Resultado    |
| **E**xample  | Exemplo      |

**Quando usar:** Situações onde o domínio é complexo ou ambíguo e o modelo precisa de contexto
rico antes de agir. O bloco **Example** é o diferencial — ele ancora o padrão de resposta esperado
com um caso anterior resolvido, eliminando a variação de formato entre execuções. Ótimo para
diagnósticos recorrentes, geração de documentos padronizados e tarefas onde "tom" e "nível de
detalhe" importam tanto quanto o conteúdo.

---

## Formato do prompt

```
Context: [situação atual — sistema, ambiente, sintoma, o que já foi tentado]

Action:  [o que o modelo deve fazer com esse contexto — verbo de ação claro]

Result:  [como o resultado deve ser — estrutura, nível de detalhe, o que deve conter]

Example: [um caso anterior resolvido no mesmo padrão — ancora o formato e o raciocínio]
```

---

## Exemplo — chamado de suporte em sistema acadêmico

```
Context: Sistema acadêmico Spring Boot 3.2, PostgreSQL. Chamado #4471: professor da
         turma CCO-101-A não consegue lançar notas desde hoje de manhã. Outros
         professores lançam normalmente. Período de lançamento está aberto até
         sexta-feira. Nenhum deploy recente no módulo de notas.

Action:  Investigue a causa do bloqueio específico para esta turma e proponha os
         passos de resolução em ordem de prioridade.

Result:  Lista de hipóteses ordenadas por probabilidade. Para cada hipótese:
         causa em uma linha, consulta SQL ou log de verificação, e ação corretiva.
         Ao final, rascunhe a resposta que deve ser enviada ao professor com
         linguagem clara e sem jargão técnico.

Example: Chamado anterior resolvido (#4388): professor sem vínculo ativo com a turma
         no semestre corrente. Diagnóstico: SELECT em professor_turma sem registro
         para o semestre_id atual. Correção: INSERT em professor_turma com o
         semestre_id correto. Resposta ao usuário: "Identificamos que seu vínculo
         com a turma não estava ativo neste semestre. Já corrigimos — tente lançar
         novamente."
```

---

## Exemplo real — Sistema de Ingresso IFSC (Chamado #25165)

```
Context: Sistema de Ingresso do IFSC (sistemadeingresso.ifsc.edu.br), PHP/MySQL.
         Chamado #25165: o DEING gerou a chamada e publicou os resultados do processo
         idProcesso=10168 (Especialização em Inovação e Tecnologia, Tubarão,
         idCurso=15828). Os 23 candidatos aprovados aparecem corretamente na página
         de resultados publicada, mas não estão disponíveis na tela de importação
         do SIGAA. A funcionalidade "Reenviar candidato para acadêmico" foi tentada
         individualmente para cada candidato, mas o problema persiste. O código do
         curso foi conferido e está correto.

Action:  Explique por que o reenvio individual falha nesse cenário, indique o
         procedimento correto de resolução e oriente como o DEING pode executar
         sem precisar abrir novo chamado ao DSI.

Result:  Resposta estruturada em dois blocos: (1) explicação da causa raiz em
         linguagem acessível ao operador do DEING, sem jargão de banco de dados;
         (2) passo a passo numerado da ação corretiva com o caminho exato na
         interface admin do sistema. Ao final, uma frase de confirmação que o
         operador pode usar para validar que o problema foi resolvido.

Example: Chamado anterior resolvido (#25165 — mesmo padrão): após geração de
         chamada de pós-graduação, candidatos não apareciam no SIGAA e o reenvio
         individual não funcionava. Solução: usar a tela "Gerar primeira chamada"
         para o processo/curso — o sistema reenvia o lote completo e tem prioridade
         sobre o reenvio individual. Após o procedimento, todos os candidatos
         ficaram disponíveis para importação. O reenvio individual só funciona para
         candidatos cuja situação já está correta na base; quando o lote inteiro
         não chegou ao SIGAA, o envio em lote é obrigatório.
```
