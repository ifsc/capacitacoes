# Caso 2 — Data de Corte (Knowledge Cutoff)

> **Pré-requisito 1:** dentro da pasta `work/`, crie uma subpasta com o seu
> login institucional em slug (ex: `work/joao.silva/`) e rode o OpenCode a
> partir dela (`mkdir -p work/<seu-login> && cd work/<seu-login> && opencode`).
> Isso evita arquivos soltos gerados pelo agente na pasta do lab.
>
> **Pré-requisito 2:** troque o modelo no OpenCode para **Nemotron 3 Ultra
> (free, OpenCode Zen)** com `/models`. Um modelo menor e gratuito torna
> essas limitações mais fáceis de reproduzir.

## Prompt para rodar no OpenCode

```
Sem usar nenhuma ferramenta de busca (websearch, webfetch ou similar) e sem
consultar a internet, responda apenas com o que você já sabe do seu
treinamento: qual é a versão estável mais recente do Spring Boot? Liste as
principais novidades dessa versão.
```

(Pode trocar "Spring Boot" por Node.js LTS, Java, Angular, ou qualquer stack
que o grupo use no dia a dia — o efeito é o mesmo.)

> **Por que o "sem usar ferramenta de busca" é importante:** o OpenCode pode
> ter `websearch`/`webfetch` habilitado (nativo ou via MCP), e alguns modelos
> são proativos em usar essas ferramentas mesmo sem serem instruídos. Se isso
> acontecer, o modelo vai responder com a informação CORRETA e atual — e a
> limitação de data de corte não vai aparecer. Se mesmo pedindo explicitamente
> para não usar ferramentas o modelo insistir em pesquisar, veja a seção
> "Se o modelo continuar pesquisando" abaixo.

## O que fazer

1. Rode o prompt e anote a versão e as novidades que o modelo respondeu.
2. Confira se ele chamou alguma tool (o OpenCode mostra a chamada na
   interface, tipo `🔧 webfetch` ou `🔧 websearch`). Se chamou, o exercício
   não vai funcionar como esperado — veja a seção abaixo.
3. Abra o site oficial do projeto (ex: spring.io/projects/spring-boot) e confira
   a versão estável real, na data de hoje.
4. Compare: a resposta da IA está desatualizada? Ela avisou que pode estar
   desatualizada, ou respondeu como se fosse a informação mais atual do mundo?
5. Preencha a ficha de diagnóstico.

## Se o modelo continuar pesquisando

Algumas formas de garantir que o modelo responda só com conhecimento interno:

- Use o comando `/share` ou verifique em `/models` se há tools de busca
  habilitadas; se sim, o instrutor pode desabilitar temporariamente
  `websearch`/`webfetch` no `opencode.json` do projeto (`work/`) com:
  ```json
  {
    "tools": {
      "websearch": false,
      "webfetch": false
    }
  }
  ```
- Alternativa mais simples em sala: peça para o aluno tentar de novo em uma
  sessão nova (`/new`), reforçando "responda de memória, não pesquise" —
  a maioria dos modelos obedece na segunda tentativa.
- Se ainda assim insistir em pesquisar, isso já é um resultado válido para
  discussão: é a prova viva de que ferramentas (RAG/websearch) resolvem a
  data de corte — e o modelo "escolheu" contornar a própria limitação.

## Dica para a reescrita

Esse caso é diferente do Caso 1: **nenhuma reescrita de prompt resolve isso**.
Data de corte é uma limitação estrutural — o modelo não tem acesso a nada
publicado depois do fim do seu treinamento. A única forma de mitigar é dar
contexto externo atualizado para o modelo, por exemplo:

```
Qual é a versão estável mais recente do Spring Boot? Use a ferramenta de busca
na web para confirmar antes de responder, e cite a fonte.
```

Ou colar diretamente o trecho do release notes / changelog na conversa antes
de perguntar.

## Pergunta de discussão

Se nenhum prompt sozinho resolve esse problema, o que resolve? (Gancho: isso é
a porta de entrada para RAG — Módulo 4 — e para ferramentas como MCP/Context7
— Módulo 5, que buscam informação atualizada em tempo real.)
