Essa é a melhor abordagem. O Copilot (e qualquer IA de codificação) funciona muito melhor quando você **isola o contexto**. Se pedirmos "faça um sistema de projetos", ele vai tentar reescrever o arquivo inteiro e provavelmente vai quebrar o cálculo de cabos que já funciona.

Abaixo está o **Roadmap Modular para o Copilot**.

**Instrução de Uso:** Copie e cole **apenas um item de nível secundário (ex: 1.1)** por vez no chat do Copilot. Só passe para o 1.2 quando o 1.1 estiver testado e funcionando.

---

### 🛡️ Pré-requisito: Backup

Antes de começar, faça um `.zip` ou uma cópia da pasta atual. A Fase 1 vai alterar a estrutura central de como os dados são lidos.

---

### 🗺️ Roadmap de Implementação: LedLab Configurator

#### 1. FASE 1: Arquitetura de Projeto (Multi-Telas)

*Objetivo:* Deixar de calcular apenas "uma tela solta" e passar a gerenciar uma lista de telas (ex: Palco, Delay, Fundo).

* **1.1. Refatoração da Estrutura de Dados (JS)**
* **Prompt para o Copilot:** "No arquivo `script.js`, precisamos mudar a forma como armazenamos os dados. Crie uma estrutura de objeto global chamada `currentProject` que contenha um array `screens`. Crie também uma função `addScreen()` que adiciona um objeto de tela padrão ao array e uma função `setActiveScreen(index)` para alternar entre elas. Não altere o HTML ainda, apenas a lógica de dados."
* **Critério de Aceite:** O console do navegador não deve dar erros. Ao digitar `currentProject` no console, deve aparecer o objeto.


* **1.2. Criação da Sidebar de Navegação (HTML/CSS)**
* **Prompt para o Copilot:** "No `index.html`, modifique a estrutura da `div.page-content#page-configurator`. Transforme-a em um layout flexbox de duas colunas. A esquerda será uma `<aside>` (sidebar) para listar as telas, e a direita será o conteúdo atual. Adicione o CSS necessário em `style.css` para que a sidebar tenha largura fixa e o conteúdo ocupe o resto."
* **Critério de Aceite:** O layout deve aparecer dividido, com a barra lateral vazia à esquerda e os inputs antigos à direita.


* **1.3. Conexão Lógica-Interface (Renderização)**
* **Prompt para o Copilot:** "Agora, conecte a lógica da fase 1.1 com a sidebar da fase 1.2. Crie uma função `renderScreenList()` que desenha botões na sidebar para cada tela no array `currentProject.screens`. O botão 'Adicionar Tela' deve criar uma nova tela e atualizar a lista. Ao clicar em uma tela da lista, deve carregar os valores dela (pixelX, cabinetX, etc) nos inputs existentes."
* **Critério de Aceite:** Clicar em "Adicionar Tela" cria um botão novo na barra lateral. Clicar entre "Tela 1" e "Tela 2" troca os valores nos inputs (teste mudando os valores de uma e trocando para a outra).


* **1.4. Persistência de Dados (Inputs)**
* **Prompt para o Copilot:** "Precisamos que, ao alterar qualquer input (`pixelX`, `cabinetX`, etc), os dados sejam salvos automaticamente no objeto da tela ativa dentro de `currentProject.screens`. Adicione 'event listeners' de `change` ou `input` em todos os campos do configurador para atualizar o objeto em tempo real."
* **Critério de Aceite:** Ao digitar "50" em gabinetes na Tela 1, mudar para a Tela 2 e voltar para a Tela 1, o valor "50" deve estar lá.



---

#### 2. FASE 2: Integração de Dados Físicos

*Objetivo:* Utilizar o peso e consumo cadastrados no banco de dados para gerar estatísticas úteis.

* **2.1. Expansão do Carregamento de Gabinete**
* **Prompt para o Copilot:** "Na função `loadGabineteToConfigurator` e no `eventListener` do select `#gabineteSalvo`, atualmente só carregamos `pixel_w` e `pixel_h`. Altere para que ele também carregue e armazene (em variáveis ou atributos data) o `peso`, `consumo` e `voltagem` do gabinete selecionado."
* **Critério de Aceite:** Ao selecionar um gabinete, os pixels mudam (como já faziam), mas se dermos um `console.log` nas variáveis, o peso e consumo também estarão disponíveis.


* **2.2. Criação do Card de Estatísticas (HTML/JS)**
* **Prompt para o Copilot:** "Adicione um novo card visual no `index.html` (dentro da área do configurador) chamado 'Estatísticas Físicas'. No JS, crie uma função `calculatePhysicalStats()` que multiplica a quantidade total de gabinetes da tela ativa pelo peso e consumo unitários. Exiba: Peso Total (Kg), Consumo Total (Watts) e Estimativa de Amperes (considerando 220v padrão, mas configurável)."
* **Critério de Aceite:** Ao mudar a quantidade de gabinetes (ex: 10x10), os valores de Peso e Watts devem atualizar automaticamente.


* **2.3. Resumo Global do Projeto**
* **Prompt para o Copilot:** "Na sidebar do projeto (criada na Fase 1), adicione um rodapé fixo. Crie uma função que percorra TODAS as telas do projeto, some o total de gabinetes, peso total e consumo total de todas as telas combinadas e exiba nesse rodapé."
* **Critério de Aceite:** Adicione duas telas. O rodapé deve mostrar a soma das duas.



---

#### 3. FASE 3: Visualização de Dados (Data Path)

*Objetivo:* Desenhar a linha de cabeamento sobre os gabinetes.

* **3.1. UI de Configuração de Rota**
* **Prompt para o Copilot:** "Adicione um `<select>` na interface do configurador com as opções: 'Cabeamento: Z-Type (Horizontal)' e 'Cabeamento: U-Type (Vertical)'. Salve essa preferência no objeto da tela."
* **Critério de Aceite:** O select aparece e guarda o valor escolhido.


* **3.2. Lógica de Desenho de Linhas (Canvas)**
* **Prompt para o Copilot:** "Na função `desenharMapeamento` (dentro do `script.js`), adicione uma rotina que desenhe uma linha branca conectando o centro de cada gabinete sequencialmente dentro de um mesmo cabo. A ordem deve respeitar a lógica Z-Type (esquerda->direita, desce, esquerda->direita) ou U-Type (Snake) conforme selecionado no passo anterior."
* **Critério de Aceite:** Ao clicar em calcular, além dos quadrados coloridos, uma linha deve conectar os gabinetes, mostrando o caminho do sinal.



---

#### 4. FASE 4: Exportação (O Grand Finale)

*Objetivo:* Gerar um documento para enviar ao cliente/técnico.

* **4.1. Criação do Modal de Relatório**
* **Prompt para o Copilot:** "Crie um botão 'Gerar Relatório' na sidebar. Ao clicar, abra uma nova janela ou modal que tenha um layout 'Printer Friendly' (fundo branco, preto no branco). Esse layout deve iterar sobre `currentProject.telas` e montar uma tabela com os dados técnicos e incluir a imagem do canvas (use `canvas.toDataURL()`) de cada tela."
* **Critério de Aceite:** O botão abre uma janela limpa com as informações organizadas.


* **4.2. Botão de Impressão**
* **Prompt para o Copilot:** "Nessa janela de relatório, adicione um botão 'Salvar PDF / Imprimir' que chame `window.print()`. Adicione um CSS `@media print` para garantir que, ao imprimir, os botões sumam e a formatação fique correta em folha A4."
* **Critério de Aceite:** Ao imprimir (salvar como PDF), o documento sai limpo e profissional.