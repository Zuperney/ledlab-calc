/**
 * MAIN MODULE
 * Ponto de entrada da aplicação - Orquestrador de Módulos
 * Responsável por: inicializar todos os módulos e coordenar eventos
 * 
 * NOTA: Este arquivo usa o padrão de escopo global para compatibilidade.
 * Todos os módulos são carregados como scripts sequenciais no HTML.
 * Os event listeners substituem os eventos inline (onclick, onchange).
 */

// Estado global da aplicação
let currentProject = null;

/**
 * Inicializa aplicação quando DOM está pronto
 */
function initApplication() {
    console.log('🚀 Inicializando LedLab Configurator v7.0...');

    // 1. Carrega projeto do storage
    currentProject = loadProject();
    console.log('✅ Projeto carregado:', currentProject.name);

    // 2. Inicializa temas
    initTheme();

    // 3. Inicializa UI de telas
    renderScreenList();
    initScreensUI();
    loadScreenToUI(currentProject.activeScreenIndex);

    // 4. Inicializa sistema de abas
    initTabs();

    // 5. Inicializa navegação
    initNavigation();

    // 6. Inicializa menu mobile
    initMobileMenu();

    // 7. Inicializa persistência de inputs
    initInputPersistence();

    // 8. Inicializa gabinetes
    initGabinetes();

    // 9. Inicializa modal de relatório
    initReportModal();

    // 10. Liga event listeners (substituindo onclick/onchange do HTML)
    setupEventListeners();

    // 11. Carrega dados iniciais (modo silencioso para não mostrar alertas)
    calcularTudo(true);
    updatePhysicalStats();
    redrawAllCanvas();

    // 12. Configura auto-save
    setupAutoSave();

    console.log('✅ Aplicação inicializada com sucesso!');
}

/**
 * Configura todos os event listeners (substituindo eventos inline)
 */
function setupEventListeners() {
    console.log('🔗 Configurando event listeners...');

    // Botão de calcular
    const btnCalcular = document.getElementById('calculateButton');
    if (btnCalcular) {
        btnCalcular.addEventListener('click', handleCalcular);
    }

    // Checkbox de overclock (com ou sem a div wrapper)
    const overclockBox = document.getElementById('overclockBox');
    const overclockMode = document.getElementById('overclockMode');
    
    if (overclockBox && overclockMode) {
        // Clica na div para ativar o checkbox
        overclockBox.addEventListener('click', (e) => {
            if (e.target !== overclockMode) {
                overclockMode.click();
            }
        });
        
        // Recalcula quando muda
        overclockMode.addEventListener('change', () => {
            const screen = getActiveScreen();
            if (screen) {
                screen.overclockMode = overclockMode.checked;
                calcularTudo();
            }
        });
    }

    // Inputs de dimensões
    const inputs = ['pixelX', 'pixelY', 'cabinetX', 'cabinetY'];
    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('change', handleInputChange);
        }
    });

    // Select de gabinete
    const gabineteSalvo = document.getElementById('gabineteSalvo');
    if (gabineteSalvo) {
        gabineteSalvo.addEventListener('change', loadGabineteData);
    }

    // Select de tipo de cabeamento
    const cablingType = document.getElementById('cablingType');
    if (cablingType) {
        cablingType.addEventListener('change', handleCablingTypeChange);
    }

    console.log('✅ Event listeners configurados');
}

/**
 * Handler para o botão calcular
 */
function handleCalcular() {
    console.log('🔢 Executando cálculos...');
    calcularTudo();
    updatePhysicalStats();
    redrawAllCanvas();
}

/**
 * Handler para mudanças nos inputs
 */
function handleInputChange(e) {
    const screen = getActiveScreen();
    if (!screen) return;

    const inputId = e.target.id;
    const value = parseInt(e.target.value);

    if (value && value > 0) {
        switch (inputId) {
            case 'pixelX':
                screen.pixelX = value;
                break;
            case 'pixelY':
                screen.pixelY = value;
                break;
            case 'cabinetX':
                screen.cabinetX = value;
                break;
            case 'cabinetY':
                screen.cabinetY = value;
                break;
        }
        saveProject();
    }
}

/**
 * Handler para mudança de tipo de cabeamento
 */
function handleCablingTypeChange(e) {
    const screen = getActiveScreen();
    if (screen) {
        screen.layoutType = e.target.value;
        saveProject();
        calcularTudo();
        redrawAllCanvas();
    }
}

/**
 * Configura auto-save a cada mudança
 */
function setupAutoSave() {
    // Monitora mudanças no projeto
    const autoSaveInterval = setInterval(() => {
        if (currentProject && currentProject.screens) {
            saveProject();
        }
    }, 30000); // 30 segundos

    // Salva antes de sair da página
    window.addEventListener('beforeunload', () => {
        saveProject();
    });

    console.log('💾 Auto-save configurado (30s)');
}

/**
 * Calcula tudo e atualiza interface
 * @param {boolean} silent - Se true, não mostra alertas de validação
 */
function calcularTudo(silent = false) {
    const screen = getActiveScreen();
    if (!screen) return null;

    // Valida inputs (modo silencioso durante inicialização)
    if (!validateInputs(screen.pixelX, screen.pixelY, screen.cabinetX, screen.cabinetY, silent)) return null;

    // Calcula limites
    const { limite, limitSafe } = calculateLimits(screen);

    // Gera mapeamento
    const mapeamento = gerarMapeamento(
        screen.pixelX,
        screen.pixelY,
        screen.cabinetX,
        screen.cabinetY,
        screen.layoutType || 'horizontal',
        screen.overclockMode || false
    );

    if (!mapeamento) return null;

    // Calcula cabos
    const resultado = {
        ...mapeamento,
        limit: limite,
        limitSafe: limitSafe,
        totalPixels: screen.pixelX * screen.pixelY
    };

    // Atualiza UI
    updateUI('cabosH', resultado.cabosH, 'Cabos Horizontal', resultado.cabosH, limitSafe);
    updateUI('cabosV', resultado.cabosV, 'Cabos Vertical', resultado.cabosV, limitSafe);
    updateUI('totalCabos', resultado.totalCabos, 'Total de Cabos', resultado.totalCabos, limitSafe);

    // Desenha canvas
    redrawAllCanvas();

    return resultado;
}

/**
 * Atualiza estatísticas físicas
 */
function updatePhysicalStats() {
    const screen = getActiveScreen();
    if (!screen) return;

    const pixels = screen.pixelX * screen.pixelY;
    const gabinetes = screen.cabinetX * screen.cabinetY;

    // Calcula peso e potência por tela
    let peso = 0;
    let potencia = 0;
    let amperagem = 0;

    if (screen.gabineteInfo) {
        const peso_total_gab = screen.gabineteInfo.pesoVazio + screen.gabineteInfo.pesoLED;
        peso = peso_total_gab * gabinetes;
        potencia = screen.gabineteInfo.potencia * gabinetes;
        amperagem = screen.gabineteInfo.ampersPerPorta * gabinetes;
    }

    // Atualiza exibição
    const el = document.getElementById('physicalStats');
    if (el) {
        el.innerHTML = `
            <div class="stat-item">
                <span class="stat-label">📊 Pixels:</span>
                <span class="stat-value">${pixels.toLocaleString('pt-BR')}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">📦 Gabinetes:</span>
                <span class="stat-value">${gabinetes}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">⚖️ Peso:</span>
                <span class="stat-value">${peso.toFixed(2)} kg</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">⚡ Potência:</span>
                <span class="stat-value">${potencia.toFixed(2)} W</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">🔌 Amperagem:</span>
                <span class="stat-value">${amperagem.toFixed(2)} A</span>
            </div>
        `;
    }

    console.log(`📊 Estatísticas físicas atualizadas: ${pixels} pixels, ${gabinetes} gabinetes`);
}

/**
 * Tela ativa atual
 * @returns {Object} Objeto da tela ativa
 */
function getActiveScreen() {
    return currentProject.screens[currentProject.activeScreenIndex];
}

/**
 * Define tela ativa
 * @param {number} index - Índice da tela
 */
function setActiveScreen(index) {
    if (index >= 0 && index < currentProject.screens.length) {
        currentProject.activeScreenIndex = index;
        loadScreenToUI(index);
        console.log(`📺 Tela ativa alterada para: ${currentProject.screens[index].name}`);
    }
}

/**
 * Event listeners para teclas de atalho
 */
document.addEventListener('keydown', (e) => {
    // Ctrl+S ou Cmd+S: Salvar
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveProject();
        console.log('💾 Projeto salvo (atalho Ctrl+S)');
    }

    // Ctrl+T ou Cmd+T: Alternar tema
    if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault();
        toggleTheme();
    }
});

// Inicializa quando DOM está pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApplication);
} else {
    initApplication();
}
