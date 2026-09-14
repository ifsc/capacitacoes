# Extra — Visualizando Temperature, Top-K e Top-P na Prática

> **Ferramenta principal:** [Groq Playground](https://console.groq.com/playground?model=llama-3.1-8b-instant)
> — roda modelos open-source (Llama, Mistral, Qwen) via API na nuvem, com
> controle direto de temperature e outros parâmetros pelo painel lateral.
> É gratuito com criação de conta.
>
> **Como acessar:**
> 1. Crie uma conta em [console.groq.com](https://console.groq.com)
> 2. Acesse diretamente o playground com Llama 3.1 8B:
>    [https://console.groq.com/playground?model=llama-3.1-8b-instant](https://console.groq.com/playground?model=llama-3.1-8b-instant)
> 3. No painel lateral direito, ajuste **Temperature** e **Max Tokens** antes de enviar

---

## Onde ficam os parâmetros no Groq Playground

No painel lateral direito você encontra:

- **Temperature** — de 0.0 a 2.0
- **Max Tokens** — limite de tokens na resposta
- **Model** — troque entre Llama, Mistral, Qwen etc.

> **Top-P** fica na seção **Advanced** do painel lateral direito. Clique em
> "Advanced" para expandir e ver o controle de `top_p`.

---

## Por que "o que é manga" não mostra diferença?

Perguntas factuais com resposta bem definida não revelam o efeito dos
parâmetros — o modelo vai na resposta óbvia independente do valor. Para ver
a diferença, você precisa de prompts **ambíguos ou criativos**, onde o modelo
tem múltiplas escolhas igualmente plausíveis.

---

## Experimento 1 — Completar frase

Envie o mesmo prompt **3 vezes** com cada configuração de Temperature.

**Configuração A — Determinístico:**
- Temperature: `0`

**Configuração B — Criativo:**
- Temperature: `2`

**Prompt:**
```
Complete a frase com uma palavra: O programador abriu o computador e começou a
```

> **O que esperar:**
> - Config A → mesma palavra toda vez ("digitar", provavelmente)
> - Config B → respostas diferentes a cada envio: "sonhar", "chorar",
>   "procrastinar", "debugar"...

---

## Experimento 2 — Texto criativo

**Configuração A — Temperature 0**

**Configuração B — Temperature 2**

**Prompt:**
```
Era uma vez um desenvolvedor que
```

> Execute 3 vezes cada configuração e compare. Com temperatura alta, cada
> execução gera uma história diferente.

---

## Experimento 3 — Código

**Configuração A — Temperature 0**

**Configuração B — Temperature 1**

**Prompt:**
```
Escreva uma função Python para verificar se um número é primo.
```

> Para código, temperature baixa costuma ser melhor — você quer consistência,
> não criatividade. Com temperatura alta pode variar nomes de variáveis,
> comentários e até a abordagem (divisão simples vs crivo de Eratóstenes).

---

## Experimento 4 — Top-P: corte por probabilidade acumulada

Este experimento mostra como o Top-P controla a "largura" do vocabulário que o
modelo usa — diferente do Temperature, que espalha as probabilidades, o Top-P
define um teto de candidatos baseado em confiança acumulada.

**No painel lateral, clique em "Advanced" e configure:**

**Cenário A — Top-P restrito (modelo conservador):**
- Temperature: `1.0`
- Top-P: `0.1`

**Cenário B — Top-P amplo (modelo exploratório):**
- Temperature: `1.0`
- Top-P: `0.99`

> Mantemos a Temperature igual em ambos para isolar o efeito do Top-P.

**Prompt — execute 3 vezes em cada cenário:**
```
No café da manhã, eu gosto de comer
```

> **O que esperar:**
> - **Cenário A (Top-P 0.1)**: o modelo usa apenas os tokens mais prováveis.
>   As 3 execuções ficam parecidas — *"pão com manteiga"*, *"pão com manteiga e café"*.
>   Respostas seguras, previsíveis, sem surpresa.
> - **Cenário B (Top-P 0.99)**: o modelo tem um vocabulário muito mais amplo.
>   Cada execução pode trazer: *"tapioca com queijo coalho"*, *"ovos mexidos com
>   cogumelos salteados"*, *"açaí com granola e banana"* — cada vez uma resposta
>   diferente, mais variada e inesperada.

**Prompt alternativo para comparar:**
```
Dê um nome criativo para uma startup de tecnologia que trabalha com IA e sustentabilidade.
```

> - **Cenário A**: nomes genéricos e similares entre execuções — "GreenAI", "EcoTech".
> - **Cenário B**: nomes mais inusitados e variados — "Mossfeed", "TerraLoop",
>   "Verdant Signal", "Humustack" — às vezes incoerentes, mas bem mais criativos.

---

## Referência rápida

| Temperature | Uso ideal |
|:-----------:|-----------|
| 0.0 | Determinístico. Classificação, extração, código crítico. |
| 0.2 | Preciso com mínima variação. Bom para código. |
| 0.7 | Balanceado. Default da maioria dos modelos. |
| 1.0 | Criativo. Brainstorming, texto livre. |
| 1.5 | Muito criativo / imprevisível. Pode alucinar mais. |
| 2.0 | Ruído. Pouco uso prático. |

> **Regra de bolso:** tarefas onde você quer sempre a mesma resposta
> (código, classificação, extração) → temperature baixa.
> Tarefas criativas ou exploratórias → temperature alta.

---

## Opcional — Modelos Locais com PocketPal AI

Se quiser ver esses mesmos parâmetros em um modelo rodando **100% offline
no seu smartphone**, o [PocketPal AI](https://github.com/a-ghorbani/pocketpal-ai)
permite ajustar temperature e Top-K com sliders em tempo real, sem internet,
sem API key.

- [Android — Google Play](https://play.google.com/store/apps/details?id=com.pocketpalai&hl=pt_BR&pli=1)
- [iOS — App Store](https://apps.apple.com/br/app/pocketpal-ai)

Baixe um modelo pequeno (Llama 3.2 1B ~800 MB ou Phi-3 Mini ~2 GB) e repita
os experimentos acima. A diferença visual de ajustar Top-K de 1 para 100
com sliders é bem didática — e tudo roda no seu bolso, sem depender de
nenhum servidor.
