// Shared project state and screen helpers
let currentProject = {
    id: Date.now(),
    name: 'Novo Projeto',
    createdAt: new Date().toISOString(),
    screens: [],
    activeScreenIndex: 0
};

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
        overclockMode: false,
        layoutType: 'horizontal',
        manualLayout: null,
        results: {}
    };
}

function addScreen(name = null) {
    const newScreen = createDefaultScreen(name);
    currentProject.screens.push(newScreen);
    setActiveScreen(currentProject.screens.length - 1);
    return newScreen;
}

function setActiveScreen(index) {
    if (index >= 0 && index < currentProject.screens.length) {
        currentProject.activeScreenIndex = index;
        loadScreenToUI(index);
        return true;
    }
    console.error(`❌ Índice de tela inválido: ${index}`);
    return false;
}

function getActiveScreen() {
    return currentProject.screens[currentProject.activeScreenIndex];
}

function loadScreenToUI(screenIndex) {
    const screen = currentProject.screens[screenIndex];
    if (!screen) return;

    document.getElementById('pixelX').value = screen.pixelX;
    document.getElementById('pixelY').value = screen.pixelY;
    document.getElementById('cabinetX').value = screen.cabinetX;
    document.getElementById('cabinetY').value = screen.cabinetY;

    const gabineteSalvo = document.getElementById('gabineteSalvo');
    if (gabineteSalvo) {
        gabineteSalvo.value = screen.gabineteSalvoId || '';
    }

    const cablingType = document.getElementById('cablingType');
    if (cablingType) {
        cablingType.value = screen.layoutType || 'horizontal';
    }

    const overclockMode = document.getElementById('overclockMode');
    if (overclockMode) {
        overclockMode.checked = screen.overclockMode;
    }
}

export {
    currentProject,
    createDefaultScreen,
    addScreen,
    setActiveScreen,
    getActiveScreen,
    loadScreenToUI
};

