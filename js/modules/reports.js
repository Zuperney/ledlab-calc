import { currentProject, setActiveScreen } from './state.js';
import { calcularTudo, calculatePhysicalStats } from './calculations.js';

export function generateProjectReport() {
    const w = window.open('', 'LedLab Report');
    if (!w) {
        alert('Não foi possível abrir a janela de relatório. Verifique bloqueadores de pop-up.');
        return;
    }
    const style = `
        <style>
        body { font-family: Segoe UI, Arial, sans-serif; margin: 20px; color: #111; }
        .header { display:flex; justify-content: space-between; align-items:center; }
        .title { font-size: 22px; font-weight: 700; }
        .actions { display:flex; gap:10px; }
        .btn { padding:8px 12px; border:1px solid #ccc; background:#f8f8f8; cursor:pointer; border-radius:6px; }
        .screen { margin-top: 20px; border-top:1px solid #ddd; padding-top: 16px; }
        .grid { display:grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap:16px; }
        .card { border:1px solid #ddd; border-radius:8px; padding:12px; background:#fff; }
        .card h4 { margin:0 0 8px 0; font-size:16px; }
        .kv { display:flex; justify-content:space-between; margin:4px 0; }
        .canvas-img { width:100%; border:1px solid #eee; border-radius:6px; }
        @media print { .actions { display:none; } body { margin:0; } .screen { page-break-inside: avoid; } }
        </style>
    `;

    let html = `<html><head><meta charset="utf-8">${style}</head><body>`;
    html += `<div class="header"><div class="title">LedLab Relatório</div><div class="actions"><button class="btn" id="printBtn">Salvar PDF / Imprimir</button></div></div>`;

    const prevIndex = currentProject.activeScreenIndex;

    const indexedScreens = currentProject.screens.map((s, idx) => ({ s, idx }));
    const validScreens = indexedScreens.filter(({ s }) => {
        const hasPixels = (s.pixelX || 0) > 0 && (s.pixelY || 0) > 0;
        const hasGabs = (s.cabinetX || 0) > 0 && (s.cabinetY || 0) > 0;
        return hasPixels && hasGabs;
    });

    if (validScreens.length === 0) {
        alert('Nenhuma tela com dados válidos para o relatório. Preencha pixels e gabinetes.');
        w.close();
        return;
    }

    const start = validScreens.find(v => v.idx === prevIndex);
    const rest = validScreens.filter(v => v.idx !== prevIndex);
    const orderedScreens = start ? [start, ...rest] : validScreens;

    for (const { s: screen, idx: i } of orderedScreens) {
        setActiveScreen(i);
        calcularTudo();
        const stats = calculatePhysicalStats();

        const imgOf = (id) => {
            const c = document.getElementById(id);
            return (c && c.toDataURL) ? `<img class="canvas-img" src="${c.toDataURL()}" alt="${id}">` : `<div class="card">Canvas ${id} indisponível</div>`;
        };

        html += `<div class="screen">`;
        html += `<h3>Tela ${i + 1}: ${screen.name}</h3>`;
        html += `<div class="grid">`;
        html += `<div class="card"><h4>Resumo Técnico</h4>
                   <div class="kv"><span>Pixels:</span><span>${screen.pixelX} x ${screen.pixelY}</span></div>
                   <div class="kv"><span>Gabinetes:</span><span>${screen.cabinetX} x ${screen.cabinetY} (${(screen.cabinetX || 0) * (screen.cabinetY || 0)})</span></div>
                   <div class="kv"><span>Peso unitário:</span><span>${(screen.peso || 0)} kg</span></div>
                   <div class="kv"><span>Consumo unitário:</span><span>${(screen.consumo || 0)} W</span></div>
                   <div class="kv"><span>Voltagem:</span><span>${(screen.voltagem || 220)} V</span></div>
                   <div class="kv"><span>Peso total:</span><span>${stats.pesoTotal} kg</span></div>
                   <div class="kv"><span>Consumo total:</span><span>${stats.consumoTotal} W</span></div>
                   <div class="kv"><span>Amperes estimados:</span><span>${stats.amperes} A</span></div>
                 </div>`;

        html += `<div class="card"><h4>Prioridade Horizontal</h4>${imgOf('canvas-largura')}</div>`;
        html += `<div class="card"><h4>Prioridade Vertical</h4>${imgOf('canvas-altura')}</div>`;
        html += `<div class="card"><h4>Melhor Área</h4>${imgOf('canvas-area')}</div>`;
        html += `<div class="card"><h4>Layout Manual</h4>${imgOf('canvas-manual')}</div>`;
        html += `</div>`;
        html += `</div>`;
    }

    setActiveScreen(prevIndex);

    html += `</body></html>`;
    w.document.open();
    w.document.write(html);
    w.document.close();

    // Add print button listener in the new window
    w.addEventListener('load', () => {
        const printBtn = w.document.getElementById('printBtn');
        if (printBtn) {
            printBtn.addEventListener('click', () => w.print());
        }
    });
}
