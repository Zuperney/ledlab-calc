import { getActiveScreen } from './state.js';
import { updatePhysicalStats, calcularTudo } from './calculations.js';

function initTabs() {
    const buttons = Array.from(document.querySelectorAll(".tab-button"));
    const panels = Array.from(document.querySelectorAll(".tab-panel"));
    if (!buttons.length || !panels.length) return;
    const activate = (targetId) => {
        buttons.forEach(btn => btn.classList.toggle("active", btn.dataset.target === targetId));
        panels.forEach(panel => panel.classList.toggle("active", panel.id === targetId));
    };
    buttons.forEach(btn => {
        btn.addEventListener("click", () => activate(btn.dataset.target));
    });
}

function initNavigation() {
    const navButtons = document.querySelectorAll(".nav-button[data-page]");
    const pages = document.querySelectorAll(".page-content");

    navButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const targetPage = btn.dataset.page;
            navButtons.forEach(b => b.classList.remove("active"));
            pages.forEach(p => p.classList.remove("active"));
            btn.classList.add("active");
            document.getElementById(`page-${targetPage}`).classList.add("active");
        });
    });

    // Handle overclock box click to toggle checkbox
    const overclockBox = document.getElementById("overclockBox");
    if (overclockBox) {
        overclockBox.addEventListener("click", (e) => {
            if (e.target.id !== "overclockMode") {
                document.getElementById("overclockMode").click();
            }
        });
    }
}

function initInputPersistence(updatePhysicalStatsCallback) {
    const inputs = [
        { id: "pixelX", field: "pixelX" },
        { id: "pixelY", field: "pixelY" },
        { id: "cabinetX", field: "cabinetX" },
        { id: "cabinetY", field: "cabinetY" },
        { id: "gabineteSalvo", field: "gabineteSalvoId" },
        { id: "cablingType", field: "layoutType" },
        { id: "overclockMode", field: "overclockMode", isCheckbox: true }
    ];

    inputs.forEach(({ id, field, isCheckbox }) => {
        const element = document.getElementById(id);
        if (element) {
            const handler = () => {
                const screen = getActiveScreen();
                if (screen) {
                    const value = isCheckbox ? element.checked : element.value;
                    screen[field] = value;
                    if (id === "cabinetX" || id === "cabinetY") {
                        updatePhysicalStatsCallback();
                    }
                    if (id === "cablingType") {
                        const event = new CustomEvent('layoutTypeChanged', { detail: { layoutType: value } });
                        document.dispatchEvent(event);
                    }
                    if (id === "gabineteSalvo") {
                        const event = new CustomEvent('gabineteSalvoChanged', { detail: { id: value } });
                        document.dispatchEvent(event);
                    }
                    if (id === "overclockMode") {
                        calcularTudo();
                    }
                }
            };

            if (id === "gabineteSalvo" || id === "overclockMode") {
                element.addEventListener("change", handler);
            } else {
                element.addEventListener("input", handler);
                element.addEventListener("change", handler);
            }
        }
    });
}

export {
    initTabs,
    initNavigation,
    initInputPersistence
};
