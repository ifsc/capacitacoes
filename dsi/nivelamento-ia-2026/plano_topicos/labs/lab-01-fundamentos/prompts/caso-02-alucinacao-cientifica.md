# Caso 3 — Alucinação em Trabalho Científico

> **Pré-requisito 1:** dentro da pasta `work/`, crie uma subpasta com o seu
> login institucional em slug (ex: `work/joao.silva/`) e rode o OpenCode a
> partir dela (`mkdir -p work/<seu-login> && cd work/<seu-login> && opencode`).
> Isso evita arquivos soltos gerados pelo agente na pasta do lab.
>
> **Pré-requisito 2:** troque o modelo no OpenCode para **Nemotron 3 Ultra
> (free, OpenCode Zen)** com `/models`. Um modelo menor e gratuito torna
> essa limitação mais fácil de reproduzir.

## Prompt para rodar no OpenCode

```
Escreva um texto de 2 parágrafos sobre os impactos da inteligência artificial
generativa na produtividade de desenvolvedores de software, para um trabalho
acadêmico. Siga as normas ABNT, incluindo citação de autor no corpo do texto
(sistema autor-data) e a referência bibliográfica completa ao final.
```

## O que fazer

1. Rode o prompt exatamente como está.
2. Leia o texto gerado. Ele vai parecer bem escrito, no formato ABNT correto,
   com citação tipo `(SOBRENOME, ano)` e uma referência completa ao final.
3. Copie o texto completo gerado (incluindo a lista de referências) e cole no
   **Gemini** (gemini.google.com), pedindo para ele verificar se cada
   referência bibliográfica existe de fato — o Gemini tem acesso a busca e
   consegue confirmar isso. Sugestão de prompt para colar lá:
   ```
   Verifique cada referência bibliográfica do texto abaixo. Para cada uma,
   diga se ela existe de fato (autor, obra, ano, editora/revista) ou se é
   uma referência inventada. Me dê o resultado em uma tabela: referência |
   existe (sim/não) | observação.

   [cole aqui o texto gerado no caso 1, com as referências]
   ```
4. Anote o resultado: quantas referências o modelo gerou no total, quantas
   existem de fato e quantas são inventadas.
5. Preencha a ficha de diagnóstico:
   - Qual limitação apareceu?
   - Qual evidência prova que é alucinação (resultado da conferência no
     Gemini: total gerado x total real x total inventado)?
   - Reescreva o prompt para mitigar o problema.

> **Nota para o instrutor:** esse é o exemplo clássico citado na teoria do
> Módulo 1 — "a IA não sabe que não sabe". Pedir citação bibliográfica sem
> fornecer fontes reais praticamente força o modelo a inventar um autor e uma
> obra plausíveis, porque ele foi treinado a sempre entregar uma resposta
> completa em vez de admitir que não tem uma fonte real à mão.

## Dica para a reescrita

Alucinação de citação se mitiga de duas formas: pedindo que o modelo só cite
fontes que ele tenha certeza de que existem (e admita quando não tiver), ou
fornecendo você mesmo as fontes reais para ele usar. Por exemplo:

```
Escreva um texto de 2 parágrafos sobre os impactos da inteligência artificial
generativa na produtividade de desenvolvedores de software, para um trabalho
acadêmico. Siga as normas ABNT. NÃO invente nomes de autores, obras ou anos.
Se você não tiver certeza de uma fonte real para citar, escreva o texto sem
citação e me avise que a citação precisa ser adicionada manualmente com uma
fonte verificada.
```

## Pergunta de discussão

Por que pedir uma citação bibliográfica é um "convite" tão forte para a
alucinação? (Gancho: o modelo aprendeu o FORMATO de uma citação ABNT
perfeitamente — autor, ano, editora — mas formato correto não significa
conteúdo real. É a alucinação de fidelidade/factual em ação: confiança na
forma, vazio no conteúdo.)
