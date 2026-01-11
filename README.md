# 💡 LedLab Configurator Pro

Sistema profissional de configuração e cálculo de painéis LED para projetos de videowall. Interface responsiva mobile-first com suporte completo para dispositivos móveis.

![Version](https://img.shields.io/badge/version-6.2-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Responsive](https://img.shields.io/badge/responsive-mobile--first-purple)
![Status](https://img.shields.io/badge/status-production-success)

## 🎯 Funcionalidades

### � Design Responsivo Mobile-First
- Interface totalmente adaptada para smartphones e tablets
- Sidebar colapsável com botão hamburguer flutuante
- Touch-friendly: botões otimizados para toque (44px mínimo)
- Canvas responsivo com scroll suave
- Tabs horizontais com scroll touch
- Previne zoom acidental em inputs iOS/Android

### 📺 Multi-Telas
- Gerencie múltiplas configurações de telas no mesmo projeto
- Alterne entre telas com persistência automática de dados
- Interface sidebar intuitiva com resumo global
- Sidebar mobile se fecha automaticamente ao selecionar tela

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

### 🌐 Online (GitHub Pages)
Acesse: **https://zuperney.github.io/ledlab-calc/**

### 📱 No Celular
1. Acesse o link acima no navegador mobile
2. Use o botão flutuante 📱 para abrir/fechar a sidebar
3. Arraste para navegar no canvas
4. Todos os recursos desktop disponíveis!

### 💻 Local (Desenvolvimento)
1. Clone o repositório:
```bash
git clone https://github.com/Zuperney/ledlab-calc.git
```

2. Abra o `index.html` em qualquer navegador moderno

3. Ou use Live Server para testar no celular:
   - Instale a extensão "Live Server" no VS Code
   - Clique com botão direito em `index.html` → "Open with Live Server"
   - No celular (mesma rede WiFi): acesse `http://SEU_IP:5500`

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

- **Frontend**: HTML5 Canvas para visualização
- **JavaScript**: ES6+ puro (sem frameworks ou dependências)
- **CSS3**: Material Design 3 + Mobile-first responsive design
- **Storage**: LocalStorage para persistência offline
- **Responsividade**: Media queries mobile, tablet, desktop e landscape
- **PWA Ready**: Preparado para Progressive Web App

## 📱 Suporte de Dispositivos

| Dispositivo | Resolução | Status |
|-------------|-----------|--------|
| 📱 iPhone 12/13/14 | 390x844 | ✅ Otimizado |
| 📱 Samsung Galaxy | 360x800 | ✅ Otimizado |
| 📱 Android Genérico | 360-480px | ✅ Otimizado |
| 📱 Tablets | 768-1024px | ✅ Otimizado |
| 💻 Desktop | 1024px+ | ✅ Otimizado |
| 🔄 Landscape Mobile | 768px landscape | ✅ Otimizado |

## 📋 Roadmap Implementado

### ✅ Versão 6.2 (Atual)
- ✅ **Fase 1**: Arquitetura Multi-Telas com sidebar navegável
- ✅ **Fase 2**: Dados Físicos e Estatísticas (peso, consumo, amperes)
- ✅ **Fase 3**: Visualização de Cabeamento (Z-Type/U-Type)
- ✅ **Fase 4**: Exportação e Relatórios printer-friendly
- ✅ **Extra**: Design Responsivo Mobile-First completo

### 🔜 Versão 7.0 (Roadmap)
Veja o roadmap completo em [roadmap-v7.md](roadmap-v7.md):
- 🎛️ **Sistema de Equipamentos**: MTRL600, VX1000, MCTRL4K, VX2000
- 📊 **Relatório Profissional Avançado**: Resolução, tensão, lista de materiais
- ⚙️ **Configurações Avançadas**: Cores customizadas, overclock personalizado
- 📚 **Central de Ajuda**: Tutoriais e guias integrados
- 👤 **Sistema de Usuários**: Login, cloud sync, galeria de projetos
- 🚀 **Features Premium**: PWA, QR Code, estimativa de custos

## 🗂️ Estrutura de Arquivos

```
led-lab_calc/
├── index.html              # Página principal do configurador
├── cadastro.html           # Página de cadastro de gabinetes
├── style.css               # Estilos desktop e base
├── mobile.css              # Estilos responsivos mobile-first
├── script.js               # Lógica principal (~1000 linhas)
├── roadmap.md              # Roadmap original (v6.0)
├── roadmap-v7.md           # Roadmap futuro (v7.0+)
├── .gitignore              # Exclusões do Git
├── LICENSE                 # Licença MIT
└── temas/
    └── material-theme/
        └── css/            # Temas light/dark MD3
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se livre para:
- 🐛 Reportar bugs
- 💡 Sugerir novas funcionalidades
- 🔧 Enviar pull requests
- 📱 Testar em diferentes dispositivos
- 📖 Melhorar documentação

### Como Contribuir:
1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m "feat: Adiciona nova funcionalidade"`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## 📄 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes

## 🔗 Links Úteis

- **Demo Online**: https://zuperney.github.io/ledlab-calc/
- **Repositório**: https://github.com/Zuperney/ledlab-calc
- **Issues**: https://github.com/Zuperney/ledlab-calc/issues
- **Roadmap v7.0**: [roadmap-v7.md](roadmap-v7.md)

## 👤 Autor

**Zuperney**
- GitHub: [@Zuperney](https://github.com/Zuperney)

Desenvolvido para profissionais da indústria LED

---

⭐ **Se este projeto foi útil, considere dar uma estrela no GitHub!**

---

**💡 LedLab Configurator Pro** - Configuração profissional de painéis LED
