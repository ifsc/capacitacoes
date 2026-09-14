# Caso 2 — Geração de Código

> **Pré-requisito:** mesmos do Caso 1. Se ainda não rodou o Caso 1, comece
> por ele para já ter a sensação de latência do modelo local.

## Prompt para rodar

Execute exatamente o prompt abaixo nos **dois ambientes**:

1. **Local (Ollama)** — escolha uma das formas:

   Terminal direto:
   ```bash
   ollama run llama3.2:3b "Escreva uma função Python que receba uma lista de strings e retorne apenas as que têm mais de 5 caracteres. Inclua um exemplo de uso com assert."
   ```

   Ou pelo **OpenCode** (troque o modelo antes com `/model ollama/llama3.2:3b`):
   ```
   Escreva uma função Python que receba uma lista de strings e retorne
   apenas as que têm mais de 5 caracteres.
   Inclua um exemplo de uso com assert.
   ```

2. **Nuvem (OpenCode ou OpenRouter)** — cole no chat:
   ```
   Escreva uma função Python que receba uma lista de strings e retorne
   apenas as que têm mais de 5 caracteres.
   Inclua um exemplo de uso com assert.
   ```

## O que observar

1. **Corretude:** o código gerado funciona? Teste rodando localmente se quiser:
   ```bash
   python3 -c "<cole o código aqui>"
   ```

2. **Estilo:** o modelo local gerou algo equivalente ao da nuvem, ou há
   diferença de qualidade perceptível (nomes ruins, lógica errada, falta de
   tipagem)?

3. **Latência:** o modelo local foi visivelmente mais lento?

4. **Tokens:** para geração de código, o output tende a ser mais longo — isso
   impacta o custo na nuvem. Quanto foi cobrado (se o OpenCode/OpenRouter
   mostrar)?

## O que preencher na matriz

- Coluna **"Local"**: o código funciona? (sim/não) + tempo de resposta.
- Coluna **"Nuvem"**: o código funciona? (sim/não) + tokens de output.
- Coluna **"Qualidade"**: nota de 1–3 para cada (1=ruim, 2=ok, 3=ótimo).

## Pergunta de discussão

Para geração de código simples (funções utilitárias, CRUD básico) com alta
frequência, faz sentido usar um modelo local? E para code review de um PR
crítico? (Gancho: o trade-off entre capacidade e custo — SLMs resolvem 80%
dos casos por 10% do custo. O 20% restante é onde você roda o modelo grande.)
