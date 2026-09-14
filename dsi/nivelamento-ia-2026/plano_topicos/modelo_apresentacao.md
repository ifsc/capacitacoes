# Modelo de Apresentação — Excalidraw

## Grid de Slides (4 por página: 2 colunas × N linhas)

```
┌──────────────────┐  ┌──────────────────┐
│  SLIDE ÍMPAR     │  │  SLIDE PAR       │
│  (coluna esq)    │  │  (coluna dir)    │
│  x=20            │  │  x=1100          │
└──────────────────┘  └──────────────────┘
│  altura 620px       │  altura 620px
│  largura 960px      │  largura 960px
         ↓ arraste horizontal
┌──────────────────┐  ┌──────────────────┐
│  PRÓXIMA LINHA   │  │  PRÓXIMA LINHA   │
│  y += 700         │  │  y += 700        │
└──────────────────┘  └──────────────────┘
         ↓ arraste vertical
```

## Dimensões

| Elemento | Valor |
|----------|-------|
| Slide (fundo) | 960×620 px |
| Gap entre colunas | 120 px (20→1100) |
| Gap entre linhas | 700 px (y += 700) |
| Margem interna | 40 px das bordas |
| Coluna de conteúdo esq | x=40, largura máxima 450 |
| Coluna de conteúdo dir | x=510, largura máxima 470 |

## Cores do Tema

| Uso | Background | Borda |
|-----|-----------|-------|
| Fundo do slide | `#f8f9fa` | `#dee2e6` |
| Lado "ruim/negativo" | `#fff5f5` | `#ffc9c9` |
| Lado "bom/positivo" | `#f0fff4` | `#b2f2bb` |
| Bloco Role | `#e7f5ff` | `#4c6ef5` |
| Bloco Contexto | `#e8f5e9` | `#40c057` |
| Bloco Tarefa | `#fff4e6` | `#fd7e14` |
| Bloco Output | `#f3f0ff` | `#7950f2` |
| Cards neutros | `#ffffff` | `#adb5bd` |
| Texto principal | `#1e1e1e` | — |
| Texto secundário | `#868e96` | — |
| Títulos de seção | cor da borda do bloco | — |

## Tipografia

| Elemento | fontSize |
|----------|----------|
| Título do slide | 26–28 |
| Subtítulo | 14–15 |
| Título de seção | 20 |
| Título de card | 15 |
| Corpo de card | 12–13 |
| Label "SLIDE N" | 12 |
| Dica de navegação | 13–14 |

## Estrutura de Cada Slide

1. **Fundo**: `rectangle` 960×620 com `backgroundColor: #f8f9fa`, `strokeColor: #dee2e6`
2. **Título**: `text` fontSize 26–28, posição (60, y+20)
3. **Subtítulo**: `text` fontSize 14–15, `strokeColor: #868e96`, posição (60, y+58)
4. **Conteúdo**: Dividido em 2 colunas (cards comparativos) ou 2×2 grid (4 cards)
5. **Label**: `text` "SLIDE N" fontSize 12, `strokeColor: #868e96`, centralizado abaixo do slide
6. **Navegação**: Seta + texto indicando direção (horizontal ou vertical)

## Padrões de Conteúdo

### Comparação (2 colunas)
- Coluna esquerda: conceito A (ex: "Sem Estrutura", "Zero-shot")
- Coluna direita: conceito B (ex: "Com Estrutura", "Few-shot")
- Cada coluna: fundo colorido + 2 cards brancos com exemplos
- Seta entre colunas indicando evolução

### Grid de Cards (2×2)
- 4 cards de 440×235 px
- Cada card com cor de borda diferente (azul, verde, laranja, roxo)
- Título dentro do card + corpo com exemplos

## Script de Exportação (Python)

Após criar elementos via MCP, sempre rodar script que adiciona defaults:

```python
for el in elements:
    el.setdefault('angle', 0)
    el.setdefault('opacity', 100)
    el.setdefault('roundness', None)
    el.setdefault('boundElements', None)
    el.setdefault('groupIds', [])
    el.setdefault('frameId', None)
    el.setdefault('isDeleted', False)
    el.setdefault('locked', False)
    el.setdefault('seed', 1)
    el.setdefault('versionNonce', 1)
    el.setdefault('updated', 1)
    el.setdefault('fillStyle', 'solid')
    el.setdefault('roughness', 0)
    
    if el['type'] == 'text':
        el.setdefault('fontFamily', 2)  # Helvetica
        el.setdefault('textAlign', 'left')
        el.setdefault('verticalAlign', 'top')
        el.setdefault('autoResize', True)
        el.setdefault('lineHeight', 1.25)
        if 'strokeColor' not in el:
            el['strokeColor'] = '#1e1e1e'
        # Calcular dimensões
        lines = el['text'].split('\n')
        fs = el.get('fontSize', 16)
        el['width'] = round(max(max(len(l) for l in lines) * fs * 0.58, 60))
        el['height'] = round(len(lines) * fs * 1.35)
    
    elif el['type'] == 'arrow':
        el.setdefault('startArrowhead', 'arrow')
        el.setdefault('endArrowhead', 'arrow')
        el.setdefault('points', [[0, 0], [el.get('width', 0), el.get('height', 0)]])
```

## Script de Validação de Layout (Python)

**Rodar SEMPRE após exportar.** Detecta texto vazando de container e overlap entre elementos:

```python
import json

with open('excalidraw/prompts-engenharia.excalidraw') as f:
    data = json.load(f)

by_id = {el['id']: el for el in data['elements']}

# Para cada texto dentro de um container visual, verificar se cabe
pares = [
    # (label, container_id, text_id)
    # Exemplo: ("Few-shot card", "mrcgXXX_box", "mrcgXXX_text"),
]

for label, box_id, text_id in pares:
    box = by_id[box_id]
    text = by_id[text_id]
    overflow = (text['y'] + text['height']) - (box['y'] + box['height'])
    if overflow > 0:
        print(f"❌ {label}: texto vaza {overflow}px do container")
    else:
        print(f"✅ {label}: OK ({-overflow}px de margem)")

# Verificar overlap entre textos consecutivos
vizinhos = [
    # (label, top_element_id, bottom_element_id)
]

for label, top_id, bottom_id in vizinhos:
    top = by_id[top_id]
    bottom = by_id[bottom_id]
    gap = bottom['y'] - (top['y'] + top['height'])
    if gap < 0:
        print(f"❌ {label}: overlap de {-gap}px")
    else:
        print(f"✅ {label}: {gap}px de folga")
```

## Checklist Antes de Entregar

- [ ] Todos elementos têm `width` e `height` calculados
- [ ] **Cada** texto dentro de container: `texto.y + texto.height < container.y + container.height`
- [ ] Textos consecutivos não se sobrepõem: `texto_de_baixo.y > texto_de_cima.y + texto_de_cima.height`
- [ ] Fundo da seção cobre todos os elementos internos
- [ ] Script de validação rodou e não reportou `❌`
- [ ] `appState` inclui `scrollX`, `scrollY`, `zoom`, `activeTool`
- [ ] Arquivo validado abrindo em [excalidraw.com](https://excalidraw.com)
- [ ] Slides alinhados no grid (colunas x=20/1100, linhas com gap de 700)
