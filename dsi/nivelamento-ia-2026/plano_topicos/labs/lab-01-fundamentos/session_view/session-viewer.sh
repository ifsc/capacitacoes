#!/bin/bash

DB="$HOME/.local/share/opencode/opencode.db"
OUTPUT="session-view.md"

if [ ! -f "$DB" ]; then
  echo "Banco não encontrado: $DB"
  exit 1
fi

SESSION_ID="${1:-$(sqlite3 "$DB" "SELECT id FROM session ORDER BY time_created DESC LIMIT 1;")}"

if [ -z "$SESSION_ID" ]; then
  echo "Nenhuma sessão encontrada"
  exit 1
fi

TITLE=$(sqlite3 "$DB" "SELECT title FROM session WHERE id='$SESSION_ID';")
TOKENS_IN=$(sqlite3 "$DB" "SELECT tokens_input FROM session WHERE id='$SESSION_ID';")
TOKENS_OUT=$(sqlite3 "$DB" "SELECT tokens_output FROM session WHERE id='$SESSION_ID';")

cat > "$OUTPUT" << EOF
# Sessão: $TITLE

**ID:** \`$SESSION_ID\`
**Tokens Input:** $TOKENS_IN
**Tokens Output:** $TOKENS_OUT

---

EOF

# Analisar primeira requisição (system prompt + tools)
FIRST_USER_MSG=$(sqlite3 "$DB" "SELECT id FROM message WHERE session_id='$SESSION_ID' AND data LIKE '%\"role\":\"user\"%' ORDER BY time_created ASC LIMIT 1;")
FIRST_ASSISTANT_MSG=$(sqlite3 "$DB" "SELECT id FROM message WHERE session_id='$SESSION_ID' AND data LIKE '%\"role\":\"assistant\"%' ORDER BY time_created ASC LIMIT 1;")

# Pegar tokens da primeira resposta do assistente (contém os tokens da request)
FIRST_ASSISTANT_DATA=$(sqlite3 "$DB" "SELECT data FROM message WHERE id='$FIRST_ASSISTANT_MSG';")
FIRST_MSG_TOKENS=$(echo "$FIRST_ASSISTANT_DATA" | python3 -c "
import sys,json
d=json.load(sys.stdin)
t=d.get('tokens',{})
print(json.dumps(t))
" 2>/dev/null)

# Pegar texto do primeiro input do usuário
FIRST_PARTS=$(sqlite3 "$DB" "SELECT data FROM part WHERE message_id='$FIRST_USER_MSG' ORDER BY time_created ASC;")
FIRST_USER_TEXT=$(echo "$FIRST_PARTS" | python3 -c "
import sys,json
for line in sys.stdin:
    line=line.strip()
    if not line: continue
    d=json.loads(line)
    if d.get('type')=='text':
        print(d.get('text',''))
" 2>/dev/null)

# Pegar modelo usado
FIRST_MODEL=$(echo "$FIRST_ASSISTANT_DATA" | python3 -c "
import sys,json
d=json.load(sys.stdin)
print(f\"{d.get('providerID','?')}/{d.get('modelID','?')}\")
" 2>/dev/null)

# Calcular tokens estimados de system prompt + tools
INPUT_TOKENS=$(echo "$FIRST_MSG_TOKENS" | python3 -c "
import sys,json
t=json.load(sys.stdin)
print(t.get('input',0))
" 2>/dev/null)

USER_MSG_TOKENS=$(echo "$FIRST_USER_TEXT" | python3 -c "
import sys
text=sys.stdin.read().strip()
# Estimativa simples: 1 token ≈ 4 caracteres
print(max(1, len(text) // 4))
" 2>/dev/null)

SYSTEM_TOOLS_TOKENS=$(($INPUT_TOKENS - $USER_MSG_TOKENS))

cat >> "$OUTPUT" << EOF
## 📊 Análise da Primeira Requisição

**Modelo:** $FIRST_MODEL

**Tokens da primeira request:**

| Componente | Tokens | Descrição |
|------------|--------|-----------|
| Input total | $INPUT_TOKENS | Enviado à API |
| Mensagem do usuário | ~$USER_MSG_TOKENS | "$FIRST_USER_TEXT" |
| **System prompt + Tools** | **~$SYSTEM_TOOLS_TOKENS** | Instruções + definições de ferramentas |

> **Nota:** O system prompt e as definições de tools **não são salvos no banco**.
> São gerados dinamicamente a cada request pela API.
> A diferença entre o input total e a mensagem do usuário representa
> aproximadamente o custo fixo do system prompt + tools.

### O que vai nesse ~$SYSTEM_TOOLS_TOKENS?

**🔧 System Prompt (instruções):**
\`\`\`
You are opencode, an interactive CLI tool that helps users with software engineering tasks.

IMPORTANT: You must NEVER generate or guess URLs for the user unless you are confident...
When the user directly asks about opencode, first use the WebFetch tool...
Be concise, direct, and to the point...
\`\`\`

**🔧 Exemplos de Tools carregadas:**

| Tool | O que faz | Trecho da definição |
|------|-----------|---------------------|
| \`bash\` | Executa comandos no terminal | "Executes a given bash command in a persistent shell session..." |
| \`read\` | Lê arquivos | "Read a file or directory from the local filesystem..." |
| \`edit\` | Editar arquivos | "Performs exact string replacements in files..." |
| \`write\` | Criar/escrever arquivos | "Writes a file to the local filesystem..." |
| \`grep\` | Buscar em conteúdo | "Fast content search tool that works with any codebase size..." |
| \`glob\` | Buscar por padrão de nomes | "Fast file pattern matching tool that works with any codebase size..." |
| \`task\` | Lançar sub-agentes | "Launch a new agent to handle complex, multistep tasks..." |
| \`webfetch\` | Buscar conteúdo web | "Fetches content from a specified URL..." |
| \`websearch\` | Buscar na web | "Search the web using the session's web search provider..." |

Cada tool tem um JSON Schema detalhado com:
- Nome e descrição
- Parâmetros obrigatórios e opcionais
- Exemplos de uso
- Restrições e regras de segurança

> **Isso explica por que "oi" gasta 9.600+ tokens.**
> Não é a mensagem que pesa — é o "kit de ferramentas" + instruções.

---

EOF

MSG_IDS=$(sqlite3 "$DB" "SELECT id FROM message WHERE session_id='$SESSION_ID' ORDER BY time_created ASC;")

for MSG_ID in $MSG_IDS; do
  MSG_DATA=$(sqlite3 "$DB" "SELECT data FROM message WHERE id='$MSG_ID';")
  ROLE=$(echo "$MSG_DATA" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('role','?'))" 2>/dev/null)

  if [ "$ROLE" = "user" ]; then
    PARTS=$(sqlite3 "$DB" "SELECT data FROM part WHERE message_id='$MSG_ID' ORDER BY time_created ASC;")
    USER_TEXT=$(echo "$PARTS" | python3 -c "
import sys,json
for line in sys.stdin:
    line=line.strip()
    if not line: continue
    d=json.loads(line)
    if d.get('type')=='text':
        print(d.get('text',''))
" 2>/dev/null)

    cat >> "$OUTPUT" << EOF
## 👤 User

\`\`\`
$USER_TEXT
\`\`\`

EOF

  elif [ "$ROLE" = "assistant" ]; then
    TOKENS=$(echo "$MSG_DATA" | python3 -c "
import sys,json
d=json.load(sys.stdin)
t=d.get('tokens',{})
print(f\"Input: {t.get('input',0)} | Output: {t.get('output',0)} | Reasoning: {t.get('reasoning',0)} | Cache Read: {t.get('cache',{}).get('read',0)}\")
" 2>/dev/null)

    PARTS=$(sqlite3 "$DB" "SELECT data FROM part WHERE message_id='$MSG_ID' ORDER BY time_created ASC;")

    REASONING=$(echo "$PARTS" | python3 -c "
import sys,json
for line in sys.stdin:
    line=line.strip()
    if not line: continue
    d=json.loads(line)
    if d.get('type')=='reasoning':
        print(d.get('text',''))
" 2>/dev/null)

    TEXT=$(echo "$PARTS" | python3 -c "
import sys,json
for line in sys.stdin:
    line=line.strip()
    if not line: continue
    d=json.loads(line)
    if d.get('type')=='text':
        print(d.get('text',''))
" 2>/dev/null)

    TOOLS=$(echo "$PARTS" | python3 -c "
import sys,json
for line in sys.stdin:
    line=line.strip()
    if not line: continue
    d=json.loads(line)
    if d.get('type')=='tool':
        name=d.get('tool','?')
        state=d.get('state',{})
        inp=state.get('input',{})
        output=state.get('output','')
        status=state.get('status','?')
        
        print(f'### 🔧 {name} [{status}]')
        print()
        print('**Input:**')
        print()
        print(json.dumps(inp, indent=2, ensure_ascii=False))
        print()
        
        if output:
            out_str=str(output)
            if len(out_str)>1000:
                out_str=out_str[:1000]+'\n... (truncado)'
            print('**Output:**')
            print()
            print(out_str)
            print()
        
        print('---')
        print()
" 2>/dev/null)

    cat >> "$OUTPUT" << EOF
## 🤖 Assistant

**Tokens:** $TOKENS

EOF

    if [ -n "$REASONING" ]; then
      cat >> "$OUTPUT" << EOF
<details>
<summary>💭 Reasoning</summary>

$REASONING

</details>

EOF
    fi

    if [ -n "$TEXT" ]; then
      cat >> "$OUTPUT" << EOF
**Response:**

$TEXT

EOF
    fi

    if [ -n "$TOOLS" ]; then
      cat >> "$OUTPUT" << EOF
$TOOLS
EOF
    fi

    cat >> "$OUTPUT" << EOF
---

EOF
  fi
done

echo "Gerado: $OUTPUT"
