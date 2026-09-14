# Sugestões de Melhorias — Análise de Prompt Engineering

Este documento analisa os dois prompts do pipeline de análise de feedbacks (`data-sanitizer.md` e `insights-distiller.md`) e propõe melhorias baseadas em técnicas de prompt engineering.

---

## 1. `data-sanitizer.md`

### 1.1 Adicionar Few-Shot Examples para casos ambíguos

**Conceito:** Few-shot prompting fornece exemplos concretos que ancoram o comportamento do modelo em casos limítrofes, reduzindo interpretações divergentes.

**Problema atual:** As regras de descarte não cobrem casos onde um ticket mistura tipos (ex: reclamação de atendimento + problema sistêmico). O modelo precisa inferir sozinho.

**Melhoria sugerida:** Adicionar uma seção `# Exemplos` com casos representativos:

```markdown
# Exemplos de classificação

- DESCARTAR → "o gerente da agência foi grosso comigo"
  Motivo: atendimento físico sem relação com o software.

- MANTER + SANITIZAR → "cobraram tarifa indevidamente, liguei pro 0800 e o atendente foi grosseiro"
  Motivo: o problema central é cobrança indevida no sistema. A menção ao atendente é contexto, não o tema principal.

- DESCARTAR → "TESTE DE PRODUCAO - IGNORAR - ASDFGH"
  Motivo: ticket de teste de desenvolvimento.
```

---

### 1.2 Definir ordem de prioridade entre critérios de descarte conflitantes

**Conceito:** Regras ambíguas ou sem precedência geram comportamento não-determinístico. Prompts de classificação precisam de hierarquia explícita.

**Problema atual:** A regra 2 lista 3 motivos de descarte em paralelo, sem dizer qual prevalece quando um ticket se encaixa em mais de um critério.

**Melhoria sugerida:** Adicionar uma regra de desempate:

```markdown
# Prioridade de descarte (aplique nesta ordem)
1. Se for mensagem automática de bot → DESCARTAR sempre, independente do conteúdo.
2. Se for ticket de teste → DESCARTAR sempre.
3. Se o tema central for atendimento físico/pessoal sem menção a fluxo do software → DESCARTAR.
4. Se houver dúvida, preserve o ticket (conservadorismo).
```

---

### 1.3 Expandir a lista de PII com tipos adicionais e regra de fallback

**Conceito:** Listas fechadas de exemplos são frágeis. Adicionar uma regra de fallback ("em caso de dúvida, redacte") transforma a lista em um piso mínimo, não em um teto.

**Problema atual:** O prompt cita CPF, e-mail, telefone e nomes de terceiros, mas omite endereços, números de conta, agências, IBAN e outros dados sensíveis comuns em contexto bancário.

**Melhoria sugerida:**

```markdown
# Dados pessoais a remover (substitua por [REDACTED])
- CPF, CNPJ, RG
- E-mails e telefones
- Nomes completos de terceiros (ex: familiares, funcionários citados)
- Números de conta, agência ou cartão
- Endereços físicos completos
- **Em caso de dúvida sobre qualquer dado identificável: aplique [REDACTED].**
```

---

### 1.4 Definir o schema de saída explicitamente

**Conceito:** Especificar o schema do output evita que o modelo adicione campos extras ou altere a estrutura, o que quebraria pipelines downstream.

**Problema atual:** O prompt diz apenas "array JSON válido" sem definir os campos esperados.

**Melhoria sugerida:** Adicionar ao final do prompt:

```markdown
# Schema de saída (estrito)
Cada objeto do array deve ter exatamente estes campos, sem adições:
{
  "id": "string — ID original do ticket",
  "author": "string — ID anonimizado (ex: user_1, user_2...)",
  "text": "string — texto sanitizado"
}
```

---

### 1.5 Instrução de determinismo (equivalente textual de temperature baixa)

**Conceito:** Quando não se controla o parâmetro `temperature` diretamente, uma instrução explícita de comportamento conservador reduz a variação entre execuções.

**Melhoria sugerida:** Adicionar ao início ou fim do prompt:

```markdown
# Comportamento esperado
Seja determinístico. Não infira informações que não estejam explicitamente no texto.
Em caso de ambiguidade, aplique sempre a decisão mais conservadora (preservar o ticket, redactar o dado).
```

---

## 2. `insights-distiller.md`

### 2.1 Adicionar critérios de desambiguação entre categorias

**Conceito:** Categorias de classificação precisam de fronteiras claras. Sem elas, o modelo toma decisões inconsistentes entre execuções — especialmente em casos que estão na borda entre duas categorias.

**Problema atual:** `BUG_CRITICO` e `UX_UI_IMPROVEMENT` têm sobreposição real. O extrato limitado a 30 dias (tkt_10) pode ser visto como limitação técnica (bug) ou deficiência de design (UX). A lentidão recorrente (tkt_16) foi classificada como `BUG_CRITICO` com severidade `MEDIA` — combinação que pode gerar confusão.

**Melhoria sugerida:** Adicionar regras de precedência às categorias:

```markdown
# Regras de classificação (aplique nesta ordem)
1. BUG_CRITICO: há perda financeira, crash, bloqueio total de funcionalidade core, ou inconsistência de dados.
2. UX_UI_IMPROVEMENT: funcionalidade existe mas é difícil de usar, lenta ou confusa — sem bloqueio total.
3. NEW_FEATURE: funcionalidade completamente inexistente no produto.

Quando houver dúvida entre BUG_CRITICO e UX_UI_IMPROVEMENT, use BUG_CRITICO.
```

---

### 2.2 Definir critérios completos de severidade

**Conceito:** Prompts de classificação precisam de critérios para todos os valores possíveis, não apenas para os casos extremos. Deixar MEDIA e BAIXA sem definição força o modelo a inferir por analogia.

**Problema atual:** O prompt só define que "crashes e telas brancas são sempre ALTA", deixando MEDIA e BAIXA completamente sem critério.

**Melhoria sugerida:**

```markdown
# Critérios de severidade
- ALTA: perda financeira confirmada ou possível, crash do app, bloqueio total de funcionalidade essencial (login, Pix, transferência), inconsistência de dados.
- MEDIA: funcionalidade degradada (lenta, incompleta, com workaround), impacto recorrente mas sem bloqueio total.
- BAIXA: melhoria de conforto, feature nova sem equivalente, problema cosmético ou de preferência pessoal.
```

---

### 2.3 Instrução de ordenação do backlog por prioridade

**Conceito:** O output de um prompt deve servir diretamente ao caso de uso. Um backlog priorizado implica ordem — sem instrução explícita, o modelo entrega na ordem da entrada.

**Problema atual:** O array resultante sai na ordem dos tickets originais, não por severidade ou impacto.

**Melhoria sugerida:** Adicionar ao final da seção `# Output`:

```markdown
Ordene o array resultante por prioridade decrescente:
1. BUG_CRITICO / ALTA
2. BUG_CRITICO / MEDIA
3. UX_UI_IMPROVEMENT / ALTA ou MEDIA
4. NEW_FEATURE e itens de severidade BAIXA
```

---

### 2.4 Padronizar o formato e tamanho do campo `proposed_action`

**Conceito:** Campos de texto livre sem restrição geram outputs com tamanho e profundidade inconsistentes, dificultando a leitura e o uso downstream.

**Problema atual:** "Curta e direta" é subjetivo — algumas ações saíram com uma linha, outras com três parágrafos.

**Melhoria sugerida:**

```markdown
# Formato de proposed_action
Máximo 2 frases. Estrutura obrigatória:
[Diagnóstico técnico do problema] + [Ação concreta recomendada ao time].

Exemplo:
"Possível overflow de data ao aceitar dia 31 em meses com 30 dias.
Corrigir validação para usar o último dia válido do mês e adicionar testes para datas limítrofes."
```

---

### 2.5 Instrução de consolidação de tickets duplicados

**Conceito:** Em datasets reais, múltiplos usuários reportam o mesmo bug. Sem instrução de deduplicação, o modelo gera um TKT por feedback, inflando o backlog com itens redundantes.

**Melhoria sugerida:** Adicionar às regras de análise:

```markdown
# Deduplicação
Se dois ou mais feedbacks descrevem o mesmo problema técnico (mesmo fluxo + mesmo sintoma),
consolide-os em um único ticket. Liste todos os IDs de referência no campo "original_ref"
separados por vírgula (ex: "tkt_07, tkt_19").
```

---

### 2.6 Fixar a sequência de IDs dos tickets gerados

**Conceito:** Outputs não-determinísticos em campos de identificação quebram rastreabilidade em pipelines encadeados. O modelo pode iniciar a numeração em qualquer valor se não for instruído.

**Problema atual:** O prompt usa `"ex: TKT-101"` como sugestão, mas o modelo pode escolher qualquer número inicial.

**Melhoria sugerida:**

```markdown
# Geração de ticket_id
Use sequência numérica iniciando em TKT-001, incrementando 1 por ticket (TKT-001, TKT-002...).
Se um ID de continuação for fornecido como parâmetro, inicie a partir dele.
```

---

## Resumo das melhorias por conceito

| Conceito de Prompt Engineering | Prompts afetados |
|---|---|
| Few-shot examples | data-sanitizer |
| Hierarquia e precedência de regras | data-sanitizer, insights-distiller |
| Schema de output explícito | data-sanitizer, insights-distiller |
| Critérios de classificação completos | insights-distiller |
| Instrução de determinismo (sem temperature) | data-sanitizer, insights-distiller |
| Ordenação do output | insights-distiller |
| Restrição de formato de campo livre | insights-distiller |
| Deduplicação / consolidação | insights-distiller |
| Sequência determinística de IDs | insights-distiller |
