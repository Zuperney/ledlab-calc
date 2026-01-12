import { getGabinetes, saveGabinete, deleteGabinete as deleteGabineteFromStorage } from "./storage.js";
import { createGabinete, validateGabinete, formatGabineteDisplay } from "./gabinetes.js";
import { getActiveScreen } from "./state.js";
import { updatePhysicalStats } from "./calculations.js";

export function initGabineteSystem() {
    const form = document.getElementById("formGabinete");
    const gabineteSalvo = document.getElementById("gabineteSalvo");

    if (form) {
        form.addEventListener("submit", salvarGabinete);
    }

    if (gabineteSalvo) {
        populateGabineteSelector();
        gabineteSalvo.addEventListener("change", loadGabineteData);
    }

    updateGabineteList();
}

function salvarGabinete(e) {
    e.preventDefault();

    const fabricante = document.getElementById("fabricante").value;
    const nomeGabinete = document.getElementById("nome_gabinete").value;

    if (nomeGabinete.toUpperCase().includes(fabricante.toUpperCase())) {
        alert("⚠️ Coloque somente o nome do gabinete, sem o nome do fabricante.");
        return;
    }

    const gabinete = createGabinete(
        fabricante,
        nomeGabinete,
        document.getElementById("pixel_w").value,
        document.getElementById("pixel_h").value,
        document.getElementById("mm_w").value,
        document.getElementById("mm_h").value,
        {
            peso: document.getElementById("peso").value,
            consumo: document.getElementById("consumo").value,
            ambiente: document.querySelector("input[name=\"ambiente\"]:checked").value,
            pixel_pitch: document.getElementById("pixel_pitch").value,
            nits: document.getElementById("nits").value,
            refresh_rate: document.getElementById("refresh_rate").value,
            ip_rating: document.getElementById("ip_rating").value
        }
    );

    const validation = validateGabinete(gabinete);
    if (!validation.valid) {
        alert("⚠️ Erros no gabinete:\n" + validation.errors.join("\n"));
        return;
    }

    saveGabinete(gabinete);
    alert(`✅ Gabinete "${gabinete.nome}" salvo com sucesso!`);
    e.target.reset();
    updateGabineteList();
    populateGabineteSelector();
}

export function deleteGabinete(id) {
    if (!confirm("Tem certeza que deseja excluir este gabinete?")) return;

    deleteGabineteFromStorage(id);
    updateGabineteList();
    populateGabineteSelector();
}

function updateGabineteList() {
    const container = document.getElementById("listaGabinetes");
    if (!container) return;

    const gabinetes = getGabinetes();

    if (gabinetes.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--muted); padding: 40px;">Nenhum gabinete cadastrado ainda.</p>';
        return;
    }

    container.innerHTML = gabinetes.map(g => {
        const ambienteIcon = g.ambiente === 'indoor' ? '🏠 Indoor' : '🌤️ Outdoor';
        return `
        <div class="gabinete-item">
            <div class="gabinete-info">
                <h3><strong>${g.fabricante}</strong> - ${g.nome}</h3>
                <div class="gabinete-specs">
                    <span>📐 ${g.pixel_w}x${g.pixel_h} pixels</span>
                    <span>📏 ${g.mm_w}x${g.mm_h} mm</span>
                    ${g.pixel_pitch ? `<span>🔍 P${g.pixel_pitch}</span>` : ''}
                    <span>${ambienteIcon}</span>
                </div>
            </div>
            <div class="gabinete-actions">
                <button class="btn-usar" data-gabinete-id="${g.id}">Usar</button>
                <button class="btn-delete" data-gabinete-id="${g.id}">Excluir</button>
            </div>
        </div>
    `;
    }).join('');

    // Attach event listeners with delegation
    container.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-usar')) {
            const id = parseInt(e.target.dataset.gabinetId);
            loadGabineteToConfigurator(id);
        }
        if (e.target.classList.contains('btn-delete')) {
            const id = parseInt(e.target.dataset.gabinetId);
            deleteGabinete(id);
        }
    });
}

function populateGabineteSelector() {
    const select = document.getElementById("gabineteSalvo");
    if (!select) return;

    const gabinetes = getGabinetes();
    select.innerHTML = '<option value="">Selecione ou use valores personalizados</option>';

    gabinetes.forEach(g => {
        const option = document.createElement("option");
        option.value = g.id;
        option.textContent = formatGabineteDisplay(g);
        select.appendChild(option);
    });
}

function loadGabineteData() {
    const select = document.getElementById("gabineteSalvo");
    const id = parseInt(select.value);
    if (!id) return;

    const gabinete = getGabinetes().find(g => g.id === id);
    if (!gabinete) return;

    document.getElementById("pixelX").value = gabinete.pixel_w;
    document.getElementById("pixelY").value = gabinete.pixel_h;

    const screen = getActiveScreen();
    if (screen) {
        screen.peso = parseFloat(gabinete.peso) || 0;
        screen.consumo = parseFloat(gabinete.consumo) || 0;
        screen.voltagem = parseFloat(gabinete.voltagem) || 220;
        updatePhysicalStats();
    }
}

export function loadGabineteToConfigurator(id) {
    const gabinete = getGabinetes().find(g => g.id === id);
    if (!gabinete) return;

    document.querySelectorAll(".nav-button[data-page]").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".page-content").forEach(p => p.classList.remove("active"));
    document.querySelector('.nav-button[data-page="configurator"]').classList.add("active");
    document.getElementById("page-configurator").classList.add("active");

    const select = document.getElementById("gabineteSalvo");
    if (select) select.value = id;
    document.getElementById("pixelX").value = gabinete.pixel_w;
    document.getElementById("pixelY").value = gabinete.pixel_h;

    window.scrollTo({ top: 0, behavior: "smooth" });
}
