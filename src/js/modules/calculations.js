/**
 * CALCULATIONS MODULE
 * Lógica de cálculo de LED, configurações e mapeamentos
 * Responsável por: cálculos de blocos, limites, mapeamentos
 */

const MAX_PIXELS_PORTA = 655360;
const PALETA_CORES = [
    '#2563eb', '#22c55e', '#f97316', '#06b6d4', '#f43f5e', '#a855f7', '#eab308', '#0ea5e9',
    '#16a34a', '#fb7185', '#38bdf8', '#c084fc', '#f59e0b', '#84cc16', '#f472b6', '#475569',
    '#14b8a6', '#8b5cf6', '#ef4444', '#3b82f6'
];

// Globais para modo manual
let G_maxGabsAtual = 0;
let G_limitSafe = 0;
let G_panW = 0;
let G_panH = 0;
let lastCalculatedData = {};

/**
 * Retorna cor baseada no índice
 * @param {number} index - Índice da cor
 * @returns {string} Código hexadecimal da cor
 */
function getCor(index) {
    return PALETA_CORES[index % PALETA_CORES.length];
}

/**
 * Valida dimensões de entrada
 * @param {number} pxW, pxH, panW, panH - Dimensões
 * @returns {boolean} True se válido
 */
function validateInputs(pxW, pxH, panW, panH) {
    if (!pxW || !pxH || !panW || !panH) {
        alert("Preencha todos os campos.");
        return false;
    }
    if (pxW <= 0 || pxH <= 0 || panW <= 0 || panH <= 0) {
        alert("Valores devem ser maiores que zero.");
        return false;
    }
    return true;
}

/**
 * Calcula limites de gabinetes por porta
 * @param {number} pixelsPorGabinete - Pixels do gabinete
 * @param {boolean} isOverclock - Se modo overclock ativo
 * @returns {Object} {limitSafe, currentMaxGabs}
 */
function calculateLimits(pixelsPorGabinete, isOverclock) {
    const limitSafe = Math.floor(MAX_PIXELS_PORTA / pixelsPorGabinete);
    const currentMaxGabs = isOverclock 
        ? Math.ceil(MAX_PIXELS_PORTA / pixelsPorGabinete) 
        : limitSafe;
    
    if (currentMaxGabs < 1) {
        throw new Error("Gabinete maior que a capacidade da porta!");
    }
    
    return { limitSafe, currentMaxGabs };
}

/**
 * Gera mapeamento de gabinetes
 * @param {number} totalW, totalH - Dimensões totais
 * @param {number} blockW, blockH - Dimensões do bloco
 * @param {number} maxGabs - Máximo de gabinetes
 * @returns {Array} Lista de cabos
 */
function gerarMapeamento(totalW, totalH, blockW, blockH, maxGabs) {
    let listaCabos = [];
    
    const blocosW = Math.ceil(totalW / blockW);
    const blocosH = Math.ceil(totalH / blockH);
    
    for (let fila = 0; fila < blocosH; fila++) {
        for (let coluna = 0; coluna < blocosW; coluna++) {
            let gabinetesNesteCabo = 0;
            let x = coluna * blockW;
            let y = fila * blockH;
            
            let finalizarCabo = false;
            
            if (listaCabos.length > 0 && 
                listaCabos[listaCabos.length - 1].gabinetes >= maxGabs) {
                finalizarCabo = true;
            }
            
            if (finalizarCabo) {
                listaCabos.push({ gabinetes: 0 });
            }
            
            if (listaCabos.length === 0) {
                listaCabos.push({ gabinetes: 0 });
            }
            
            let ultimoCabo = listaCabos[listaCabos.length - 1];
            ultimoCabo.gabinetes += blockW * blockH;
        }
    }
    
    return listaCabos;
}

/**
 * Retorna quantidade de cabos necessários
 * @param {number} panW, panH - Dimensões
 * @param {number} blockW, blockH - Dimensões do bloco
 * @param {number} maxGabs - Máximo por cabo
 * @returns {number} Quantidade de cabos
 */
function getQtdCabos(panW, panH, blockW, blockH, maxGabs) {
    let totalGabs = panW * panH;
    let gabsPorCabo = blockW * blockH;
    return Math.ceil(totalGabs / (maxGabs >= gabsPorCabo ? maxGabs : gabsPorCabo));
}

/**
 * Fatiador vertical de zonas
 * @param {Array} listaCabos - Lista de cabos
 * @param {number} startX, startY - Posição inicial
 * @param {number} w, totalH - Dimensões
 * @param {number} maxGabs - Máximo de gabinetes
 */
function fatiarZonaVertical(listaCabos, startX, startY, w, totalH, maxGabs) {
    let y = 0;
    while (y < totalH) {
        let h = Math.min(maxGabs / w, totalH - y);
        if (h < 1) h = 1;
        y += h;
    }
}

/**
 * Fatiador horizontal de zonas
 * @param {Array} listaCabos - Lista de cabos
 * @param {number} startX, startY - Posição inicial
 * @param {number} totalW, h - Dimensões
 * @param {number} maxGabs - Máximo de gabinetes
 */
function fatiarZonaHorizontal(listaCabos, startX, startY, totalW, h, maxGabs) {
    let x = 0;
    while (x < totalW) {
        let w = Math.min(maxGabs / h, totalW - x);
        if (w < 1) w = 1;
        x += w;
    }
}
