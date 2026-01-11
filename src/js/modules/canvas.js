/**
 * CANVAS MODULE
 * Desenho e renderização visual no canvas
 * Responsável por: desenho de blocos, cabeamento, legenda
 */

const SIZE = 25;
const GAP = 1;

/**
 * Desenha mapeamento de gabinetes no canvas
 * @param {string} canvasId - ID do canvas
 * @param {number} totalW, totalH - Dimensões totais
 * @param {Array} listaCabos - Lista de cabos para desenhar
 */
function desenharMapeamento(canvasId, totalW, totalH, listaCabos) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = totalW * SIZE;
    canvas.height = totalH * SIZE;
    
    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Desenhar cada cabo
    listaCabos.forEach((cabo, index) => {
        drawCable(ctx, cabo, index, totalW, totalH);
    });
}

/**
 * Desenha um cabo individual com seus blocos
 * @param {CanvasRenderingContext2D} ctx - Contexto do canvas
 * @param {Object} cabo - Objeto do cabo
 * @param {number} index - Índice do cabo
 * @param {number} totalW, totalH - Dimensões totais
 */
function drawCable(ctx, cabo, index, totalW, totalH) {
    // Fallback para cor padrão se getCor não estiver disponível
    const corFinal = cabo.cor ? cabo.cor : (typeof getCor === 'function' ? getCor(index) : '#2563eb');
    
    // Desenhar blocos coloridos
    ctx.fillStyle = corFinal;
    for (let i = 0; i < cabo.h; i++) {
        for (let j = 0; j < cabo.w; j++) {
            const drawX = (cabo.x + j) * SIZE;
            const drawY = (cabo.y + i) * SIZE;
            ctx.fillRect(drawX + GAP, drawY + GAP, SIZE - (GAP * 2), SIZE - (GAP * 2));
        }
    }

    // Desenhar borda do bloco
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect((cabo.x * SIZE), (cabo.y * SIZE), (cabo.w * SIZE), (cabo.h * SIZE));

    // Desenhar número do bloco no centro
    drawBlockNumber(ctx, cabo, index);

    // Desenhar linhas de cabeamento
    const layoutType = (typeof getActiveScreen === 'function' && getActiveScreen()) 
        ? getActiveScreen().layoutType || 'horizontal' 
        : 'horizontal';
    drawCabingPath(ctx, cabo, layoutType);
}

/**
 * Desenha número do bloco
 * @param {CanvasRenderingContext2D} ctx - Contexto do canvas
 * @param {Object} cabo - Objeto do cabo
 * @param {number} index - Índice do cabo
 */
function drawBlockNumber(ctx, cabo, index) {
    const centerX = (cabo.x + cabo.w / 2) * SIZE;
    const centerY = (cabo.y + cabo.h / 2) * SIZE;
    const numeroBloco = (index % 20) + 1;

    // Badge de fundo
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.beginPath();
    ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
    ctx.fill();

    // Texto do número
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 12px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(numeroBloco, centerX, centerY);
}

/**
 * Desenha caminho de cabeamento (Z-Type ou U-Type)
 * @param {CanvasRenderingContext2D} ctx - Contexto do canvas
 * @param {Object} cabo - Objeto do cabo
 * @param {string} layoutType - 'horizontal' ou 'vertical'
 */
function drawCabingPath(ctx, cabo, layoutType) {
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();

    if (layoutType === 'horizontal') {
        // Z-Type: varre linha por linha
        for (let i = 0; i < cabo.h; i++) {
            const rowY = cabo.y + i;
            const forward = i % 2 === 0;
            
            if (forward) {
                for (let j = 0; j < cabo.w; j++) {
                    const colX = cabo.x + j;
                    const cx = colX * SIZE + SIZE / 2;
                    const cy = rowY * SIZE + SIZE / 2;
                    if (j === 0 && i === 0) ctx.moveTo(cx, cy);
                    else ctx.lineTo(cx, cy);
                }
            } else {
                for (let j = cabo.w - 1; j >= 0; j--) {
                    const colX = cabo.x + j;
                    const cx = colX * SIZE + SIZE / 2;
                    const cy = rowY * SIZE + SIZE / 2;
                    ctx.lineTo(cx, cy);
                }
            }
        }
    } else {
        // U-Type: varre coluna por coluna
        for (let j = 0; j < cabo.w; j++) {
            const colX = cabo.x + j;
            const downward = j % 2 === 0;
            
            if (downward) {
                for (let i = 0; i < cabo.h; i++) {
                    const rowY = cabo.y + i;
                    const cx = colX * SIZE + SIZE / 2;
                    const cy = rowY * SIZE + SIZE / 2;
                    if (j === 0 && i === 0) ctx.moveTo(cx, cy);
                    else ctx.lineTo(cx, cy);
                }
            } else {
                for (let i = cabo.h - 1; i >= 0; i--) {
                    const rowY = cabo.y + i;
                    const cx = colX * SIZE + SIZE / 2;
                    const cy = rowY * SIZE + SIZE / 2;
                    ctx.lineTo(cx, cy);
                }
            }
        }
    }

    ctx.stroke();
}

/**
 * Redesenha todos os canvas sem recalcular
 */
function redrawAllCanvas() {
    if (!lastCalculatedData.cabosH) return;
    
    desenharMapeamento('canvas-largura', lastCalculatedData.panW, lastCalculatedData.panH, lastCalculatedData.cabosH);
    desenharMapeamento('canvas-altura', lastCalculatedData.panW, lastCalculatedData.panH, lastCalculatedData.cabosV);
    desenharMapeamento('canvas-area', lastCalculatedData.panW, lastCalculatedData.panH, lastCalculatedData.melhorConfig.lista);
}

/**
 * Gera legenda de cabos
 * @param {string} containerId - ID do container
 * @param {Array} listaCabos - Lista de cabos
 */
function gerarLegenda(containerId, listaCabos) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    listaCabos.forEach((cabo, index) => {
        const item = document.createElement('div');
        item.style.marginBottom = '8px';
        // Fallback para cor padrão se getCor não estiver disponível
        const cor = typeof getCor === 'function' ? getCor(index) : '#2563eb';
        item.innerHTML = `
            <span style="display: inline-block; width: 16px; height: 16px; background: ${cor}; margin-right: 8px; border-radius: 2px; border: 1px solid #ccc;"></span>
            <strong>Cabo ${index + 1}:</strong> ${cabo.gabinetes || 0} gabinetes
        `;
        container.appendChild(item);
    });
}
