# Lab: Modelo Local vs API Cloud

**Duração:** 30 min

## Instalação de Dependências

Execute os comandos abaixo para instalar o Ollama e baixar um modelo pequeno:

```bash
# Instalar o Ollama (roda modelos localmente, sem API key)
curl -fsSL https://ollama.com/install.sh | sh

# Verificar se está rodando
ollama --version
```

Depois de instalar, baixe um modelo pequeno (escolha um dos dois):

```bash
# Opção A — Llama 3.2 3B (~2 GB, mais comum)
ollama pull llama3.2:3b

# Opção B — Mistral 7B (~4 GB, menor modelo Mistral, roda em CPU)
ollama pull mistral:7b

```

> **Tempo de download:** depende da sua conexão. O Llama 3.2 3B leva em torno
> de 3–8 minutos em conexões corporativas. Comece o download enquanto o
> instrutor explica o módulo — ele vai estar pronto quando chegar a hora do lab.

**Para testar se o modelo está disponível:**

```bash
ollama list
```

### Configurar o OpenCode para usar o Ollama

Após instalar o Ollama e baixar o modelo, adicione o provider no seu config do OpenCode.

#### Opção A — Ollama local (modelo rodando na sua máquina)

```jsonc
"ollama": {
  "npm": "@ai-sdk/openai-compatible",
  "options": {
    "baseURL": "http://localhost:11434/v1"
  },
  "models": {
    "llama3.2:3b": {},
    "mistral:7b": {}
  }
}
```

#### Opção B — Servidor institucional Caliban (Ollama remoto, sem precisar baixar modelo)

Se você não conseguiu instalar o Ollama ou não tem espaço em disco, use o servidor
compartilhado da instituição em `191.36.4.11`. Ele já tem modelos carregados e
prontos para uso:

```jsonc
"caliban": {
  "npm": "@ai-sdk/openai-compatible",
  "name": "Caliban (instituição)",
  "options": {
    "baseURL": "http://191.36.4.11/ollama/v1",
    "headers": {
      "Authorization": "Basic Y2FwYWNpdGFjYW86Y2FsaWJhbjIwMjY="
    }
  },
  "models": {
    "ornith:9b": {},
    "qwen3.6:35b": {},
    "minimax-m3:cloud": {},
    "deepseek-v4-pro:cloud": {}
  }
}
```

| Modelo | Onde roda | Tamanho |
|---|---|---|
| `ornith:9b` | Servidor (CPU) | 5.6 GB |
| `qwen3.6:35b` | Servidor (CPU) | 23.9 GB |
| `minimax-m3:cloud` | Nuvem (proxy) | — |
| `deepseek-v4-pro:cloud` | Nuvem (proxy) | — |

> **Credenciais:** usuário `capacitacao`, válidas durante o período de capacitação.
> Serão revogadas ao final do curso.

#### Exemplo completo (junta os dois providers)

Se precisar de referência, um `~/.config/opencode/opencode.jsonc` com ambos os
providers fica assim:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "ollama": {
      "npm": "@ai-sdk/openai-compatible",
      "options": {
        "baseURL": "http://localhost:11434/v1"
      },
      "models": {
        "llama3.2:3b": {},
        "mistral:7b": {}
      }
    },
    "caliban": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "Caliban (instituição)",
      "options": {
        "baseURL": "http://191.36.4.11/ollama/v1",
        "headers": {
          "Authorization": "Basic Y2FwYWNpdGFjYW86Y2FsaWJhbjIwMjY="
        }
      },
      "models": {
        "ornith:9b": {},
        "qwen3.6:35b": {},
        "minimax-m3:cloud": {},
        "deepseek-v4-pro:cloud": {}
      }
    }
  }
}
```

> **Atenção:** se você já tem um `opencode.jsonc` com outras configurações (skills,
> outros providers etc.), não sobrescreva — adicione apenas o bloco do provider
> desejado dentro do JSON existente.

Depois de salvar, abra o OpenCode e use `/models` para confirmar que os modelos
aparecem na lista. Para trocar de modelo na sessão:
`/model ollama/llama3.2:3b` ou `/model ollama/mistral:7b`.

---

## O que você vai entregar

- [ ] Três prompts idênticos executados no **modelo local (Ollama)** e em uma
  **API na nuvem** (OpenRouter ou OpenCode com Claude/GPT)
- [ ] Matriz de decisão preenchida comparando custo, latência e qualidade para
  cada um dos 3 prompts — ver
  [`matriz-decisao.md`](./matriz-decisao.md)
- [ ] Bônus (opcional): experimentos com temperature e top-P no Groq Playground —
  ver [`prompts/extra-topk-temperature.md`](./prompts/extra-topk-temperature.md).
  Salve um relato das variações que observou em `work/<seu-login>/relato-topk-temperature.md`


**Prompts dos 3 casos:** ver pasta [`prompts/`](./prompts/)

> **Antes de tudo:** dentro da pasta [`work/`](./work/), crie uma subpasta com
> o seu login institucional em slug (ex: `work/joao.silva/`) e rode o OpenCode
> a partir dela (`mkdir -p work/<seu-login> && cd work/<seu-login> && opencode`).
> Isso evita arquivos soltos gerados pelo agente na pasta do lab e evita
> conflito entre o material de alunos diferentes.

---

## Bônus: Modelo no Celular com PocketPal AI

Quer ver um modelo rodando 100% offline no seu smartphone, sem internet, sem API?
O **PocketPal AI** faz exatamente isso — baixa modelos GGUF direto do Hugging Face
e roda localmente no aparelho.

- [Android — Google Play](https://play.google.com/store/apps/details?id=com.pocketpalai&hl=pt_BR&pli=1)
- [iOS — App Store](https://apps.apple.com/br/app/pocketpal-ai)

**O que fazer:**

1. Instale o app e baixe um modelo pequeno (Llama 3.2 1B ou Phi-3 Mini são boas
   opções — cabem em qualquer celular).
2. Cole o mesmo prompt do **Caso 1 — Classificação** e compare a resposta com o
   que você obteve no notebook.
3. Observe a latência — em celulares mais antigos, pode levar alguns segundos por
   token.

**O que isso demonstra:** o mesmo modelo que roda no seu notebook pode rodar no
seu bolso, sem depender de nenhum servidor. É a versão mais concreta do argumento
"privacidade e soberania" do Módulo 2.

---

## Bônus: Estimativa de Custo

Após executar os 3 prompts nos dois ambientes, acesse o playground do
OpenRouter e cole o **Prompt 3 — Raciocínio Complexo** nos dois modelos ao
mesmo tempo:

[OpenRouter Chat — Claude Opus 4.7 vs Llama 3.2 3B](https://openrouter.ai/chat?models=anthropic/claude-opus-4.7,meta-llama/llama-3.2-3b-instruct:free)

**O que comparar:**

- Tokens de input/output e custo estimado (o próprio OpenRouter mostra)
- Latência de resposta
- Qualidade: qual modelo deu uma resposta mais útil? Qual errou ou ficou vago?

Anote os valores na coluna **"Nuvem (cloud)"** da sua matriz — os modelos
gratuitos no OpenRouter são uma boa proxy do que você pagaria por tokens em
produção.
