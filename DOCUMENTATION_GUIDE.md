# 📚 LedLab Configurator Pro - Guia Técnico (v7.0)

## Visão Geral da Arquitetura

LedLab v7.0 é uma arquitetura completamente modularizada em **ES6 Modules (ESM)**, eliminando dependências externas e oferecendo máxima performance client-side.

```
Single Entry Point: script.js
        ↓
    10+ ESM Modules
        ↓
    100% Event Listener Based
```

---

## 📁 Estrutura de Módulos

### Core State Management
#### `js/modules/state.js`
Gerencia todo o estado centralizado da aplicação.

**Exports:**
- `currentProject` - Objeto com screens[] e activeScreenIndex
- `addScreen(name)` - Cria nova tela
- `setActiveScreen(index)` - Define tela ativa
- `getActiveScreen()` - Retorna tela ativa
- `loadScreenToUI(index)` - Carrega dados na interface

**Exemplo:**
```javascript
import { currentProject, addScreen, setActiveScreen } from "./state.js";

addScreen("Tela 2");
setActiveScreen(1);
```

---

### Cálculos e Visualização
#### `js/modules/calculations.js`
Lógica principal de cálculos de layout e limites de pixel.

**Exports:**
- `calcularTudo()` - Executa todos os 4 modos de cálculo
- `atualizarManual()` - Atualiza modo manual específico
- `updatePhysicalStats()` - Recalcula peso/consumo
- `calculatePhysicalStats()` - Retorna stats atuais
- `getCor(modo)` - Retorna cor do modo de cálculo

**Constantes:**
- `MAX_PIXELS_PORTA: 655360` - Limite máximo de pixels

---

#### `js/modules/canvas.js`
Renderização visual dos layouts em canvas HTML.

**Exports:**
- `desenharMapeamento()` - Renderiza layout escolhido
- `gerarLegenda()` - Cria legenda de cores

**Dependências:**
- `state.js` - Para dados de tela ativa
- `calculations.js` - Para cores e validações

---

### Persistência de Dados
#### `js/modules/storage.js`
CRUD de gabinetes em localStorage.

**Exports:**
- `getGabinetes()` - Array de todos gabinetes
- `saveGabinete(obj)` - Salva novo gabinete
- `updateGabinete(id, obj)` - Atualiza existente
- `deleteGabinete(id)` - Remove gabinete
- `getGabineteById(id)` - Busca por ID
- `clearAllGabinetes()` - Limpa storage

**Storage Key:**
```javascript
"ledlab-gabinetes" // localStorage key
```

---

#### `js/modules/gabinetes.js`
Model e validação de gabinetes LED.

**Exports:**
- `createGabinete(...)` - Factory com validação
- `validateGabinete(obj)` - Valida dados
- `formatGabineteDisplay(obj)` - Formato para UI
- `getPixelPitch(obj)` - Calcula pitch em pixels
- `filterGabinetesByAmbiente(arr, tipo)` - Filtra por tipo

**Estrutura:**
```javascript
{
  id: number,
  fabricante: string,
  nome: string,
  pixel_w: number,
  pixel_h: number,
  mm_w: number,
  mm_h: number,
  peso: number,
  consumo: number,
  ambiente: "indoor|outdoor",
  pixel_pitch: string,
  nits: number,
  refresh_rate: number,
  ip_rating: string
}
```

---

### Sistema de Gabinetes
#### `js/modules/gabinete-system.js`
CRUD completo com delegação de eventos e validação.

**Exports:**
- `initGabineteSystem()` - Setup inicial
- `deleteGabinete(id)` - Remove e atualiza UI
- `loadGabineteToConfigurator(id)` - Carrega em form

**Features:**
- Event delegation para botões Usar/Excluir
- Confirmação de exclusão
- Auto-load de dados físicos (peso/consumo)

---

### UI e Navegação
#### `js/modules/screens.js`
Gerenciamento de telas na sidebar e resumo global.

**Exports:**
- `renderScreenList()` - Renderiza lista de telas
- `initScreensUI(reportCallback)` - Setup botões
- `updateGlobalSummary()` - Atualiza totalizadores

**Eventos Customizados:**
```javascript
new CustomEvent('layoutTypeChanged', { detail: { layoutType: 'horizontal|vertical' } })
```

---

#### `js/modules/ui.js`
Bindings de inputs, navegação e temas.

**Exports:**
- `initTabs()` - Setup de abas (Manual, Largura, etc)
- `initNavigation()` - Setup páginas (Configurador, Gabinetes, etc)
- `initInputPersistence(callback)` - Auto-save em state

**Auto-save Fields:**
- pixelX, pixelY
- cabinetX, cabinetY
- cablingType (dispara `layoutTypeChanged`)
- gabineteSalvo (dispara `gabineteSalvoChanged`)
- overclockMode (executa `calcularTudo()`)

---

#### `js/modules/theme.js`
Gestão de temas dark/light com persistência.

**Exports:**
- `initTheme()` - Setup inicial (detecção de preferência)
- `applyTheme(theme)` - Aplica "light" ou "dark"

**Storage Key:**
```javascript
"ledlab-theme"
```

---

### Relatórios
#### `js/modules/reports.js`
Geração de relatório PDF printer-friendly.

**Exports:**
- `generateProjectReport()` - Abre nova janela com relatório

**Features:**
- Captura de canvas (toDataURL)
- Layout A4 otimizado
- Print via Ctrl+P ou botão
- Inclui todas as telas do projeto

---

## 🔄 Fluxo de Dados

```
User Input (event listener)
       ↓
Handler em módulo específico
       ↓
Update state.js (currentProject)
       ↓
Trigger calcularTudo() ou outra função
       ↓
Renderizar canvas/UI via module correspondente
```

### Exemplo: Adicionar Tela
1. Usuário clica "➕ Adicionar Tela"
2. `screens.js` dispara `addScreen()`
3. `state.js` atualiza `currentProject.screens`
4. `renderScreenList()` re-renderiza sidebar
5. Tela ativa é loaded na UI via `loadScreenToUI()`

---

## ⚡ Padrões de Desenvolvimento

### Event Listeners (NOT onclick)
```javascript
// ❌ ERRADO
<button onclick="deleteGabinete(5)">Deletar</button>

// ✅ CORRETO
container.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-delete')) {
        const id = parseInt(e.target.dataset.gabinetId);
        deleteGabinete(id);
    }
});
```

### Custom Events
```javascript
document.dispatchEvent(
    new CustomEvent('layoutTypeChanged', { 
        detail: { layoutType: 'horizontal' } 
    })
);

document.addEventListener('layoutTypeChanged', (e) => {
    console.log(e.detail.layoutType);
});
```

### Module Import Pattern
```javascript
// Apenas o necessário
import { getActiveScreen } from './state.js';
import { updatePhysicalStats } from './calculations.js';

// Nunca: import * as state from './state.js'
```

---

## 🧪 Testing & Debugging

### Console Limpo
- Todos os `console.log` de debug foram removidos
- Apenas `console.error` é usado para erros críticos
- Acesso ao estado global: `window.currentProject`

### LocalStorage
```javascript
// Verificar dados salvos
localStorage.getItem('ledlab-gabinetes')  // Gabinetes
localStorage.getItem('ledlab-theme')      // Tema

// Limpar tudo
localStorage.clear()
```

### DevTools Canvas
```javascript
// Acessar canvas
document.getElementById('canvas-largura')
document.getElementById('canvas-altura')
document.getElementById('canvas-area')
document.getElementById('canvas-manual')
```

---

## 📋 Checklist para Novos Módulos

1. **Criar arquivo em `js/modules/nome.js`**
2. **Definir responsabilidade única**
3. **Usar imports absolutos: `./` somente**
4. **Exportar apenas funções públicas**
5. **Sem `window.` pollution**
6. **Event listeners, não onclick**
7. **Adicionar imports em `script.js`**
8. **Testar isoladamente**

---

## 🚀 Performance

- **Zero frameworks**: Pure JS com 0 overhead
- **Single module entry**: Todos imports centralizados
- **Event delegation**: Mínimo número de listeners
- **LocalStorage**: Cache local, sem requests
- **Canvas rendering**: GPU accelerated

---

## 🔐 Segurança

- **Input validation**: Todos os inputs em `gabinetes.js`
- **No eval()**: Jamais usado
- **XSS prevention**: Template strings puras
- **CSRF protection**: Não aplicável (client-side)
- **Sanitization**: HTML values escapados

---

## 📞 Suporte

Para dúvidas sobre a arquitetura, consulte:
- `script.js` - Entry point e orchestration
- `js/modules/*` - Cada módulo é independente e documentado
- Issues no GitHub

---

**v7.0 - Complete ESM Modularization**
Última atualização: 2026-01-11
