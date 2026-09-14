# Repositório de demonstração — como navegar

O `demo-ia.zip` é o projeto que apareceu nos encontros 3 e 4: um serviço acadêmico
reduzido — oferta de vagas → candidatos aprovados → matrícula — com banco populado,
chamados fictícios de um GLPI simulado e os MCPs já configurados.

O zip traz o repositório **com o histórico git dentro**. É de propósito: cada etapa
da construção virou um branch, e você pode saltar entre elas.

```bash
unzip demo-ia.zip
cd demo-ia
git status          # deve estar limpo, no branch inicial
./start.sh
```

Espere `Started DemoApplication` e abra <http://localhost:8080>.

> O cabeçalho do `start.sh` ainda diz `./subir.sh` — é resquício do nome antigo.
> O script é esse mesmo. `./start.sh --q` pula o build do frontend.

## Antes de começar

- **Docker, Java 21 e Node 20+.** O `start.sh` confere a versão do Java e avisa se
  estiver errada.
- **Windows:** o arquivo `.kiro/settings/mcp.json` é um link simbólico para o
  `.mcp.json` da raiz. Se o seu descompactador não criar links, copie o `.mcp.json`
  para dentro de `.kiro/settings/` com o nome `mcp.json`.
- **Entre uma execução e outra**, recrie o banco. Processar uma oferta altera os
  dados e a segunda rodada encontra a oferta já encerrada:

  ```bash
  docker compose down -v && docker compose up -d
  ```

## Os branches

```
inicial ──► main ──► f01-requirements ─► f01-design ─► f01-tasks ─► f01-implementation-done
   │                                                                         │
   ├─ feature/1234-test                                                      ▼
   └─ feature/3456                                        f02-requirements ─► f02-design
                                                               ─► f02-tasks ─► f02-implementation-done
```

| Branch | O que é |
| --- | --- |
| `inicial` | A aplicação como ela estava antes de qualquer IA tocar nela. **É onde você começa** — os labs 5 e 7 partem daqui. |
| `feature/1234-test` | Um endpoint de listagem de candidatos, gerado por agente durante o encontro 3. |
| `feature/3456` | O mesmo endpoint por outro caminho, com ajuste na skill de descrição de merge request. Serve para comparar duas saídas do agente para um pedido parecido. |
| `main` | `inicial` mais a skill `pull-request-description` e uma correção de performance com testes. **Contém a resposta do diagnóstico do Lab 5** — não abra antes de tentar. |
| `f01-requirements` → `f01-design` → `f01-tasks` → `f01-implementation-done` | O ciclo SDD completo da primeira spec (`candidatos-aprovados-sem-matricula`), uma fase por branch. |
| `f02-requirements` → `f02-design` → `f02-tasks` → `f02-implementation-done` | O segundo ciclo (`matricula-automatica-chamada`, a partir do chamado 1290), com o `tasks.meta.json` de rastreabilidade. |

## Como saltar entre as fases

```bash
git checkout inicial                    # ponto de partida
git checkout f01-requirements           # só o requirements.md escrito
git checkout f01-design                 # requirements + design
git checkout f01-tasks                  # + a quebra em tasks
git checkout f01-implementation-done    # + o código das tasks executadas
git checkout f02-implementation-done    # o ciclo completo, para comparar com o seu
```

Os artefatos de cada fase ficam em `.kiro/specs/<nome-da-spec>/`:

```bash
git checkout f02-tasks
ls .kiro/specs/matricula-automatica-chamada/
# requirements.md  design.md  tasks.md  .config.kiro
```

Para ver o que **uma fase** acrescentou, compare com a anterior:

```bash
git diff f01-design f01-tasks
git diff f01-tasks f01-implementation-done -- backend/
```

## Se você mexeu e quer voltar

O repositório é seu, então trabalhe à vontade — crie branches, commite, quebre
tudo. Para voltar ao ponto de partida:

```bash
git checkout inicial
git reset --hard
docker compose down -v && docker compose up -d
```

Se a árvore estiver muito bagunçada, apague a pasta e descompacte o zip de novo.

## Se der errado

**O agente não lista nenhum servidor MCP.**
Reinicie a ferramenta — os servidores são carregados na inicialização. Confirme
que você abriu o agente **na pasta do projeto**, não na pasta acima.

**O MCP do Postgres falha ao conectar.**
O banco está de pé? (`docker compose ps`). A porta é **55432**, não 5432 —
proposital, para não brigar com um Postgres já instalado na sua máquina. A
string de conexão está no `.mcp.json`, na raiz.

**`./start.sh` falha no build do frontend.**
Rode `cd frontend && npm install` primeiro. Se já tinha rodado e quebrou, apague
`node_modules` e instale de novo.

**A aplicação sobe mas a tela fica vazia.**
O backend responde? `curl http://localhost:8080/api/v1/cursos`. Se responder e a
tela não, o frontend não foi compilado: `cd frontend && npx ng build`.

**Processei uma oferta e quero o banco do jeito que estava.**

```bash
docker compose down -v && docker compose up -d
```

## O GLPI simulado

Os chamados ficam em `infra/glpi-mock/chamados.json` e são servidos por um servidor
MCP local (`infra/glpi-mock/server.py`) — nenhuma conexão externa, nada de VPN. O
agente lê os chamados pelo MCP, do mesmo jeito que leria de um GLPI de verdade.

Você pode abrir o arquivo e ler os chamados direto. Só saiba que, ao fazer isso,
você está resolvendo à mão uma parte do exercício que era para o agente resolver.
