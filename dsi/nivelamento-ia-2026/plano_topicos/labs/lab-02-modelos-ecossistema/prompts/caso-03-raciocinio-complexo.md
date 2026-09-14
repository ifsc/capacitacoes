# Caso 3 — Raciocínio Complexo

> **Pré-requisito:** mesmos dos casos anteriores. Este é o prompt mais longo
> — ideal para perceber a diferença de qualidade entre modelos pequenos e grandes.

## Prompt para rodar

Execute exatamente o prompt abaixo nos **dois ambientes**:

1. **Local (Ollama)** — escolha uma das formas:

   Terminal direto:
   ```bash
   ollama run llama3.2:3b "Você é um arquiteto de software sênior. Um time quer migrar um monólito Java 11 com 500 mil linhas de código para microsserviços. Eles têm 6 desenvolvedores, 3 meses de prazo e zero experiência com Kubernetes. Liste os 3 maiores riscos desta migração e sugira uma abordagem mais realista para o prazo e o time."
   ```

   Ou pelo **OpenCode** (troque o modelo antes com `/model ollama/llama3.2:3b`):
   ```
   Você é um arquiteto de software sênior.

   Um time quer migrar um monólito Java 11 com 500 mil linhas de código
   para microsserviços. Eles têm 6 desenvolvedores, 3 meses de prazo
   e zero experiência com Kubernetes.

   Liste os 3 maiores riscos desta migração e sugira uma abordagem mais
   realista para o prazo e o time.
   ```

2. **Nuvem (OpenCode ou OpenRouter)** — cole no chat:
   ```
   Você é um arquiteto de software sênior.

   Um time quer migrar um monólito Java 11 com 500 mil linhas de código
   para microsserviços. Eles têm 6 desenvolvedores, 3 meses de prazo
   e zero experiência com Kubernetes.

   Liste os 3 maiores riscos desta migração e sugira uma abordagem mais
   realista para o prazo e o time.
   ```

## O que observar

1. **Profundidade:** o modelo local identificou riscos reais e relevantes
   (complexidade operacional, débito técnico, time sem preparo), ou ficou
   genérico demais?

2. **Raciocínio:** a sugestão alternativa faz sentido técnico? (Strangler Fig
   pattern, modularização antes de dividir, capacitação do time antes do Kubernetes?)

3. **Diferença perceptível:** este é o caso onde a diferença entre SLM e LLM
   grande costuma ser mais visível. Anote o que notou.

4. **Latência e custo:** compare com os dois casos anteriores — outputs mais
   longos custam mais tokens e levam mais tempo no modelo local.

## O que preencher na matriz

- Coluna **"Local"**: os riscos foram relevantes? (sim/parcial/não) + tempo.
- Coluna **"Nuvem"**: os riscos foram relevantes? + tokens usados.
- Coluna **"Qualidade"**: qual modelo você usaria num cenário real? Por quê?

## Pergunta de discussão

Se você fosse montar uma arquitetura híbrida para este time (SLM local +
API cloud), qual tarefa você colocaria em cada lado? (Gancho: classificação e
geração simples → SLM local; análise arquitetural e decisões críticas → API
cloud. O custo de um erro em cada caso é o critério de corte.)

> **Nota para o instrutor:** este caso é o mais rico para discussão coletiva.
> Peça para 2 ou 3 participantes lerem a resposta do modelo local e a da nuvem
> em voz alta — a diferença costuma ser evidente e gera engajamento natural.
