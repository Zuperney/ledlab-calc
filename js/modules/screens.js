/**
 * SCREENS MODULE
 * Gerenciamento de múltiplas telas/configurações do projeto
 * Responsável por: criação, ativação, carregamento de telas
 */

/**
 * Cria estrutura padrão de uma tela
 * @param {string|null} name - Nome da tela (opcional)
 * @returns {Object} Objeto de tela com valores padrão
 */
function createDefaultScreen(name = null) {
    const screenIndex = currentProject.screens.length + 1;
    return {
        id: Date.now() + Math.random(),
        name: name || `Tela ${screenIndex}`,
        pixelX: 0,
        pixelY: 0,
        cabinetX: 0,
        cabinetY: 0,
        gabineteSalvoId: null,
        peso: 0,
        consumo: 0,
        voltagem: 220,
        overclockMode: false,
        layoutType: 'horizontal',
        manualLayout: null,
        results: {}
    };
}

/**
 * Adiciona nova tela ao projeto
 * @param {string|null} name - Nome da tela
 * @returns {Object} A tela criada
 */
function addScreen(name = null) {
    const newScreen = createDefaultScreen(name);
    currentProject.screens.push(newScreen);
    setActiveScreen(currentProject.screens.length - 1);
    console.log(`✅ Tela "${newScreen.name}" adicionada. Total: ${currentProject.screens.length}`);
    return newScreen;
}

/**
 * Ativa uma tela específica pelo índice
 * @param {number} index - Índice da tela
 * @returns {boolean} True se sucesso
 */
function setActiveScreen(index) {
    if (index >= 0 && index < currentProject.screens.length) {
        currentProject.activeScreenIndex = index;
        console.log(`✅ Tela ativa: "${currentProject.screens[index].name}" (índice ${index})`);
        loadScreenToUI(index);
        return true;
    }
    console.error(`❌ Índice de tela inválido: ${index}`);
    return false;
}

/**
 * Obtém a tela ativa atualmente
 * @returns {Object} A tela ativa
 */
function getActiveScreen() {
    return currentProject.screens[currentProject.activeScreenIndex];
}

/**
 * Remove uma tela do projeto
 * @param {number} index - Índice da tela
 * @returns {boolean} True se removida
 */
function deleteScreen(index) {
    if (currentProject.screens.length <= 1) {
        console.warn('⚠️ Não é possível deletar a última tela');
        return false;
    }
    
    const tela = currentProject.screens[index];
    currentProject.screens.splice(index, 1);
    
    // Ajusta índice ativo
    if (currentProject.activeScreenIndex >= currentProject.screens.length) {
        currentProject.activeScreenIndex = currentProject.screens.length - 1;
    }
    
    setActiveScreen(currentProject.activeScreenIndex);
    console.log(`🗑️ Tela "${tela.name}" deletada`);
    return true;
}

/**
 * Retorna todas as telas do projeto
 * @returns {Array} Array de telas
 */
function getAllScreens() {
    return currentProject.screens;
}

/**
 * Retorna quantidade de telas
 * @returns {number} Total de telas
 */
function getScreenCount() {
    return currentProject.screens.length;
}
