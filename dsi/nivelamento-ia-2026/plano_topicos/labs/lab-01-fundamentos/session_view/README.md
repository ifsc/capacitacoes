# Session Viewer

Script para visualizar sessões do OpenCode em formato Markdown legível.

## Uso

```bash
# Visualizar a última sessão
./session-viewer.sh

# Visualizar sessão específica
./session-viewer.sh <session_id>
```

O script gera um arquivo `session-view.md` com:
- Mensagens do usuário
- Respostas do assistente
- Tokens utilizados por request
- Reasoning (pensamento do modelo)
- Chamadas de tools (webfetch, bash, read, edit, etc)

> **Dependências:** Veja [../README.md](../README.md) para instalação.
