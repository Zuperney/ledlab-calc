import { currentProject, setActiveScreen, addScreen as addScreenState, getActiveScreen } from './state.js';

function renderScreenList() {
    const list = document.getElementById("screensList");
    if (!list) return;

    list.innerHTML = '';

    currentProject.screens.forEach((screen, index) => {
        const item = document.createElement("div");
        item.className = `screen-item ${index === currentProject.activeScreenIndex ? 'active' : ''}`;

        item.innerHTML = `
            <span class="screen-item-name">${screen.name}</span>
            <button class="screen-item-delete" title="Deletar">✕</button>
        `;

        item.addEventListener("click", (e) => {
            if (e.target.classList.contains("screen-item-delete")) return;
            setActiveScreen(index);
            renderScreenList();
        });

        const deleteBtn = item.querySelector(".screen-item-delete");
        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (currentProject.screens.length === 1) {
                alert("⚠️ Você precisa ter pelo menos uma tela!");
                return;
            }
            if (confirm(`Tem certeza que deseja deletar "${screen.name}"?`)) {
                currentProject.screens.splice(index, 1);
                if (currentProject.activeScreenIndex >= currentProject.screens.length) {
                    currentProject.activeScreenIndex = currentProject.screens.length - 1;
                }
                setActiveScreen(currentProject.activeScreenIndex);
                renderScreenList();
            }
        });

        list.appendChild(item);
    });
}

function initScreensUI(onReport) {
    const addScreenBtn = document.getElementById("addScreenBtn");
    if (addScreenBtn) {
        addScreenBtn.addEventListener("click", () => {
            addScreenState();
            renderScreenList();
        });
    }

    const reportBtn = document.getElementById("reportBtn");
    if (reportBtn) {
        reportBtn.addEventListener("click", onReport);
    }
}

function updateGlobalSummary() {
    let totalGabinetes = 0;
    let totalPeso = 0;
    let totalConsumo = 0;

    currentProject.screens.forEach(screen => {
        const gabs = (screen.cabinetX || 0) * (screen.cabinetY || 0);
        totalGabinetes += gabs;
        totalPeso += gabs * (screen.peso || 0);
        totalConsumo += gabs * (screen.consumo || 0);
    });

    const summaryElement = document.getElementById("globalSummary");
    if (summaryElement) {
        summaryElement.innerHTML = `
            <div class="summary-item">
                <span class="summary-icon">📺</span>
                <span class="summary-text">${currentProject.screens.length} tela(s)</span>
            </div>
            <div class="summary-item">
                <span class="summary-icon">📦</span>
                <span class="summary-text">${totalGabinetes} gabinetes</span>
            </div>
            <div class="summary-item">
                <span class="summary-icon">⚖️</span>
                <span class="summary-text">${totalPeso.toFixed(1)} kg</span>
            </div>
            <div class="summary-item">
                <span class="summary-icon">⚡</span>
                <span class="summary-text">${totalConsumo.toFixed(0)} W</span>
            </div>
        `;
    }
}

export {
    renderScreenList,
    initScreensUI,
    updateGlobalSummary
};
