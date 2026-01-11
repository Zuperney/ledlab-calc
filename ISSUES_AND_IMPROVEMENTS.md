# 🐛 Issues & Improvements - LED Lab Calc v7.0

**Data**: 11 de Janeiro de 2026  
**Status**: Aberto - Aguardando Priorização  
**Versão Atual**: v7.0 (Refatoração Modular)

---

## 📋 Resumo Executivo

Durante a refatoração do código para arquitetura modular (v7.0), foram identificadas **3 issues críticas** e várias melhorias necessárias. Este documento prioriza o trabalho para as próximas sprints.

---

## 🔴 Issues Críticas (Alta Prioridade)

### Issue #1: Perda de Estilos nos Botões de Navegação

**Severidade**: 🔴 **Alta**  
**Status**: 🔴 **Aberto**  
**Afeta**: Experiência do usuário  
**Módulo**: `src/styles/nav.css` + `src/js/modules/ui.js`

#### Descrição
Os botões de navegação de abas (Configurador/Gabinetes) perderam seus estilos e comportamentos após a refatoração. O indicador visual de aba ativa não funciona corretamente no modo side-by-side.

#### Comportamento Esperado
- ✅ Dois botões lado a lado na navbar
- ✅ Indicador visual (barra inferior animada) mostrando qual aba está ativa
- ✅ Transição suave entre abas
- ✅ Estados hover/active com cores corretas

#### Comportamento Atual
- ❌ Estilos CSS não estão sendo aplicados corretamente
- ❌ Indicador não acompanha a navegação
- ❌ Botões sem feedback visual
- ❌ pagina ao ser carregada mostra um alerta de Prencha todos os campos 

#### Passos para Reproduzir
1. Abrir aplicação em http://localhost:8000
2. Clicar nos botões "Configurador" e "Gabinetes"
3. Observar falta de estilos

#### Solução Proposta
1. Revisar `src/styles/nav.css` - verificar seletores CSS
2. Revisar `src/js/modules/ui.js` - função `initNavigation()`
3. Validar sincronização entre DOM e CSS
4. Testar em diferentes resoluções de tela

#### Checklist de Correção
- [ ] Revisar CSS do componente nav
- [ ] Verificar classes CSS aplicadas ao DOM
- [ ] Testar animação do indicador
- [ ] Validar em mobile (< 768px)
- [ ] Validar em tablet (768px - 1024px)
- [ ] Validar em desktop (> 1024px)

---

### Issue #2: Card de Telas com Legibilidade Comprometida

**Severidade**: 🔴 **Alta**  
**Status**: 🔴 **Aberto**  
**Afeta**: Usabilidade  
**Módulo**: `src/styles/layout.css` + `index.html`

#### Descrição
A sidebar com lista de telas está em local de difícil leitura e com layout inadequado. Especialmente em:
- Resoluções mobile (< 768px)
- Quando há múltiplas telas no projeto

#### Problemas Identificados
- ❌ Texto muito pequeno em mobile
- ❌ Cards de telas mal alinhados
- ❌ Difícil localizar tela ativa
- ❌ Nenhuma distinção visual clara entre telas
- ❌ Sem scrolling adequado
- ❌ Sem indicador de "ativa"

#### Solução Proposta

**Estratégia de Exibição Melhorada**:

```
DESKTOP (> 1024px):
└── Sidebar fixa à esquerda (250px)
    ├── Titulo "Telas"
    ├── Lista scrollável
    │   ├── [Tela 1] ← Ativa (destaque)
    │   ├── Tela 2
    │   ├── Tela 3
    │   └── Tela N
    ├── Divisor
    └── [+ Adicionar Tela]

TABLET (768px - 1024px):
└── Sidebar retrátil no topo
    ├── Dropdown/Accordion
    ├── Telas em cards horizontais

MOBILE (< 768px):
└── Bottom Sheet / Modal
    ├── Selector de telas em lista compacta
    ├── Cards maiores para facilitar toque
    ├── Swipe para fechar
```

#### Melhorias Específicas
1. **Indicador Visual Clara**
   - Ícone de checkmark ✓
   - Cor de fundo diferenciada
   - Borda destacada
   - Animação de seleção

2. **Responsividade**
   - Desktop: Sidebar fixa
   - Tablet: Sidebar retrátil
   - Mobile: Bottom sheet/modal

3. **Densidade de Informação**
   - Mostrar nome da tela
   - Mostrar dimensões (ex: 64x32)
   - Mostrar gabinetes (ex: 2x2)
   - Mostrar pixels totais

#### Exemplo de Card Melhorado
```
┌─────────────────────────────┐
│ ✓ Tela Principal            │ ← Ativa
│ 64×32px | 2×2 Gab | 4096px │
└─────────────────────────────┘
┌─────────────────────────────┐
│   Tela 2                    │
│ 32×16px | 1×1 Gab | 512px  │
└─────────────────────────────┘
```

#### Checklist de Correção
- [ ] Desenhar novo layout no Figma/papel
- [ ] Atualizar `src/styles/layout.css`
- [ ] Atualizar `src/js/modules/ui.js` - `renderScreenList()`
- [ ] Adicionar estilos responsivos
- [ ] Testar com 5+ telas
- [ ] Validar em todos os breakpoints
- [ ] Melhorar feedback visual de seleção

---

### Issue #3: Testes de Funcionalidades Incompletos

**Severidade**: 🔴 **Alta**  
**Status**: 🔴 **Aberto**  
**Afeta**: Qualidade  
**Módulo**: Todos

#### Descrição
A refatoração modular pode ter quebrado funcionalidades. Precisamos de testes 100% para garantir que nada parou de funcionar.

#### Funcionalidades a Testar

**1. Telas (Screens)**
- [ ] Criar nova tela
- [ ] Renomear tela
- [ ] Deletar tela
- [ ] Selecionar tela
- [ ] Salvar dados da tela
- [ ] Carregar dados da tela
- [ ] Listar todas as telas

**2. Cálculos**
- [ ] Modo Horizontal
- [ ] Modo Vertical
- [ ] Modo Best-Area
- [ ] Overclock mode ativo
- [ ] Overclock mode inativo
- [ ] Validação de inputs
- [ ] Cálculo de peso
- [ ] Cálculo de potência
- [ ] Cálculo de amperagem

**3. Canvas/Visualização**
- [ ] Desenhar mapeamento
- [ ] Tipos de cabeamento (Z/U)
- [ ] Legenda de cores
- [ ] Redimensionamento responsivo
- [ ] Zoom/Pan (se aplicável)

**4. Gabinetes**
- [ ] Criar gabinete
- [ ] Deletar gabinete
- [ ] Listar gabinetes
- [ ] Carregar dados de gabinete
- [ ] Salvar gabinete
- [ ] Dropdown de seleção

**5. Relatórios**
- [ ] Gerar relatório
- [ ] Visualizar modal
- [ ] Imprimir PDF
- [ ] Exportar JSON
- [ ] Importar JSON

**6. Temas**
- [ ] Alternar Light/Dark
- [ ] Carregar tema salvo
- [ ] Detectar preferência do sistema
- [ ] Light HC (High Contrast)
- [ ] Dark MC (Medium Contrast)

**7. Persistência (Storage)**
- [ ] Salvar projeto
- [ ] Carregar projeto
- [ ] Salvar gabinetes
- [ ] Carregar gabinetes
- [ ] Auto-save a cada 30s

**8. UI Geral**
- [ ] Navegação entre abas
- [ ] Menu mobile (hamburguer)
- [ ] Responsive em mobile
- [ ] Responsive em tablet
- [ ] Responsive em desktop
- [ ] Atalhos de teclado (Ctrl+S, Ctrl+T)

#### Matriz de Teste

| Funcionalidade | Desktop | Tablet | Mobile | Status |
|---|---|---|---|---|
| Criar Tela | ⚪ | ⚪ | ⚪ | ⏳ Pendente |
| Cálculos | ⚪ | ⚪ | ⚪ | ⏳ Pendente |
| Canvas | ⚪ | ⚪ | ⚪ | ⏳ Pendente |
| Gabinetes | ⚪ | ⚪ | ⚪ | ⏳ Pendente |
| Relatórios | ⚪ | ⚪ | ⚪ | ⏳ Pendente |
| Temas | ⚪ | ⚪ | ⚪ | ⏳ Pendente |
| Storage | ⚪ | ⚪ | ⚪ | ⏳ Pendente |
| Navegação | ⚪ | ⚪ | ⚪ | ⏳ Pendente |

**Legenda**: ⚪ = Não testado | ✅ = Passou | ❌ = Falhou

#### Checklist de Correção
- [ ] Criar plano de testes
- [ ] Executar testes manuais
- [ ] Documentar bugs encontrados
- [ ] Criar issues para cada bug
- [ ] Corrigir bugs críticos
- [ ] Validar todas as funcionalidades
- [ ] Criar test suite automatizado (futuro)

---

## 🟡 Issues de Média Prioridade

### Issue #4: Mobile Menu Comportamento

**Severidade**: 🟡 **Média**  
**Status**: 🔵 **Não Iniciado**  
**Módulo**: `src/js/modules/ui.js`

#### Problema
O menu mobile (hamburguer) pode não estar fechando corretamente ao selecionar tela.

#### Solução
- [ ] Validar função `initMobileMenu()`
- [ ] Testar em dispositivos reais
- [ ] Adicionar feedback visual

---

### Issue #5: Estilos Responsivos Inconsistentes

**Severidade**: 🟡 **Média**  
**Status**: 🔵 **Não Iniciado**  
**Módulo**: `src/styles/`

#### Problema
Breakpoints em `mobile.css` podem estar conflitando com `src/styles/main.css`.

#### Solução
- [ ] Revisar breakpoints
- [ ] Consolidar media queries
- [ ] Testar em 4+ resoluções

---

## 🟢 Melhorias Futuras (Baixa Prioridade)

### Sugestão #1: Indicador de Auto-Save

**Status**: 💡 Sugestão  
**Prioridade**: 🟢 Baixa  

Adicionar indicador visual de que o projeto foi salvo (ícone com tooltip).

---

### Sugestão #2: Dark Mode por Padrão

**Status**: 💡 Sugestão  
**Prioridade**: 🟢 Baixa  

Detectar preferência do sistema e aplicar automaticamente.

---

## 📊 Matriz de Priorização

```
        Alta Complexidade
              ↑
              │
    2 │       │
      │       │   Issue #1 ●●●
    1 │   S1  │   
      │       │   Issue #4 ●
    0 │───●──●────────────●─→ Alta Importância
      │   S2      Issue #3
```

---

## 🎯 Plano de Ação - Próximas Sprints

### Sprint 1: Critical Fixes (Estimado: 4-6h)
1. **Issue #1**: Corrigir navegação de abas
2. **Issue #3**: Executar testes 100%
3. Corrigir bugs críticos encontrados

**Entregáveis**:
- ✅ Navegação funcionando
- ✅ Todas funcionalidades core testadas
- ✅ Sem erros críticos no console

### Sprint 2: UX Improvements (Estimado: 3-4h)
1. **Issue #2**: Redesenhar cards de telas
2. Implementar nova estratégia de layout
3. Melhorar responsividade

**Entregáveis**:
- ✅ Nova UI para sidebar
- ✅ Melhor legibilidade
- ✅ Testado em 3 resoluções

### Sprint 3: Polish (Estimado: 2-3h)
1. **Issue #4 e #5**: Corrigir problemas médios
2. **Sugestões**: Implementar melhorias
3. Testes finais

**Entregáveis**:
- ✅ Aplicação estável
- ✅ Pronta para Phase 5

---

## 📝 Definições

**Severidade**:
- 🔴 **Alta**: Bloqueia uso da aplicação
- 🟡 **Média**: Degradação de UX
- 🟢 **Baixa**: Nice-to-have

**Status**:
- 🔴 **Aberto**: Não iniciado
- 🟡 **Em Progresso**: Trabalho em andamento
- 🟢 **Resolvido**: Concluído e testado
- 🔵 **Não Iniciado**: Planejado mas não começado
- ⚫ **Bloqueado**: Aguarda outra issue

---

## 🔗 Arquivos Relacionados

- [index.html](index.html) - HTML principal
- [src/styles/nav.css](src/styles/nav.css) - Estilos de navegação
- [src/styles/layout.css](src/styles/layout.css) - Sistema de layout
- [src/js/modules/ui.js](src/js/modules/ui.js) - Lógica de UI
- [src/js/modules/theme.js](src/js/modules/theme.js) - Sistema de temas
- [README.md](README.md) - Documentação geral

---

## ✅ Checklist Geral

- [ ] Todos os issues documentados
- [ ] Priorização definida
- [ ] Plano de ação criado
- [ ] Responsáveis atribuídos (futuro)
- [ ] Datas de conclusão estimadas
- [ ] Este documento revisado antes de próximas mudanças

---

**Última Atualização**: 11 de Janeiro de 2026  
**Próxima Revisão**: Após conclusão do Sprint 1

---

> 💡 **Nota**: Este documento deve ser atualizado regularmente conforme issues são resolvidas. Use como referência para as próximas sessões de desenvolvimento.
