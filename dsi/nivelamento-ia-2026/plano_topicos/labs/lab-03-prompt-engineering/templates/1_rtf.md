# RTF — Role / Task / Format

| Sigla  | Em português |
|--------|--------------|
| **R**ole   | Papel        |
| **T**ask   | Tarefa       |
| **F**ormat | Formato      |

**Quando usar:** Tarefas que usam conhecimento amplamente conhecido — padrões de mercado, frameworks
populares, boas práticas consolidadas — onde o modelo já tem o contexto necessário sem que você
precise explicar. Funciona bem para geração de código com tecnologias conhecidas (Spring Boot, JPA,
REST), análise de erros comuns e respostas que precisam de estrutura fixa (JSON, lista, tabela).
Não é a escolha certa quando o problema envolve regras de negócio específicas do seu sistema —
nesses casos, use CARE ou RISE para trazer o contexto que o modelo não tem.

---

## Formato do prompt

```
Role:   [quem o modelo deve ser — especialidade, senioridade, domínio]

Task:   [o que exatamente deve ser feito — verbo de ação claro]

Format: [como a resposta deve ser estruturada — lista, JSON, tabela, código, etc.]
```

---

## Exemplo — implementação de endpoint REST com Spring Boot

```
Role:   Você é um desenvolvedor Java sênior especializado em Spring Boot 3.2 e boas
        práticas de API REST.

Task:   Crie um endpoint POST /api/produtos que receba um ProdutoRequest, valide os
        campos obrigatórios, persista via JPA e retorne HTTP 201 com o ProdutoResponse.

Format: Responda com o código Java completo das classes necessárias (controller, service,
        repository, DTOs). Use records para os DTOs, Bean Validation para as validações
        e inclua um @ControllerAdvice para tratar erros de validação com HTTP 400.
```
