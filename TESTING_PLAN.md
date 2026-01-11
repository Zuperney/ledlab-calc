# 🧪 Plano de Testes - LED Lab Calc v7.0

**Data**: 11 de Janeiro de 2026  
**Versão**: v7.0 (Refatoração Modular)  
**Objetivo**: Validar 100% das funcionalidades após refatoração

---

## 📋 Quick Start

### Como Executar os Testes

1. **Iniciar servidor local**:
```bash
cd c:\Users\neymo\Desktop\led-lab_calc
python -m http.server 8000
```

2. **Abrir navegador**: http://localhost:8000

3. **Abrir DevTools**: F12 (verificar console para erros)

4. **Seguir checklist abaixo**

---

## 🖥️ Teste 1: Carregamento da Aplicação

### Pré-requisitos
- [ ] Servidor rodando em http://localhost:8000
- [ ] Navegador atualizado (Chrome/Firefox/Safari)
- [ ] DevTools aberto

### Passos
1. Abrir http://localhost:8000
2. Aguardar carregamento completo
3. Verificar console (F12) - não deve haver erros vermelhos

### Esperado
- ✅ Página carrega sem erros
- ✅ Navbar visível no topo
- ✅ Tema (Light ou Dark) aplicado
- ✅ Botões "Configurador" e "Gabinetes" visíveis
- ✅ Canvas visível
- ✅ Sidebar com telas à esquerda (desktop)
- ✅ Nenhum erro no console

### Resultado: ⚪ Não Testado | ✅ Passou | ❌ Falhou

---

## 📺 Teste 2: Navegação de Abas

### Pré-requisitos
- [ ] Aplicação carregada
- [ ] Em resolução desktop (> 1024px)

### Passos

#### A. Botões de Navegação
1. Clicar no botão "Configurador"
2. Verificar se é destacado visualmente
3. Clicar no botão "Gabinetes"
4. Verificar se "Gabinetes" é destacado
5. Clicar em "Configurador" novamente

#### B. Indicador Visual
1. Observar barra animada abaixo dos botões
2. Verificar se acompanha a navegação
3. Verificar animação suave (0.3s ease)

#### C. Conteúdo das Abas
1. Em "Configurador" deve ver canvas e controles
2. Em "Gabinetes" deve ver formulário e lista

### Esperado
- ✅ Botões mudam de cor quando clicados
- ✅ Indicador se move suavemente
- ✅ Conteúdo das abas troca corretamente
- ✅ Nenhuma sobreposição de conteúdo
- ✅ Sem lag na animação

### Resultado: ⚪ | ✅ | ❌

---

## ⚙️ Teste 3: Gerenciamento de Telas

### Pré-requisitos
- [ ] Aplicação carregada
- [ ] Em "Configurador"

### Passos

#### A. Criar Tela
1. Clicar em "+ Adicionar Tela" (na sidebar)
2. Verificar se nova tela aparece na lista
3. Verificar se é automaticamente selecionada

#### B. Selecionar Tela
1. Ter 2+ telas criadas
2. Clicar em cada tela na lista
3. Verificar se é destacada visualmente
4. Verificar se canvas atualiza

#### C. Deletar Tela
1. Ter 2+ telas criadas
2. Clicar no X ao lado de uma tela
3. Confirmar deleção
4. Verificar se é removida da lista
5. Tentar deletar última tela - deve avisar

#### D. Visualização de Telas
1. Verificar se cada tela mostra:
   - Nome
   - (Se melhorado) Dimensões
   - (Se melhorado) Gabinetes
   - (Se melhorado) Total de pixels

### Esperado
- ✅ Tela criada com sucesso
- ✅ Tela selecionada é destacada
- ✅ Canvas atualiza ao trocar tela
- ✅ Tela deletada com confirmação
- ✅ Última tela não pode ser deletada
- ✅ Informações visíveis claramente

### Resultado: ⚪ | ✅ | ❌

---

## 🧮 Teste 4: Cálculos

### Pré-requisitos
- [ ] Aplicação carregada
- [ ] 1+ tela criada
- [ ] Inputs acessíveis

### Passos

#### A. Inputs Básicos
1. Preencher: Pixel X = 64
2. Preencher: Pixel Y = 32
3. Preencher: Cabinet X = 2
4. Preencher: Cabinet Y = 2
5. Verificar se canvas atualiza automaticamente

#### B. Modos de Layout
1. Selecionar "Horizontal"
   - Verificar mapeamento em canvas
   - Observar resultado de cabos
2. Selecionar "Vertical"
   - Verificar diferença no canvas
3. Selecionar "Best-Area"
   - Verificar se escolhe o melhor layout

#### C. Overclock Mode
1. Desmarcar overclock (se marcado)
   - Verificar mudança nos valores
2. Marcar overclock
   - Verificar se valores aumentam
   - Verificar aviso/info visível

#### D. Validação de Inputs
1. Deixar campos vazios
   - Deve avisar ou não calcular
2. Entrar valores inválidos (texto, negativos)
   - Deve rejeitar ou ignorar
3. Valores muito altos (999999)
   - Deve calcular ou avisar de limite

### Esperado
- ✅ Canvas atualiza ao mudar inputs
- ✅ 3 modos de layout funcionam
- ✅ Overclock altera resultados
- ✅ Inputs são validados
- ✅ Cálculos estão corretos
- ✅ Sem erros no console

### Resultado: ⚪ | ✅ | ❌

---

## 📊 Teste 5: Canvas e Visualização

### Pré-requisitos
- [ ] Aplicação carregada
- [ ] Tela configurada com valores

### Passos

#### A. Renderização
1. Verificar se canvas renderiza
2. Verificar se mostra grid de pixels
3. Verificar cores diferentes (se houver categorias)

#### B. Legenda
1. Verificar se legenda abaixo do canvas
2. Verificar se mostra cores
3. Verificar se mostra contagem por cor

#### C. Responsividade
1. Em desktop: canvas grande
2. Redimensionar janela
3. Em tablet (768px): canvas adapta
4. Em mobile (480px): canvas adapta

#### D. Cabeamento
1. Verificar tipo Z (horizontal snake)
2. Verificar tipo U (vertical snake)
3. Verificar se linhas são desenhadas corretamente

### Esperado
- ✅ Canvas renderiza corretamente
- ✅ Grid é visível
- ✅ Cores são diferenciadas
- ✅ Legenda mostra informações
- ✅ Canvas é responsivo
- ✅ Cabeamento desenhado corretamente

### Resultado: ⚪ | ✅ | ❌

---

## 📦 Teste 6: Gabinetes

### Pré-requisitos
- [ ] Em aba "Gabinetes"

### Passos

#### A. Criar Gabinete
1. Preencher nome: "Gabinete 1"
2. Preencher potência: 500W
3. Preencher amperes/porta: 10A
4. Preencher peso vazio: 5kg
5. Preencher peso LED: 2kg
6. Clicar "Salvar"
7. Verificar se aparece na lista

#### B. Listar Gabinetes
1. Criar 3 gabinetes
2. Verificar se todos aparecem na lista
3. Verificar se dados estão corretos

#### C. Deletar Gabinete
1. Clicar no botão delete de um gabinete
2. Confirmar
3. Verificar se é removido

#### D. Usar Gabinete no Configurador
1. Ir para aba "Configurador"
2. Na tela, selecionar um gabinete criado
3. Verificar se dados carregam
4. Verificar se cálculos atualizam

### Esperado
- ✅ Gabinete criado e salvo
- ✅ Lista mostra todos os gabinetes
- ✅ Dados exibidos corretamente
- ✅ Delete funciona
- ✅ Seleção carrega dados
- ✅ Cálculos usam dados do gabinete

### Resultado: ⚪ | ✅ | ❌

---

## 📄 Teste 7: Relatórios

### Pré-requisitos
- [ ] 1+ tela com dados configurados
- [ ] Clique em "Gerar Relatório"

### Passos

#### A. Modal de Relatório
1. Verificar se modal abre
2. Verificar se mostra título do projeto
3. Verificar se mostra data
4. Verificar se mostra resumo geral

#### B. Conteúdo do Relatório
1. Verificar se mostra total de pixels
2. Verificar se mostra total de cabos
3. Verificar se mostra peso
4. Verificar se mostra potência
5. Verificar se mostra amperagem

#### C. Tabela de Detalhes
1. Verificar se mostra cada tela
2. Verificar se mostra dimensões
3. Verificar se mostra valores por tela

#### D. Canvas no Relatório
1. Verificar se mostra canvas de cada tela
2. Verificar se renderização está correta

#### E. Exportação
1. Clicar em "Imprimir" (PDF)
2. Clicar em "Exportar" (JSON)
3. Verificar se descarrega arquivos

### Esperado
- ✅ Modal abre sem erros
- ✅ Relatório completo e legível
- ✅ Dados corretos e calculados
- ✅ Canvas renderiza no relatório
- ✅ Exportação funciona
- ✅ Arquivo baixa corretamente

### Resultado: ⚪ | ✅ | ❌

---

## 🎨 Teste 8: Temas

### Pré-requisitos
- [ ] Aplicação carregada
- [ ] Botão de tema visível (☀️/🌙)

### Passos

#### A. Alternar Tema
1. Clicar no botão de tema
2. Verificar mudança de Light para Dark
3. Clicar novamente
4. Verificar mudança de Dark para Light
5. Verificar transição suave

#### B. Cores Aplicadas
1. Em Light: fundo claro, texto escuro
2. Em Dark: fundo escuro, texto claro
3. Cores de cards/botões adequadas
4. Bom contraste em ambos

#### C. Persistência
1. Alternar tema
2. Recarregar página (F5)
3. Verificar se tema foi mantido

#### D. Preferência do Sistema
1. Limpar localStorage
2. Se sistema está em Dark Mode
3. Verificar se app inicia em Dark
4. Se sistema está em Light
5. Verificar se app inicia em Light

### Esperado
- ✅ Tema alterna ao clicar
- ✅ Cores corretas em ambos temas
- ✅ Contraste adequado
- ✅ Tema é salvo
- ✅ Preferência do sistema detectada
- ✅ Transição suave

### Resultado: ⚪ | ✅ | ❌

---

## 💾 Teste 9: Persistência (Storage)

### Pré-requisitos
- [ ] Aplicação carregada

### Passos

#### A. Auto-Save
1. Preencher valores em uma tela
2. Aguardar 30-40 segundos
3. Recarregar página
4. Verificar se dados foram mantidos

#### B. Criar e Salvar Projeto
1. Criar 2+ telas com dados
2. Recarregar página (F5)
3. Verificar se telas e dados persistem

#### C. Gabinetes Salvos
1. Criar 2+ gabinetes
2. Recarregar página
3. Verificar se gabinetes aparecem no dropdown

#### D. LocalStorage
1. Abrir DevTools (F12)
2. Ir para "Storage" > "Local Storage"
3. Procurar por "ledlab-"
4. Verificar se dados estão salvos em JSON

### Esperado
- ✅ Dados são salvos automaticamente
- ✅ Dados persistem após reload
- ✅ Gabinetes salvos localmente
- ✅ LocalStorage não está vazio
- ✅ Sem erros ao carregar dados

### Resultado: ⚪ | ✅ | ❌

---

## 📱 Teste 10: Responsividade

### Teste Desktop (1920x1080)
- [ ] Sidebar fixa à esquerda
- [ ] Navbar completa
- [ ] Todos os elementos visíveis
- [ ] Sem scroll horizontal

### Teste Tablet (768x1024)
- [ ] Layout adapta
- [ ] Menu mobile funciona
- [ ] Canvas é grande o suficiente
- [ ] Cards legíveis

### Teste Mobile (375x667)
- [ ] Menu hamburguer funciona
- [ ] Todos elementos clicáveis (min 44px)
- [ ] Sem elementos fora da tela
- [ ] Scroll vertical apenas
- [ ] Teclado virtual não bloqueia inputs

### Esperado
- ✅ Design é responsivo em 3+ resoluções
- ✅ Sem conteúdo cortado
- ✅ Elementos clicáveis em mobile
- ✅ Performance aceitável
- ✅ Sem layout shift

### Resultado: ⚪ | ✅ | ❌

---

## ⌨️ Teste 11: Atalhos de Teclado

### Pré-requisitos
- [ ] Aplicação em foco

### Passos

#### A. Ctrl+S (Salvar)
1. Pressionar Ctrl+S
2. Verificar console - deve ver mensagem de save
3. Verificar se dados foram salvos

#### B. Ctrl+T (Alternar Tema)
1. Pressionar Ctrl+T
2. Verificar se tema alterna
3. Pressionar novamente
4. Verificar mudança

### Esperado
- ✅ Ctrl+S salva projeto
- ✅ Ctrl+T alterna tema
- ✅ Feedback visual ou no console
- ✅ Sem erros

### Resultado: ⚪ | ✅ | ❌

---

## 🔍 Teste 12: Console e Erros

### Pré-requisitos
- [ ] DevTools aberto (F12)
- [ ] Aba "Console" selecionada

### Passos

1. Executar todos os testes acima
2. Verificar console depois de cada ação
3. Analisar se há:
   - Erros vermelhos (❌ não deve ter)
   - Warnings amarelos (⚠️ revisar)
   - Mensagens de info azuis (ℹ️ OK)

### Esperado
- ✅ Nenhum erro no console
- ✅ Warnings apenas se explicáveis
- ✅ Messages de info úteis
- ✅ Sem memory leaks

### Resultado: ⚪ | ✅ | ❌

---

## 📊 Resumo de Testes

| Teste | Desktop | Tablet | Mobile | Status |
|-------|---------|--------|--------|--------|
| 1. Carregamento | ⚪ | ⚪ | ⚪ | 🔵 |
| 2. Navegação | ⚪ | ⚪ | ⚪ | 🔵 |
| 3. Telas | ⚪ | ⚪ | ⚪ | 🔵 |
| 4. Cálculos | ⚪ | ⚪ | ⚪ | 🔵 |
| 5. Canvas | ⚪ | ⚪ | ⚪ | 🔵 |
| 6. Gabinetes | ⚪ | ⚪ | ⚪ | 🔵 |
| 7. Relatórios | ⚪ | ⚪ | ⚪ | 🔵 |
| 8. Temas | ⚪ | ⚪ | ⚪ | 🔵 |
| 9. Storage | ⚪ | ⚪ | ⚪ | 🔵 |
| 10. Responsividade | ⚪ | ⚪ | ⚪ | 🔵 |
| 11. Atalhos | ⚪ | ⚪ | - | 🔵 |
| 12. Console | ⚪ | ⚪ | ⚪ | 🔵 |

**Legenda**: ⚪ = Não testado | ✅ = Passou | ❌ = Falhou | 🔵 = Não Iniciado

---

## 🐛 Bugs Encontrados

### Template para Documentar Bug

```
## Bug #X: [Título]

**Resolução**: [Desktop/Tablet/Mobile]  
**Módulo**: [módulo afetado]  
**Severidade**: [Alta/Média/Baixa]

**Descrição**:
[Descrever o problema]

**Passos para Reproduzir**:
1. ...
2. ...
3. ...

**Esperado**:
[Qual era o comportamento esperado]

**Atual**:
[Qual é o comportamento atual]

**Console**:
[Se há erro no console, copiar aqui]

**Status**: 🔴 Aberto | 🟡 Em Progresso | 🟢 Resolvido
```

---

## ✅ Checklist Final

- [ ] Todos os 12 testes executados
- [ ] Bugs documentados em ISSUES_AND_IMPROVEMENTS.md
- [ ] Console limpo de erros críticos
- [ ] Responsividade validada
- [ ] Relatório de testes gerado
- [ ] Aplicação pronta para próxima fase

---

**Data de Execução**: ___________  
**Testador**: ___________  
**Resultado Geral**: ⚪ Não Iniciado | 🟡 Em Progresso | ✅ Completo

---

> 💡 **Dica**: Adicione capturas de tela ou vídeos dos testes para referência futura.
