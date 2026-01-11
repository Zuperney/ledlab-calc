/**
 * STORAGE MODULE
 * Gerenciamento de persistência de dados (LocalStorage)
 * Responsável por: salvar/carregar projeto, sincronização de dados
 */

const PROJECT_STORAGE_KEY = 'ledlab-currentProject';

/**
 * Cria tela padrão (local version to avoid circular dependency)
 * @returns {Object} Tela padrão
 */
function createDefaultScreenForStorage() {
    return {
        id: Date.now().toString(),
        name: 'Tela 1',
        pixelX: 64,
        pixelY: 32,
        cabinetX: 2,
        cabinetY: 2,
        layoutType: 'horizontal',
        overclockMode: false,
        gabineteSalvoId: '',
        gabineteInfo: null
    };
}

/**
 * Cria projeto padrão
 * @returns {Object} Projeto padrão
 */
function createDefaultProject() {
    return {
        id: Date.now().toString(),
        name: 'Novo Projeto',
        createdAt: new Date().toISOString(),
        activeScreenIndex: 0,
        screens: [createDefaultScreenForStorage()]
    };
}

/**
 * Salva projeto no localStorage
 */
function saveProject() {
    try {
        // Verifica se currentProject existe (pode não existir no carregamento inicial)
        if (typeof currentProject === 'undefined' || !currentProject) {
            console.warn('⚠️ currentProject não definido ainda');
            return false;
        }
        localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(currentProject));
        console.log('💾 Projeto salvo com sucesso');
        return true;
    } catch (e) {
        console.error('❌ Erro ao salvar projeto:', e);
        return false;
    }
}

/**
 * Carrega projeto do localStorage
 * @returns {Object} Projeto carregado ou projeto padrão
 */
function loadProject() {
    try {
        const saved = localStorage.getItem(PROJECT_STORAGE_KEY);
        if (saved) {
            const project = JSON.parse(saved);
            console.log('📥 Projeto carregado do localStorage');
            return project;
        }
    } catch (e) {
        console.error('❌ Erro ao carregar projeto:', e);
    }
    return createDefaultProject();
}

/**
 * Limpa todos os dados salvos
 */
function clearAllData() {
    if (confirm('⚠️ CUIDADO! Isso vai deletar TODOS os projetos e gabinetes salvos. Tem certeza?')) {
        localStorage.removeItem(PROJECT_STORAGE_KEY);
        localStorage.removeItem('ledlab-gabinetes');
        // Atualiza currentProject se ele existir
        if (typeof currentProject !== 'undefined') {
            currentProject = createDefaultProject();
        }
        console.log('🗑️ Todos os dados foram limpos');
        location.reload();
    }
}

/**
 * Exibe informações de armazenamento
 */
function getStorageInfo() {
    try {
        const project = localStorage.getItem(PROJECT_STORAGE_KEY);
        const gabinetes = localStorage.getItem('ledlab-gabinetes');

        const projectSize = project ? new Blob([project]).size : 0;
        const gabinetesSize = gabinetes ? new Blob([gabinetes]).size : 0;
        const totalSize = projectSize + gabinetesSize;

        return {
            projectSize: (projectSize / 1024).toFixed(2),
            gabinetesSize: (gabinetesSize / 1024).toFixed(2),
            totalSize: (totalSize / 1024).toFixed(2),
            projectSaved: !!project,
            gabinetesCount: gabinetes ? JSON.parse(gabinetes).length : 0
        };
    } catch (e) {
        console.error('❌ Erro ao obter informações de armazenamento:', e);
        return null;
    }
}

/**
 * Exporte dados de debug
 */
function debugExportData() {
    const info = getStorageInfo();
    console.log('📊 Storage Info:', info);
    console.log('📦 Current Project:', currentProject);
    console.log('📋 Gabinetes:', getGabinetes());
}
