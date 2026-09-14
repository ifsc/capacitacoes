# 00 — Explicando Embeddings com Redes Neurais

**Duração:** 15 min

---

## O que você vai aprender

Neste projeto você vai ver uma rede neural simples em ação: o modelo aprende a classificar
pessoas em categorias (**premium**, **medium**, **basic**) a partir de atributos como idade,
cor favorita e localização.

O objetivo não é o classificador em si, mas entender como dados do mundo real são
**transformados em vetores numéricos** para que a rede consiga processá-los — esse é o
fundamento por trás dos embeddings usados em RAG.

---

## Contexto — O que são Embeddings

Embeddings são representações numéricas de dados (texto, imagens, categorias) em um
espaço vetorial. Uma rede neural não entende "azul" ou "São Paulo" diretamente — ela
precisa de números.

Este projeto demonstra duas técnicas de vetorização:

| Técnica | O que faz | Exemplo |
|---------|-----------|---------|
| **Normalização** | Escala valores numéricos entre 0 e 1 | `idade = (28 - 25) / (40 - 25) = 0.2` |
| **One-hot encoding** | Transforma categorias em posições binárias | `azul → [1, 0, 0]`, `vermelho → [0, 1, 0]` |

Ao final, cada pessoa vira um vetor de 7 dimensões que a rede neural consegue processar.

---

## Pré-requisitos

- Node.js **v22** (o `@tensorflow/tfjs-node` não suporta Node 24+)
- npm

> Se você tiver Node 24 instalado, use `nvm` para trocar de versão:
> ```bash
> nvm install 22 && nvm use 22
> ```
> Ou crie um `.nvmrc` na pasta:
> ```bash
> echo "22" > .nvmrc && nvm use
> ```

---

## Passo a Passo

### 1. Instalar dependências

```bash
cd projetos_demo/00_explicando_embeddings
npm install
```

### 2. Rodar o projeto

```bash
npm start
```

Você vai ver no terminal o treinamento da rede por 100 épocas e, ao final, a predição
de categoria para uma nova pessoa:

```
Epoch 0: loss = 1.0987
Epoch 1: loss = 1.0891
...
Epoch 99: loss = 0.0312
premium (87.45%)
medium (9.12%)
basic (3.43%)
```

---

## Entendendo o Código

### Vetorização dos dados (`index.js`)

O dataset de treino tem 3 pessoas, cada uma representada por um vetor de 7 posições:

```
[idade_normalizada, azul, vermelho, verde, São Paulo, Rio, Curitiba]
```

| Pessoa | Vetor |
|--------|-------|
| Erick (30, azul, SP) | `[0.33, 1, 0, 0, 1, 0, 0]` |
| Ana (25, vermelho, Rio) | `[0, 0, 1, 0, 0, 1, 0]` |
| Carlos (40, verde, Curitiba) | `[1, 0, 0, 1, 0, 0, 1]` |

### Arquitetura da rede

```
Entrada (7 neurônios)
   ↓
Camada densa (80 neurônios, ReLU)   ← aprende os padrões
   ↓
Saída (3 neurônios, Softmax)        ← probabilidade de cada categoria
```

- **ReLU**: filtra ativações negativas — só deixa "passar" o que é relevante
- **Softmax**: normaliza a saída em probabilidades que somam 100%
- **Adam**: otimizador que ajusta os pesos aprendendo com o histórico de erros
- **categoricalCrossentropy**: função de perda para classificação multi-classe

### Predição de nova pessoa

A nova pessoa também precisa ser vetorizada com o **mesmo padrão** do treino:

```js
// Zé: idade 28, cor verde, localização Rio
// idade = (28 - 25) / (40 - 25) = 0.2
const pessoaTensorNormalizado = [[0.2, 1, 0, 0, 0, 1, 0]]
```

> A escala de normalização (`min=25`, `max=40`) deve ser a mesma usada no treino.
> Usar escalas diferentes causaria predições incorretas — o mesmo vale para embeddings em RAG.

---

## Conexão com RAG e Embeddings

Este projeto é uma versão simplificada do que acontece dentro de um modelo de embedding:

1. **Dados brutos** (texto, categorias) → **vetores numéricos**
2. Vetores similares ficam **próximos no espaço vetorial**
3. A busca por similaridade encontra os vetores mais próximos de uma query

No `01_rag_tradicional_vector_store`, o modelo `all-MiniLM-L6-v2` faz exatamente isso,
mas com vetores de **384 dimensões** para representar chunks de texto completos.
