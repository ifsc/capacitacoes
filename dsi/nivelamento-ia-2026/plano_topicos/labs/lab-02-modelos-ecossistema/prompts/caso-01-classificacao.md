# Caso 1 — Classificação Simples

> **Pré-requisito:** tenha o Ollama instalado com pelo menos um modelo baixado
> (`ollama list` deve mostrar pelo menos um modelo). Caso ainda não tenha,
> volte para a seção de instalação no [README](../README.md).

## Prompt para rodar

Execute exatamente o prompt abaixo nos **dois ambientes**:

1. **Local (Ollama)** — escolha uma das formas:

   Terminal direto:
   ```bash
   ollama run llama3.2:3b "Classifique o seguinte texto como: BUG, FEATURE ou DÚVIDA. Responda apenas com a categoria, sem explicação. Texto: 'Ao clicar em Salvar com o campo CPF vazio, a aplicação trava e exibe uma tela branca.'"
   ```

   Ou pelo **OpenCode** (troque o modelo antes com `/model ollama/llama3.2:3b`):
   ```
   Classifique o seguinte texto como: BUG, FEATURE ou DÚVIDA.
   Responda apenas com a categoria, sem explicação.

   Texto: "Ao clicar em Salvar com o campo CPF vazio, a aplicação
   trava e exibe uma tela branca."
   ```

2. **Nuvem (OpenCode ou OpenRouter)** — cole o prompt abaixo no chat:
   ```
   Classifique o seguinte texto como: BUG, FEATURE ou DÚVIDA.
   Responda apenas com a categoria, sem explicação.

   Texto: "Ao clicar em Salvar com o campo CPF vazio, a aplicação
   trava e exibe uma tela branca."
   ```

## O que observar

1. **Qualidade da resposta:** os dois modelos responderam só a categoria, ou
   um deles saiu do formato pedido?
2. **Latência:** anote o tempo de resposta de cada um (segundos).
3. **Custo:** local = R$ 0,00 de API. Cloud = quantos tokens foram usados?

## O que preencher na matriz

- Coluna **"Local"**: a categoria retornada e o tempo de resposta.
- Coluna **"Nuvem"**: a categoria retornada, tempo e tokens usados (se disponível).
- Coluna **"Qualidade"**: 1 (igual) ou anote a diferença.

## Pergunta de discussão

Para uma tarefa de classificação de alta frequência — digamos, 10.000
classificações por dia — qual dos dois faria mais sentido? Por quê?
(Gancho: custo × latência × privacidade. Tarefas simples e de alto volume são
o caso de uso ideal para um SLM local.)
