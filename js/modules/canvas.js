import { getActiveScreen } from './state.js';
import { getCor } from './calculations.js';

function gerarLegenda(containerId, listaCabos) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    listaCabos.forEach((cabo, index) => {
        const cor = cabo.cor ? cabo.cor : getCor(index);
        const numeroCabo = index + 1;
        const item = document.createElement('div');
        item.className = 'legenda-item';
        const dot = document.createElement('div');
        dot.className = 'color-dot';
        dot.style.backgroundColor = cor;
        const text = document.createElement('span');
        text.innerText = `Cabo ${numeroCabo}`;
        item.appendChild(dot);
        item.appendChild(text);
        container.appendChild(item);
    });
}

function desenharMapeamento(canvasId, totalW, totalH, listaCabos) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    const SIZE = 25;
    const GAP = 1;

    canvas.width = totalW * SIZE;
    canvas.height = totalH * SIZE;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    listaCabos.forEach((cabo, index) => {
        let corFinal = cabo.cor ? cabo.cor : getCor(index);
        ctx.fillStyle = corFinal;
        for (let i = 0; i < cabo.h; i++) {
            for (let j = 0; j < cabo.w; j++) {
                const drawX = (cabo.x + j) * SIZE;
                const drawY = (cabo.y + i) * SIZE;
                ctx.fillRect(drawX + GAP, drawY + GAP, SIZE - (GAP * 2), SIZE - (GAP * 2));
            }
        }
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.strokeRect((cabo.x * SIZE), (cabo.y * SIZE), (cabo.w * SIZE), (cabo.h * SIZE));

        const centerX = (cabo.x + cabo.w / 2) * SIZE;
        const centerY = (cabo.y + cabo.h / 2) * SIZE;
        const numeroBloco = (index % 20) + 1;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(numeroBloco, centerX, centerY);

        const activeScreen = getActiveScreen();
        const layout = (activeScreen && activeScreen.layoutType) || 'horizontal';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();

        if (layout === 'horizontal') {
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
    });
}

export { gerarLegenda, desenharMapeamento };

