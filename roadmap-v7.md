# 🗺️ LedLab Configurator Pro - Roadmap v7.0
## Sistema Profissional de Cálculo de LED para Eventos

---

## 📋 **VISÃO GERAL**

Este roadmap expande o LedLab para um sistema profissional completo, focando em:
- Gestão avançada de equipamentos (MTRL, VX, MCTRL)
- Relatórios técnicos detalhados
- Cálculos de materiais e custos
- Sistema de usuários e persistência em servidor
- Configurações personalizáveis avançadas

**Status Atual:** v6.2 - Multi-telas, Cabeamento, Estatísticas, Mobile

---

## 🎯 **FASE 5: Sistema de Equipamentos e Portas**

### **5.1. Cadastro de Equipamentos (JSON/LocalStorage)**
**Objetivo:** Criar banco de dados de equipamentos com especificações

**Equipamentos a cadastrar:**
```json
{
  "equipments": [
    { "id": "free", "name": "Modo Livre", "ports": 20, "maxPixels": 655360, "color": "#666666" },
    { "id": "mtrl600", "name": "MTRL600", "ports": 4, "maxPixels": 655360, "color": "#FF6B6B" },
    { "id": "vx1000", "name": "VX1000", "ports": 10, "maxPixels": 655360, "color": "#4ECDC4" },
    { "id": "mctrl4k", "name": "MCTRL4K", "ports": 16, "maxPixels": 655360, "color": "#45B7D1" },
    { "id": "vx2000", "name": "VX2000", "ports": 20, "maxPixels": 655360, "color": "#96CEB4" }
  ]
}
```

**Tarefas:**
- [ ] Criar arquivo `equipments.json` com especificações
- [ ] Função `loadEquipments()` para carregar lista
- [ ] Estrutura de dados em `currentProject.equipment`

**Critério de Aceite:** Console mostra array de equipamentos disponíveis

---

### **5.2. UI de Seleção de Equipamento**
**Objetivo:** Adicionar select de equipamento no configurador

**Tarefas:**
- [ ] Select `#equipmentSelect` no HTML antes do botão calcular
- [ ] Opções: "Modo Livre (20 portas)" + lista de equipamentos
- [ ] Persistir equipamento selecionado por tela
- [ ] Visual: Mostrar ícone + nome + portas disponíveis

**Layout sugerido:**
```html
<div class="input-item full-width">
  <label>🎛️ Equipamento de Controle</label>
  <select id="equipmentSelect">
    <option value="free">Modo Livre (20 portas)</option>
    <option value="mtrl600">MTRL600 (4 portas)</option>
    <!-- ... -->
  </select>
  <small class="equipment-info">Máx: 655.360 pixels por porta</small>
</div>
```

**Critério de Aceite:** Select aparece e salva valor no objeto da tela ativa

---

### **5.3. Recálculo com Base em Equipamento**
**Objetivo:** Adaptar função `calcularTudo()` para usar portas do equipamento

**Mudanças na lógica:**
- [ ] Se "Modo Livre": usar 20 portas (comportamento atual)
- [ ] Se equipamento específico: usar portas do equipamento selecionado
- [ ] Calcular quantidade de equipamentos necessários
- [ ] Alertar se projeto excede capacidade (ex: 80 cabos em MTRL600 = 20 unidades)

**Fórmula:**
```javascript
const equipmentPorts = selectedEquipment.ports;
const totalCabos = cabosH + cabosV;
const equipmentCount = Math.ceil(totalCabos / equipmentPorts);
```

**Critério de Aceite:** Ao selecionar MTRL600 (4 portas), cálculo se adapta automaticamente

---

### **5.4. Coloração de Blocos por Equipamento**
**Objetivo:** Pintar canvas com cores diferentes para cada equipamento

**Tarefas:**
- [ ] Modificar `desenharMapeamento()` para agrupar cabos por equipamento
- [ ] Cabo 1-4: cor do equipamento 1
- [ ] Cabo 5-8: cor do equipamento 2
- [ ] Adicionar legenda no canvas: "Equipamento 1 (MTRL600) - Cabos 1-4"

**Visual:**
```
Canvas:
[■■■■] Vermelho - Equipamento 1 (Cabos 1-4)
[■■■■] Azul    - Equipamento 2 (Cabos 5-8)
[■■■■] Verde   - Equipamento 3 (Cabos 9-12)
```

**Critério de Aceite:** Canvas mostra blocos coloridos por equipamento com legenda

---

### **5.5. Numeração Inteligente de Portas**
**Objetivo:** Mostrar número da porta dentro de cada bloco

**Tarefas:**
- [ ] Desenhar número da porta (1-4, 1-10, 1-16, etc) no badge do canvas
- [ ] Formato: "Porta 3" ou "P3" para economia de espaço
- [ ] Resetar numeração ao trocar de equipamento

**Critério de Aceite:** Cada bloco mostra qual porta do equipamento está usando

---

## 📊 **FASE 6: Relatório Profissional Avançado**

### **6.1. Expansão de Dados no Relatório**
**Objetivo:** Adicionar informações técnicas completas

**Novos campos a exibir:**
- [ ] **Resolução Final:** `${totalPixelsW} x ${totalPixelsH}` (ex: 2304 x 3072)
- [ ] **Aspect Ratio:** 16:9, 4:3, 21:9, Custom
- [ ] **Tensão Selecionada:** 220V ou 380V
- [ ] **Equipamento Utilizado:** Nome + quantidade de unidades
- [ ] **Distribuição de Portas:** "Equipamento 1: Portas 1-4, Equipamento 2: Portas 1-4..."
- [ ] **Frequência Real:** Hz calculados (ex: 3840 Hz)
- [ ] **Modo Overclock:** Ativo/Inativo

**Layout sugerido:**
```
┌─────────────────────────────────────┐
│ ESPECIFICAÇÕES TÉCNICAS             │
├─────────────────────────────────────┤
│ Resolução: 2304 x 3072 pixels       │
│ Aspect Ratio: 3:4 (Custom)          │
│ Tensão: 220V                        │
│ Equipamento: 5x MTRL600 (20 portas) │
│ Frequência: 3840 Hz                 │
│ Overclock: Ativo (Capacidade Extra) │
└─────────────────────────────────────┘
```

**Critério de Aceite:** Relatório mostra todos os novos campos

---

### **6.2. Seletor de Tensão (220V / 380V)**
**Objetivo:** Permitir escolha de tensão e recalcular amperes

**Tarefas:**
- [ ] Adicionar radio buttons ou toggle no configurador
- [ ] Default: 220V (comportamento atual)
- [ ] Recalcular amperes: `corrente = potencia / tensao`
- [ ] Salvar tensão por tela em `currentProject.screens[].voltagem`

**UI sugerida:**
```html
<div class="input-item">
  <label>⚡ Tensão de Alimentação</label>
  <div class="voltage-toggle">
    <input type="radio" name="voltage" value="220" checked> 220V
    <input type="radio" name="voltage" value="380"> 380V
  </div>
</div>
```

**Critério de Aceite:** Trocar de 220V para 380V recalcula amperes corretamente

---

### **6.3. Lista de Materiais (BOM - Bill of Materials)**
**Objetivo:** Gerar lista completa de materiais necessários

**Itens a calcular:**
- [ ] **Gabinetes LED:** Quantidade total (já temos)
- [ ] **Cabos de Sinal:** 
  - Quantidade = Total de cabos (H + V)
  - Comprimento estimado (baseado em distância entre gabinetes)
- [ ] **Cabos de Energia:**
  - Quantidade = Total de gabinetes
  - Bitola sugerida (baseada em amperes)
- [ ] **Mainpower:**
  - Quantidade de fontes necessárias
  - Capacidade por fonte (ex: 200A, 300A)
  - Modelo sugerido
- [ ] **Equipamentos de Controle:**
  - Quantidade calculada na Fase 5
  - Modelo selecionado

**Layout da tabela:**
```
┌────────────────────┬──────────┬────────────┬──────────┐
│ Material           │ Quant.   │ Especif.   │ Obs.     │
├────────────────────┼──────────┼────────────┼──────────┤
│ Gabinete LED       │ 240 un   │ P3.91      │ -        │
│ Cabo de Sinal      │ 24 un    │ RJ45 CAT6  │ 10m cada │
│ Cabo de Energia    │ 240 un   │ 3x2.5mm²   │ 5m cada  │
│ Mainpower          │ 3 un     │ 300A       │ 380V     │
│ Equipamento        │ 5 un     │ MTRL600    │ 4 portas │
└────────────────────┴──────────┴────────────┴──────────┘
```

**Critério de Aceite:** Relatório exibe tabela completa de materiais

---

### **6.4. Calculadora de Mainpower**
**Objetivo:** Calcular fontes necessárias e alertar sobre tensão

**Tarefas:**
- [ ] Input: Capacidade da fonte (ex: 200A, 300A)
- [ ] Calcular: `qtdFontes = Math.ceil(amperesTotal / capacidadeFonte)`
- [ ] Alertas automáticos:
  - ⚠️ "Atenção: Com 380V, a corrente será menor mas exige mainpower trifásico"
  - ⚠️ "Para 220V, recomendamos mainpower bifásico ou monofásico"
  - ⚠️ "Consumo total excede 500A - considere fontes redundantes"

**UI:**
```html
<div class="mainpower-calculator">
  <h4>🔌 Cálculo de Mainpower</h4>
  <label>Capacidade da Fonte (A)</label>
  <select id="powerSupplyCapacity">
    <option value="200">200A</option>
    <option value="300">300A</option>
    <option value="500">500A</option>
  </select>
  <div class="result-box">
    <strong>Necessário:</strong> 3x Mainpower 300A
  </div>
</div>
```

**Critério de Aceite:** Sistema calcula fontes e exibe alertas conforme tensão

---

### **6.5. Melhorias de PDF/Impressão**
**Objetivo:** Relatório profissional pronto para clientes

**Tarefas:**
- [ ] Adicionar logo/branding no cabeçalho
- [ ] Rodapé com data de geração e número de página
- [ ] Quebras de página inteligentes (uma tela por página)
- [ ] CSS otimizado para A4 landscape (quando tem canvas grande)
- [ ] Botão "Baixar PDF" (usar `html2pdf.js` ou `jsPDF`)
- [ ] Opção de incluir/excluir lista de materiais
- [ ] Watermark opcional: "Orçamento" / "Projeto Final"

**Critério de Aceite:** PDF gerado é profissional e pronto para enviar ao cliente

---

## ⚙️ **FASE 7: Configurações Avançadas**

### **7.1. Menu de Configurações Global**
**Objetivo:** Centralizar todas as configurações do sistema

**Tarefas:**
- [ ] Botão "⚙️ Configurações" na navbar
- [ ] Modal ou página dedicada com abas:
  - **Visuais:** Cores personalizadas
  - **Cálculos:** Parâmetros de overclock
  - **Equipamentos:** Gerenciar cadastros
  - **Relatórios:** Template e formato
  - **Avançado:** Limites e alertas

**Critério de Aceite:** Modal de configurações abre e mostra abas

---

### **7.2. Cores Personalizáveis por Usuário**
**Objetivo:** Permitir customização das cores de gabinetes e equipamentos

**Tarefas:**
- [ ] Na aba "Visuais": Color pickers para:
  - Cor padrão de gabinetes
  - Cor de alerta (overclock)
  - Cores por equipamento (MTRL, VX, MCTRL)
- [ ] Salvar em `localStorage` como `userPreferences.colors`
- [ ] Aplicar cores ao canvas e relatório

**UI:**
```html
<div class="color-settings">
  <h4>🎨 Personalizar Cores</h4>
  <label>Gabinetes Normais:</label>
  <input type="color" id="colorNormal" value="#4CAF50">
  
  <label>Gabinetes Overclock:</label>
  <input type="color" id="colorOverclock" value="#FF9800">
  
  <label>MTRL600:</label>
  <input type="color" id="colorMTRL" value="#FF6B6B">
</div>
```

**Critério de Aceite:** Mudar cores atualiza canvas e relatório instantaneamente

---

### **7.3. Configuração de Overclock/Frequência**
**Objetivo:** Controle fino sobre modo overclock

**Opções:**
- [ ] **Modo Desativado:** Math.floor sempre (comportamento seguro)
- [ ] **Modo Arredondar:** Math.ceil (comportamento atual)
- [ ] **Modo Frequência Customizada:** 
  - Input manual de Hz desejados (ex: 3600, 3840, 4200)
  - Calcular gabinetes necessários para atingir frequência
  - Alerta se exceder capacidade da porta

**UI:**
```html
<div class="overclock-settings">
  <h4>⚡ Modo Overclock</h4>
  <input type="radio" name="oc" value="off"> Desativado (Seguro)
  <input type="radio" name="oc" value="ceil"> Arredondar p/ Cima
  <input type="radio" name="oc" value="custom"> Frequência Manual
  
  <div id="customFreqInput" style="display:none">
    <label>Frequência Desejada (Hz):</label>
    <input type="number" value="3840" step="1">
  </div>
</div>
```

**Critério de Aceite:** Sistema calcula corretamente em cada modo

---

### **7.4. Gerenciamento de Equipamentos**
**Objetivo:** CRUD de equipamentos pelo usuário

**Tarefas:**
- [ ] Tabela com equipamentos cadastrados
- [ ] Botões: Adicionar, Editar, Excluir
- [ ] Form: Nome, Portas, Pixels/Porta, Cor
- [ ] Salvar em `localStorage.customEquipments`
- [ ] Mesclar com equipamentos padrão

**Critério de Aceite:** Usuário adiciona "NovaCard2024 (12 portas)" e aparece no select

---

## 📚 **FASE 8: Aba de Informações e Tutoriais**

### **8.1. Sistema de Info/Ajuda**
**Objetivo:** Educar usuários sobre cálculos e melhores práticas

**Tarefas:**
- [ ] Nova página/modal: "ℹ️ Central de Ajuda"
- [ ] Seções:
  - **Como Funciona a Tensão**
  - **Cálculo de Frequência Explicado**
  - **Qual Equipamento Usar** (guia de seleção)
  - **Boas Práticas de Cabeamento**
  - **FAQ**

**Conteúdo sugerido:**
```markdown
### 📖 Como Funciona a Tensão

**220V (Monofásico/Bifásico):**
- Mais comum em locais menores
- Corrente mais alta (mais cabos grossos)
- Ideal para projetos até 50kW

**380V (Trifásico):**
- Usado em grandes eventos
- Corrente menor (economia em cabos)
- Requer mainpower trifásico
- Ideal para projetos acima de 50kW

### 🧮 Cálculo de Frequência

Fórmula: Hz = 655.360 / (pixelW × pixelH)

Quanto maior a resolução do gabinete, menor a frequência.
Gabinetes P3 (192x192) = 17.8 Hz por unidade.
```

**Critério de Aceite:** Página acessível e conteúdo legível

---

### **8.2. Recomendação Inteligente de Equipamento**
**Objetivo:** Sugerir melhor equipamento para o projeto

**Lógica:**
- [ ] Se total_cabos <= 4: Sugerir MTRL600
- [ ] Se total_cabos <= 10: Sugerir VX1000
- [ ] Se total_cabos <= 16: Sugerir MCTRL4K
- [ ] Se total_cabos <= 20: Sugerir VX2000
- [ ] Se total_cabos > 20: Sugerir múltiplos equipamentos

**UI:**
```html
<div class="recommendation-box">
  <h4>💡 Recomendação do Sistema</h4>
  <p>Para este projeto (14 cabos), recomendamos:</p>
  <strong>1x MCTRL4K (16 portas)</strong>
  <p>Sobrando 2 portas para expansão futura.</p>
</div>
```

**Critério de Aceite:** Sistema sugere equipamento ideal após cálculo

---

## 👤 **FASE 9: Sistema de Usuários e Cloud Sync**

### **9.1. Página de Cadastro/Login**
**Objetivo:** Criar autenticação básica

**Tarefas:**
- [ ] Página `login.html` com formulário
- [ ] Campos: Email, Senha, Nome (cadastro)
- [ ] CSS para página de login profissional
- [ ] Validação básica de formulário

**Tecnologias sugeridas:**
- Firebase Authentication (mais simples)
- Supabase (open source)
- Backend custom (Node.js + Express)

**Critério de Aceite:** Usuário consegue criar conta e fazer login

---

### **9.2. Backend e Banco de Dados**
**Objetivo:** Armazenar projetos em servidor

**Estrutura de dados:**
```json
{
  "users": [
    {
      "id": "user123",
      "email": "usuario@example.com",
      "name": "João Silva",
      "created_at": "2026-01-11"
    }
  ],
  "projects": [
    {
      "id": "proj456",
      "user_id": "user123",
      "name": "Show Rock in Rio",
      "created_at": "2026-01-11",
      "data": { /* currentProject completo */ }
    }
  ]
}
```

**Tarefas:**
- [ ] Configurar Firebase Firestore ou Supabase
- [ ] API: POST /projects (criar)
- [ ] API: GET /projects?user_id=X (listar)
- [ ] API: PUT /projects/:id (atualizar)
- [ ] API: DELETE /projects/:id (excluir)

**Critério de Aceite:** Projeto salvo no servidor persiste após logout

---

### **9.3. Sincronização Automática**
**Objetivo:** Salvar projetos automaticamente na nuvem

**Tarefas:**
- [ ] Detectar mudanças em `currentProject`
- [ ] Debounce de 2 segundos (evitar salvar a cada tecla)
- [ ] Indicador visual: "💾 Salvando..." → "✅ Salvo"
- [ ] Botão manual: "☁️ Sincronizar Agora"
- [ ] Conflito: Se projeto foi editado em outro dispositivo, alertar

**Critério de Aceite:** Editar projeto no PC, abrir no celular, ver mudanças

---

### **9.4. Galeria de Projetos do Usuário**
**Objetivo:** Listar todos os projetos do usuário

**Tarefas:**
- [ ] Nova página: "Meus Projetos"
- [ ] Grid de cards com:
  - Nome do projeto
  - Data de criação
  - Thumbnail (mini-canvas)
  - Resumo: X telas, Y gabinetes
- [ ] Botões: Abrir, Duplicar, Excluir
- [ ] Filtro/busca por nome

**Critério de Aceite:** Usuário vê lista de todos os projetos salvos

---

## 🚀 **FASE 10: Funcionalidades Extras e Polish**

### **10.1. Exportar/Importar Projeto (JSON)**
**Objetivo:** Backup local e compartilhamento

**Tarefas:**
- [ ] Botão "💾 Exportar Projeto"
- [ ] Download de `projeto.ledlab.json`
- [ ] Botão "📂 Importar Projeto"
- [ ] Upload e validação de JSON
- [ ] Merge com dados atuais ou substituir

**Critério de Aceite:** Exportar projeto, deletar, importar, e recuperar tudo

---

### **10.2. QR Code para Compartilhar**
**Objetivo:** Compartilhar projetos facilmente

**Tarefas:**
- [ ] Gerar link único: `https://ledlab.app/p/abc123`
- [ ] Salvar projeto como público no servidor
- [ ] Gerar QR Code com biblioteca `qrcode.js`
- [ ] Visualização read-only para quem acessa o link

**Critério de Aceite:** Escanear QR Code abre projeto no celular

---

### **10.3. PWA (Progressive Web App)**
**Objetivo:** Funcionar offline e instalar como app

**Tarefas:**
- [ ] Criar `manifest.json`:
  ```json
  {
    "name": "LedLab Configurator Pro",
    "short_name": "LedLab",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#ffffff",
    "theme_color": "#0d6efd",
    "icons": [...]
  }
  ```
- [ ] Service Worker para cache offline
- [ ] Botão "Instalar App" no navegador

**Critério de Aceite:** Usuário instala app e funciona sem internet

---

### **10.4. Comparação Lado a Lado**
**Objetivo:** Comparar duas configurações

**Tarefas:**
- [ ] Modo "Split Screen" no configurador
- [ ] Mostrar duas telas simultaneamente
- [ ] Comparar: Resolução, Equipamentos, Custos
- [ ] Tabela comparativa

**Critério de Aceite:** Ver "Config A vs Config B" lado a lado

---

### **10.5. Histórico de Versões**
**Objetivo:** Reverter mudanças em projetos

**Tarefas:**
- [ ] Salvar snapshot a cada alteração significativa
- [ ] Lista: "Versão 1 (11/01 14:30)", "Versão 2 (11/01 15:45)"
- [ ] Botão "Restaurar Versão"
- [ ] Limite de 10 versões por projeto

**Critério de Aceite:** Usuário restaura versão anterior de um projeto

---

### **10.6. Temas Personalizados Completos**
**Objetivo:** Sistema de temas além de light/dark

**Tarefas:**
- [ ] Temas pré-definidos: "Ocean", "Forest", "Sunset", "Cyberpunk"
- [ ] Editor de tema customizado (todas as cores CSS variables)
- [ ] Exportar/importar temas
- [ ] Galeria de temas da comunidade

**Critério de Aceite:** Aplicar tema "Ocean" e interface muda completamente

---

### **10.7. Estimativa de Custo**
**Objetivo:** Calcular custo total do projeto

**Tarefas:**
- [ ] Cadastro de preços unitários:
  - Gabinete LED: R$ X
  - Cabo de sinal: R$ Y
  - Mainpower: R$ Z
- [ ] Calcular: `custoTotal = Σ(quantidade × preço)`
- [ ] Exibir no relatório
- [ ] Margem de lucro configurável (%)

**Critério de Aceite:** Relatório mostra "Custo Total Estimado: R$ 45.000"

---

### **10.8. Simulador de Consumo Mensal**
**Objetivo:** Calcular custo de energia se painel ficasse ligado

**Tarefas:**
- [ ] Input: Horas de uso por dia
- [ ] Input: Custo do kWh (R$/kWh)
- [ ] Calcular: `custoMensal = (consumoW / 1000) × horas × dias × custo`
- [ ] Exibir: "Consumo mensal: R$ 1.200"

**Critério de Aceite:** Usuário simula 8h/dia e vê custo mensal

---

### **10.9. Tutorial Interativo (Onboarding)**
**Objetivo:** Guiar novos usuários

**Tarefas:**
- [ ] Usar biblioteca `intro.js` ou `shepherd.js`
- [ ] Steps:
  1. "Bem-vindo ao LedLab!"
  2. "Selecione um gabinete aqui..."
  3. "Configure a quantidade..."
  4. "Clique em Calcular..."
  5. "Veja os resultados!"
- [ ] Checkbox "Não mostrar novamente"

**Critério de Aceite:** Novo usuário completa tutorial guiado

---

### **10.10. Notificações e Alertas Inteligentes**
**Objetivo:** Avisar sobre problemas e otimizações

**Exemplos de alertas:**
- 🔴 "Atenção: Consumo total excede 100A - verifique cabos de energia"
- 🟡 "Dica: Com 2 gabinetes a menos, você poderia usar um MTRL600 em vez de VX1000"
- 🟢 "Ótima configuração! Uso eficiente das portas."
- 🔵 "Lembrete: Verificar disponibilidade de MCTRL4K no estoque"

**Critério de Aceite:** Sistema exibe alertas contextuais relevantes

---

## 📦 **PRIORIZAÇÃO SUGERIDA**

### **🚨 ALTA PRIORIDADE (Implementar Primeiro):**
1. **FASE 5:** Sistema de Equipamentos (crítico para profissionalização)
2. **FASE 6.1-6.3:** Melhorias de Relatório (valor imediato)
3. **FASE 7.2:** Cores Personalizáveis (diferencial visual)
4. **FASE 8.1:** Aba de Info (reduz suporte)

### **⚡ MÉDIA PRIORIDADE (Implementar Depois):**
5. **FASE 6.4:** Calculadora Mainpower
6. **FASE 7.3:** Configuração Overclock Avançada
7. **FASE 10.1:** Exportar/Importar Projeto
8. **FASE 10.7:** Estimativa de Custo

### **💎 BAIXA PRIORIDADE (Features Premium):**
9. **FASE 9:** Sistema de Usuários (complexo, requer backend)
10. **FASE 10.3:** PWA
11. **FASE 10.6:** Temas Customizados Completos

---

## 📊 **ESTIMATIVA DE TEMPO**

| Fase | Complexidade | Tempo Estimado |
|------|--------------|----------------|
| Fase 5 | Média | 8-12 horas |
| Fase 6 | Média-Alta | 10-15 horas |
| Fase 7 | Média | 6-10 horas |
| Fase 8 | Baixa | 4-6 horas |
| Fase 9 | Alta | 20-30 horas |
| Fase 10 | Variável | 5-40 horas |

**Total estimado:** 53-113 horas (dependendo das features escolhidas)

---

## 🎯 **ROADMAP VISUAL**

```
v6.2 (Atual) ──┬──> v7.0: Equipamentos + Relatório Pro
               │
               ├──> v7.5: Configurações Avançadas + Tutoriais
               │
               ├──> v8.0: Sistema de Usuários + Cloud
               │
               └──> v9.0: Features Premium + PWA
```

---

## 📝 **NOTAS IMPORTANTES**

### **Backup Antes de Cada Fase:**
Sempre fazer commit Git antes de iniciar nova fase:
```bash
git add .
git commit -m "feat: Complete Phase X"
git tag v7.0
```

### **Testes Progressivos:**
Não avançar para próxima subfase sem testar completamente a anterior.

### **Documentação:**
Atualizar README.md ao concluir cada fase.

### **Performance:**
- Fase 9 pode requerer otimizações (lazy loading, pagination)
- Considerar Web Workers para cálculos pesados

---

## 🚀 **PRÓXIMO PASSO IMEDIATO**

**Começar por: FASE 5.1 - Cadastro de Equipamentos**

Prompt para implementar:
> "Crie um arquivo `equipments.json` na raiz do projeto com a estrutura de equipamentos (MTRL600, VX1000, MCTRL4K, VX2000). Adicione uma função `loadEquipments()` no `script.js` que carrega esses dados e os armazena em uma variável global `availableEquipments`. Teste no console digitando `availableEquipments`."

---

**Fim do Roadmap v7.0** 🎉
