# Lab 7 — O ciclo SDD nos branches do repositório de demonstração

As duas funcionalidades construídas no **Módulo 7**, uma fase por branch. Dá
para ler cada documento como ele estava no momento em que foi gerado, antes de
existir o código.

## Rodar

```bash
unzip ../demo-ia/demo-ia.zip
cd demo-ia
git checkout inicial && ./start.sh
```

Cada `git checkout` de fase troca só os arquivos. **O banco não volta junto** —
se você já processou uma oferta, recrie antes de rodar de novo:

```bash
docker compose down -v && docker compose up -d
```

Detalhes em [demo-ia/BRANCHES.md](../demo-ia/BRANCHES.md).

## As duas specs

| | Pasta em `.kiro/specs/` | O que faz |
| --- | --- | --- |
| F01 | `candidatos-aprovados-sem-matricula` | Aba que lista quem foi aprovado numa oferta publicada e ainda não tem matrícula. Só lê. |
| F02 | `matricula-automatica-chamada` | Matricula todos os aprovados não desistentes numa transação única e encerra a oferta. Grava, e o botão mora dentro da aba da F01. |

O requisito da F02 não foi escrito à mão: saiu do chamado 1290, no mesmo GLPI
simulado do Módulo 5.

## Uma fase por branch

| Branch | O que existe na pasta da spec |
| --- | --- |
| `f01-requirements` | `requirements.md` |
| `f01-design` | `+ design.md` |
| `f01-tasks` | `+ tasks.md` |
| `f01-implementation-done` | `+ tasks.meta.json`, e o código das tarefas executadas |
| `f02-requirements` | `requirements.md` da F02, sobre a F01 completa |
| `f02-design` | `+ design.md` |
| `f02-tasks` | `+ tasks.md` |
| `f02-implementation-done` | `+ tasks.meta.json`, e a feature funcionando |

Para ver o que **uma fase** acrescentou:

```bash
git diff f01-design f01-tasks
git diff f01-tasks f01-implementation-done -- backend/
```

## O que conferir em cada fase

Os cinco achados abaixo são reais e estão nos branches. São o motivo de a fase
de revisão existir.

### Requirements — a spec contradiz a si mesma

```bash
git checkout f01-requirements
grep -n '\*\*\*' .kiro/specs/candidatos-aprovados-sem-matricula/requirements.md
```

O requisito 2 pede o CPF mascarado como `***.NNN.NNN-**`, mantendo os dígitos do
meio. O requisito 4, na mesma spec, pede `***.***.***-**`, escondendo tudo. Cada
requisito foi gerado olhando para o próprio contexto. Passar batido custaria um
bug de LGPD alguns meses depois.

### Requirements — o glossário decidiu sozinho

```bash
grep -n -A1 'PendenteDeChamada' .kiro/specs/candidatos-aprovados-sem-matricula/requirements.md
```

A definição diz: *não existe `Matricula` com a mesma `(id_candidato,
id_chamada)`*. Matrícula **cancelada** ficou de fora — então quem cancelou
continua contando como matriculado e some do painel. Pode até estar certo, mas é
decisão de negócio, e ninguém decidiu: foi herdada de um método de repositório
que já existia.

### Design — o que foi descartado não está escrito

```bash
git checkout f01-design
grep -ic 'por que' .kiro/specs/candidatos-aprovados-sem-matricula/design.md   # 1
git checkout f02-design
grep -ic 'por que' .kiro/specs/matricula-automatica-chamada/design.md          # 0
```

Sete seções geradas de um pedido só — Overview, Architecture com diagrama,
Components and Interfaces, Data Models, Correctness Properties, Error Handling e
Testing Strategy — e uma ocorrência de "por que" no primeiro design, nenhuma no
segundo. Ele registrou o que decidiu, não o que rejeitou nem por quê.

`Correctness Properties` é a seção que vale conhecer: propriedades numeradas,
cada uma declarando qual requisito valida.

### Tasks — a suíte inteira veio opcional

```bash
git checkout f01-tasks
grep -n '^\s*- \[ \]\*' .kiro/specs/candidatos-aprovados-sem-matricula/tasks.md
```

Sete tarefas com asterisco: 3.2, 3.3, 3.4, 4.2, 4.3, 4.4 e 6.4. E no fim do
arquivo, na seção `Notes`, o que o asterisco significa: *"tarefas marcadas com
asterisco são opcionais e podem ser puladas para um MVP mais rápido"*. Todas as
sete são testes. Aceitar sem ler entrega a feature sem um teste.

Na mesma passada vale ver as outras duas convenções: a linha `_Requirements: ..._`
no fim de cada subtarefa, que é a rastreabilidade de volta ao critério de
aceite, e o `Task Dependency Graph` no fim do arquivo, que agrupa as tarefas em
ondas antes de existir uma linha de código.

### Execute — a spec da F01 envelheceu enquanto a F02 era construída

Este é o achado que fecha o módulo. As duas features nunca se chamam, mas
precisam concordar sobre o que significa estar matriculado.

```bash
git checkout f02-design
grep -n 'Modificações em artefatos existentes' .kiro/specs/matricula-automatica-chamada/design.md
```

O design da F02 tem uma tabela que o da F01 não tem, porque a F02 mexe em código
alheio: para funcionar, ela precisa acrescentar um campo `idOferta` ao
`PendenteResumo`, à consulta e ao serviço da primeira feature.

Agora compare os dois lados:

```bash
git show f01-requirements:.kiro/specs/candidatos-aprovados-sem-matricula/requirements.md | sed -n '46p'
git show f02-implementation-done:backend/src/main/java/br/edu/ifsc/demo/pendente/PendenteResumo.java
```

O requisito 2 da F01 lista **seis** campos na resposta da API. O código, depois
da F02, tem **sete**. A spec da primeira envelheceu em quarenta minutos, e nada
avisou — porque o Kiro não liga uma pasta de spec na outra. Não existe grafo de
dependência entre specs: se ninguém aponta, ninguém confere.

## Ver a feature funcionando

```bash
git checkout f02-implementation-done
docker compose down -v && docker compose up -d
./start.sh
```

Abra <http://localhost:8080>, entre na aba **Pendentes de Chamada** e clique no
botão de processar. A lista zera e recarrega sozinha, a oferta sai de
`publicada` para `encerrada`, tudo numa transação. A tela escrita primeiro é o
que verifica a rotina escrita depois — sem abrir o banco uma vez.
