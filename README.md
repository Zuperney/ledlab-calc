# 💡 LedLab Configurator Pro

Sistema profissional de configuração e cálculo de painéis LED para projetos de videowall.

![Version](https://img.shields.io/badge/version-7.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Architecture](https://img.shields.io/badge/architecture-ESM%20Modules-green)

## 🎯 Funcionalidades

### 📺 Multi-Telas
- Gerencie múltiplas configurações de telas no mesmo projeto
- Alterne entre telas com persistência automática de dados
- Interface sidebar intuitiva com resumo global

### 🧮 Cálculos Inteligentes
- **4 modos de cálculo**: Manual, Horizontal, Vertical e Melhor Área
- Limite seguro de 655.360 pixels por porta
- Modo Overclock com alertas visuais
- Visualização em canvas com numeração de blocos

### 🔌 Cabeamento Inteligente
- **Z-Type (Horizontal)**: Cabeamento em serpentina horizontal
- **U-Type (Vertical)**: Cabeamento em serpentina vertical
- Visualização instantânea das rotas de cabeamento

### 📊 Estatísticas Físicas
- Cálculo automático de peso total
- Consumo elétrico e estimativa de amperes
- Resumo consolidado de todas as telas do projeto

### 📦 Banco de Gabinetes
- Cadastro completo de gabinetes LED
- Campos técnicos: pixels, dimensões, peso, consumo
- Seleção rápida e carregamento automático

### 📄 Relatório Profissional
- Geração de relatório printer-friendly
- Exportação para PDF
- Inclui todos os layouts e estatísticas
- Layout A4 otimizado para impressão

## 🚀 Como Usar

### Online (GitHub Pages)
Acesse: `https://[seu-usuario].github.io/led-lab_calc/`

### Local
1. Clone o repositório:
```bash
git clone https://github.com/[seu-usuario]/led-lab_calc.git
```

2. Abra o `index.html` em qualquer navegador moderno

Não requer instalação ou servidor - funciona 100% no cliente!

## 📖 Guia Rápido

1. **Cadastre seus gabinetes** na aba "Gabinetes"
2. **Crie telas** no Configurador usando o botão "➕ Adicionar Tela"
3. **Selecione um gabinete** e defina a quantidade (horizontal × vertical)
4. **Escolha o tipo de cabeamento** (Z-Type ou U-Type)
5. **Clique em "Calcular"** para ver todas as opções
6. **Gere o relatório** com o botão "📝 Gerar Relatório"

## 🎨 Temas

- **Modo Claro**: Design Material Design 3 com paleta ouro/marrom
- **Modo Escuro**: Interface elegante para trabalho noturno
- Alternância instantânea via botão na navbar

## 🛠️ Tecnologias

- HTML5 Canvas para visualização
- JavaScript ES6+ modular (ESM) - 100% client-side
- CSS3 com Material Design 3
- LocalStorage para persistência
- Zero dependências externas

### Arquitetura (v7.0)

```
js/modules/
├── state.js              # Gerenciamento central de estado
├── calculations.js       # Lógica de cálculos de layout
├── canvas.js            # Renderização visual
├── storage.js           # Persistência localStorage
├── gabinetes.js         # Model e validação de gabinetes
├── gabinete-system.js   # CRUD de gabinetes
├── screens.js           # Gerenciamento de telas
├── ui.js                # Bindings de inputs e navegação
├── theme.js             # Gestão de temas dark/light
└── reports.js           # Geração de relatórios PDF
```

**Mudança Major v6.2 → v7.0**: Refatoração completa de monolith para arquitetura modular ESM
- 10+ módulos independentes com responsabilidades claras
- 100% event listener based (zero onclick inline)
- Código limpo e otimizado para manutenção

## 📋 Roadmap Implementado

- ✅ Fase 1: Arquitetura Multi-Telas
- ✅ Fase 2: Dados Físicos e Estatísticas
- ✅ Fase 3: Visualização de Cabeamento
- ✅ Fase 4: Exportação e Relatórios
- ✅ **v7.0**: Modularização completa em ESM
  - Fase 1-4: State, Calculations, Canvas, Storage, Gabinetes, Screens, UI
  - Fase 5-7: Theme, Gabinete System, Reports
  - Refactor: Event listeners 100%, code cleanup, imports optimization

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se livre para:
- Reportar bugs
- Sugerir novas funcionalidades
- Enviar pull requests

## 📄 Licença

MIT License - veja LICENSE para detalhes

## 👤 Autor

Desenvolvido para profissionais da indústria LED

---

**💡 LedLab Configurator Pro** - Configuração profissional de painéis LED
