import { currentProject, getActiveScreen } from './state.js';
import { gerarLegenda, desenharMapeamento } from './canvas.js';

const PALETA_CORES = [
    '#2563eb', '#22c55e', '#f97316', '#06b6d4', '#f43f5e', '#a855f7', '#eab308', '#0ea5e9',
    '#16a34a', '#fb7185', '#38bdf8', '#c084fc', '#f59e0b', '#84cc16', '#f472b6', '#475569',
    '#14b8a6', '#8b5cf6', '#ef4444', '#3b82f6'
];

const MAX_PIXELS_PORTA = 655360;

function getCor(index) { return PALETA_CORES[index % PALETA_CORES.length]; }


// Globais auxiliares para modo manual
let G_maxGabsAtual = 0;
let G_limitSafe = 0;
let G_panW = 0;
let G_panH = 0;

function calcularTudo() {
    const pxW = parseInt(document.getElementById('pixelX').value) || 0;
    const pxH = parseInt(document.getElementById('pixelY').value) || 0;
    const panW = parseInt(document.getElementById('cabinetX').value) || 0;
    const panH = parseInt(document.getElementById('cabinetY').value) || 0;
    const isOverclockEnabled = document.getElementById('overclockMode').checked;

    if (!pxW || !pxH || !panW || !panH) { alert('Preencha todos os campos.'); return; }

    // ===== SALVAR DADOS NA TELA ATIVA =====
    const activeScreen = getActiveScreen();
    if (activeScreen) {
        activeScreen.pixelX = pxW;
        activeScreen.pixelY = pxH;
        activeScreen.cabinetX = panW;
        activeScreen.cabinetY = panH;
        activeScreen.overclockMode = isOverclockEnabled;
    }

    const pixelsPorGabinete = pxW * pxH;

    // --- CÁLCULO DOS LIMITES ---
    const limitSafe = Math.floor(MAX_PIXELS_PORTA / pixelsPorGabinete);

    let currentMaxGabs;
    if (isOverclockEnabled) {
        currentMaxGabs = Math.ceil(MAX_PIXELS_PORTA / pixelsPorGabinete);
    } else {
        currentMaxGabs = limitSafe;
    }

    if (currentMaxGabs < 1) { alert('Erro: Gabinete maior que a capacidade da porta!'); return; }

    G_maxGabsAtual = currentMaxGabs;
    G_limitSafe = limitSafe;
    G_panW = panW;
    G_panH = panH;

    // --- POPULAR SELECT MANUAL ---
    const select = document.getElementById('manualSelect');
    select.innerHTML = '';
    let opcoes = [];
    for (let w = 1; w <= currentMaxGabs && w <= panW; w++) {
        let h = Math.floor(currentMaxGabs / w);
        let hReal = (h > panH) ? panH : h;
        if (hReal >= 1) opcoes.push({ w: w, h: hReal, area: w * hReal });
    }
    opcoes.sort((a, b) => b.area - a.area);

    let unicos = new Set();
    opcoes.forEach(op => {
        const key = `${op.w}x${op.h}`;
        if (!unicos.has(key)) {
            unicos.add(key);
            let option = document.createElement('option');
            option.value = key;
            const isRisky = (op.area > limitSafe);
            const icon = isRisky ? '⚠️ ' : '';
            option.text = `${icon}Bloco ${op.w}x${op.h} (${op.area} gabs)`;
            select.appendChild(option);
        }
    });

    // --- CÁLCULOS AUTOMÁTICOS ---
    let wH = Math.min(panW, currentMaxGabs);
    let linhasPossiveis = Math.floor(currentMaxGabs / wH);
    let hH = Math.min(linhasPossiveis, panH);
    if (hH < 1) hH = 1;

    const cabosH = gerarMapeamento(panW, panH, wH, hH, currentMaxGabs);
    desenharMapeamento('canvas-largura', panW, panH, cabosH);
    gerarLegenda('legenda-largura', cabosH);
    updateUI('largura', cabosH.length, `Bloco: ${wH}x${hH}`, (wH * hH), limitSafe);

    let hV = Math.min(panH, currentMaxGabs);
    let colunasPossiveis = Math.floor(currentMaxGabs / hV);
    let wV = Math.min(colunasPossiveis, panW);
    if (wV < 1) wV = 1;

    const cabosV = gerarMapeamento(panW, panH, wV, hV, currentMaxGabs);
    desenharMapeamento('canvas-altura', panW, panH, cabosV);
    gerarLegenda('legenda-altura', cabosV);
    updateUI('altura', cabosV.length, `Bloco: ${wV}x${hV}`, (wV * hV), limitSafe);

    let melhorConfig = { cabos: Infinity, w: 1, h: 1, lista: [] };
    for (let w = 1; w <= panW && w <= currentMaxGabs; w++) {
        let h = Math.floor(currentMaxGabs / w);
        if (h > panH) h = panH;
        if (h >= 1) {
            const listaAtual = gerarMapeamento(panW, panH, w, h, currentMaxGabs);
            if (listaAtual.length < melhorConfig.cabos) {
                melhorConfig = { cabos: listaAtual.length, w: w, h: h, lista: listaAtual };
            } else if (listaAtual.length === melhorConfig.cabos) {
                let diffAtual = Math.abs(w - h);
                let diffMelhor = Math.abs(melhorConfig.w - melhorConfig.h);
                if (diffAtual < diffMelhor) {
                    melhorConfig = { cabos: listaAtual.length, w: w, h: h, lista: listaAtual };
                }
            }
        }
    }
    desenharMapeamento('canvas-area', panW, panH, melhorConfig.lista);
    gerarLegenda('legenda-area', melhorConfig.lista);
    updateUI('area', melhorConfig.cabos, `Sugestão: ${melhorConfig.w}x${melhorConfig.h}`, (melhorConfig.w * melhorConfig.h), limitSafe);

    select.selectedIndex = 0;
    atualizarManual();

    updatePhysicalStats();
}

function atualizarManual() {
    const val = document.getElementById('manualSelect').value;
    if (!val) return;
    const [w, h] = val.split('x').map(Number);
    const lista = gerarMapeamento(G_panW, G_panH, w, h, G_maxGabsAtual);
    desenharMapeamento('canvas-manual', G_panW, G_panH, lista);
    gerarLegenda('legenda-manual', lista);
    updateUI('manual', lista.length, `Personalizado: ${w}x${h}`, (w * h), G_limitSafe);
}

function updateUI(id, qtd, texto, usedGabs, limitSafe) {
    const badge = document.getElementById(`badge-${id}`);
    badge.classList.remove('warning');

    const isRisky = usedGabs > limitSafe;

    if (isRisky) {
        badge.classList.add('warning');
        badge.innerHTML = `⚠️ ${qtd} Cabos`;
    } else {
        badge.innerHTML = `${qtd} Cabos`;
    }

    document.getElementById(`txt-${id}`).innerText = texto;
}

function gerarMapeamento(totalW, totalH, blockW, blockH, maxGabs) {
    let cabos = [];
    let caboIndex = 0;
    const colsMain = Math.floor(totalW / blockW);
    const rowsMain = Math.floor(totalH / blockH);

    for (let r = 0; r < rowsMain; r++) {
        for (let c = 0; c < colsMain; c++) {
            cabos.push({ x: c * blockW, y: r * blockH, w: blockW, h: blockH, cor: getCor(caboIndex++) });
        }
    }
    const widthMain = colsMain * blockW;
    const heightMain = rowsMain * blockH;
    const restoW = totalW - widthMain;
    const restoH = totalH - heightMain;

    if (restoW > 0) fatiarZonaVertical(cabos, widthMain, 0, restoW, heightMain, maxGabs);
    if (restoH > 0) fatiarZonaHorizontal(cabos, 0, heightMain, totalW, restoH, maxGabs);

    cabos.forEach((c, i) => { if (!c.cor) c.cor = getCor(i); });
    return cabos;
}

function fatiarZonaVertical(listaCabos, startX, startY, w, totalH, maxGabs) {
    if (w === 0 || totalH === 0) return;
    const maxRowsPerCable = Math.floor(maxGabs / w);
    let yAtual = 0;
    while (yAtual < totalH) {
        let hBloco = Math.min(maxRowsPerCable, totalH - yAtual);
        listaCabos.push({ x: startX, y: startY + yAtual, w: w, h: hBloco, cor: null });
        yAtual += hBloco;
    }
}

function fatiarZonaHorizontal(listaCabos, startX, startY, totalW, h, maxGabs) {
    if (h === 0 || totalW === 0) return;
    const maxColsPerCable = Math.floor(maxGabs / h);
    let xAtual = 0;
    while (xAtual < totalW) {
        let wBloco = Math.min(maxColsPerCable, totalW - xAtual);
        listaCabos.push({ x: startX + xAtual, y: startY, w: wBloco, h: h, cor: null });
        xAtual += wBloco;
    }
}

function calculatePhysicalStats() {
    const screen = getActiveScreen();
    if (!screen) return null;

    const totalGabinetes = (screen.cabinetX || 0) * (screen.cabinetY || 0);
    const pesoTotal = totalGabinetes * (screen.peso || 0);
    const consumoTotal = totalGabinetes * (screen.consumo || 0);
    const voltagem = screen.voltagem || 220;
    const amperes = voltagem > 0 ? (consumoTotal / voltagem) : 0;

    return {
        totalGabinetes,
        pesoTotal: pesoTotal.toFixed(2),
        consumoTotal: consumoTotal.toFixed(2),
        amperes: amperes.toFixed(2),
        voltagem
    };
}

function updatePhysicalStats() {
    const stats = calculatePhysicalStats();
    if (!stats) return;

    const card = document.getElementById('physicalStatsCard');
    if (!card) {
        console.warn('⚠️ Card de estatísticas não encontrado no HTML');
        return;
    }

    if (Number(stats.pesoTotal) > 0 || Number(stats.consumoTotal) > 0) {
        card.style.display = 'block';

        document.getElementById('statTotalGabinetes').textContent = stats.totalGabinetes;
        document.getElementById('statPesoTotal').textContent = `${stats.pesoTotal} kg`;
        document.getElementById('statConsumoTotal').textContent = `${stats.consumoTotal} W`;
        document.getElementById('statAmperes').textContent = `${stats.amperes} A (${stats.voltagem}V)`;
    } else {
        card.style.display = 'none';
        document.getElementById('statTotalGabinetes').textContent = stats.totalGabinetes;
        document.getElementById('statPesoTotal').textContent = '0 kg';
        document.getElementById('statConsumoTotal').textContent = '0 W';
        document.getElementById('statAmperes').textContent = `0 A (${stats.voltagem}V)`;
    }

    updateGlobalSummary();
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

    const summaryElement = document.getElementById('globalSummary');
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
    PALETA_CORES,
    getCor,
    calcularTudo,
    atualizarManual,
    updateUI,
    gerarMapeamento,
    fatiarZonaVertical,
    fatiarZonaHorizontal,
    calculatePhysicalStats,
    updatePhysicalStats,
    updateGlobalSummary
};


