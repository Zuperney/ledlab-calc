import { currentProject, addScreen, setActiveScreen } from "./js/modules/state.js";
import { calcularTudo, atualizarManual, updatePhysicalStats } from "./js/modules/calculations.js";
import { renderScreenList, initScreensUI } from "./js/modules/screens.js";
import { initTabs, initNavigation, initInputPersistence } from "./js/modules/ui.js";
import { initTheme } from "./js/modules/theme.js";
import { initGabineteSystem } from "./js/modules/gabinete-system.js";
import { generateProjectReport } from "./js/modules/reports.js";


document.addEventListener("DOMContentLoaded", () => {
    if (currentProject.screens.length === 0) {
        addScreen("Tela 1");
    } else {
        setActiveScreen(0);
    }

    const calculateButton = document.getElementById("calculateButton");
    const manualSelect = document.getElementById("manualSelect");

    if (calculateButton) calculateButton.addEventListener("click", calcularTudo);
    if (manualSelect) manualSelect.addEventListener("change", atualizarManual);

    initTheme();
    initTabs();
    initNavigation();
    initGabineteSystem();
    initScreensUI(() => generateProjectReport());
    renderScreenList();
    initInputPersistence(updatePhysicalStats);

    // Listen for cabling type changes
    document.addEventListener("layoutTypeChanged", () => {
        calcularTudo();
    });
});



// Expose to window for inline handlers in HTML
Object.assign(window, {
    calcularTudo,
    atualizarManual
});
