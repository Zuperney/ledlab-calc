const PALETA_CORES = [
    '#2563eb', '#22c55e', '#f97316', '#06b6d4', '#f43f5e', '#a855f7', '#eab308', '#0ea5e9',
    '#16a34a', '#fb7185', '#38bdf8', '#c084fc', '#f59e0b', '#84cc16', '#f472b6', '#475569',
    '#14b8a6', '#8b5cf6', '#ef4444', '#3b82f6'
];

const THEME_KEY = 'ledlab-theme';
const STORAGE_KEY = 'ledlab-gabinetes';

function getCor(index) { return PALETA_CORES[index % PALETA_CORES.length]; }

// ===== ESTRUTURA DE PROJETO (FASE 1) =====
// Estrutura de uma tela padrão
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
        layoutType: 'horizontal', // 'horizontal' ou 'vertical'
        manualLayout: null, // Para modo manual
        results: {} // Armazena resultados de cálculos anteriores
    };
}

// Projeto global
let currentProject = {
    id: Date.now(),
    name: 'Novo Projeto',
    createdAt: new Date().toISOString(),
    screens: [],
    activeScreenIndex: 0
};

// Função para adicionar uma nova tela
function addScreen(name = null) {
    const newScreen = createDefaultScreen(name);
    currentProject.screens.push(newScreen);
    setActiveScreen(currentProject.screens.length - 1);
    console.log(`✅ Tela "${newScreen.name}" adicionada. Total: ${currentProject.screens.length}`);
    return newScreen;
}

// Função para ativar uma tela
function setActiveScreen(index) {
    if (index >= 0 && index < currentProject.screens.length) {
        currentProject.activeScreenIndex = index;
        console.log(`✅ Tela ativa: "${currentProject.screens[index].name}" (índice ${index})`);
        loadScreenToUI(index);
        return true;
    }
    console.error(`❌ Índice de tela inválido: ${index}`);
    return false;
}

// Função para obter a tela ativa
function getActiveScreen() {
    return currentProject.screens[currentProject.activeScreenIndex];
}

// Função para carregar dados da tela para a interface
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
    
    console.log(`📥 Tela "${screen.name}" carregada na interface`);
}

// Globais para modo manual
let G_maxGabsAtual = 0;
let G_limitSafe = 0;
let G_panW = 0;
let G_panH = 0;

// Initialize after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar projeto com uma tela padrão
    if (currentProject.screens.length === 0) {
        addScreen('Tela 1');
    } else {
        setActiveScreen(0);
    }
    
    const calculateButton = document.getElementById('calculateButton');
    const manualSelect = document.getElementById('manualSelect');

    if (calculateButton) calculateButton.addEventListener('click', calcularTudo);
    if (manualSelect) manualSelect.addEventListener('change', atualizarManual);

    initTheme();
    initTabs();
    initNavigation();
    initGabineteSystem();
    initScreensUI();
    renderScreenList();
    initInputPersistence();
    initMobileMenu(); // Mobile menu initialization
});

function calcularTudo() {
    const pxW = parseInt(document.getElementById('pixelX').value) || 0;
    const pxH = parseInt(document.getElementById('pixelY').value) || 0;
    const panW = parseInt(document.getElementById('cabinetX').value) || 0;
    const panH = parseInt(document.getElementById('cabinetY').value) || 0;
    const isOverclockEnabled = document.getElementById('overclockMode').checked;

    if (!pxW || !pxH || !panW || !panH) { alert("Preencha todos os campos."); return; }

    // ===== SALVAR DADOS NA TELA ATIVA =====
    const activeScreen = getActiveScreen();
    if (activeScreen) {
        activeScreen.pixelX = pxW;
        activeScreen.pixelY = pxH;
        activeScreen.cabinetX = panW;
        activeScreen.cabinetY = panH;
        activeScreen.overclockMode = isOverclockEnabled;
        console.log(`💾 Dados salvos na tela "${activeScreen.name}"`);
    }

    const MAX_PIXELS_PORTA = 655360;
    const pixelsPorGabinete = pxW * pxH;
    
    // --- CÁLCULO DOS LIMITES ---
    // Limite Seguro (Sempre Math.floor) - Usado para saber se ficou Laranja ou Verde
    const limitSafe = Math.floor(MAX_PIXELS_PORTA / pixelsPorGabinete);
    
    // Limite Atual (Depende do Checkbox) - Usado para calcular o layout
    let currentMaxGabs;
    if (isOverclockEnabled) {
        currentMaxGabs = Math.ceil(MAX_PIXELS_PORTA / pixelsPorGabinete);
    } else {
        currentMaxGabs = limitSafe;
    }

    if (currentMaxGabs < 1) { alert("Erro: Gabinete maior que a capacidade da porta!"); return; }

    // Atualiza globais
    G_maxGabsAtual = currentMaxGabs;
    G_limitSafe = limitSafe;
    G_panW = panW;
    G_panH = panH;

    // --- POPULAR SELECT MANUAL ---
    const select = document.getElementById('manualSelect');
    select.innerHTML = "";
    let opcoes = [];
    // Gera opções baseadas no limite ATUAL (se overclock ligado, aparecem opções maiores)
    for(let w = 1; w <= currentMaxGabs && w <= panW; w++) {
        let h = Math.floor(currentMaxGabs / w);
        let hReal = (h > panH) ? panH : h;
        if(hReal >= 1) opcoes.push({ w: w, h: hReal, area: w * hReal });
    }
    opcoes.sort((a, b) => b.area - a.area);
    
    let unicos = new Set();
    opcoes.forEach(op => {
        const key = `${op.w}x${op.h}`;
        if(!unicos.has(key)) {
            unicos.add(key);
            let option = document.createElement("option");
            option.value = key;
            // Se essa opção específica for perigosa, marcamos visualmente no texto
            const isRisky = (op.area > limitSafe);
            const icon = isRisky ? "⚠️ " : "";
            option.text = `${icon}Bloco ${op.w}x${op.h} (${op.area} gabs)`;
            select.appendChild(option);
        }
    });

    // --- CÁLCULOS AUTOMÁTICOS ---

    // 1. Horizontal
    let wH = Math.min(panW, currentMaxGabs);
    let linhasPossiveis = Math.floor(currentMaxGabs / wH);
    let hH = Math.min(linhasPossiveis, panH);
    if (hH < 1) hH = 1;
    
    const cabosH = gerarMapeamento(panW, panH, wH, hH, currentMaxGabs);
    desenharMapeamento('canvas-largura', panW, panH, cabosH);
    gerarLegenda('legenda-largura', cabosH);
    // Verifica se ESSA configuração específica (wH * hH) ultrapassa o limite seguro
    updateUI('largura', cabosH.length, `Bloco: ${wH}x${hH}`, (wH * hH), limitSafe);

    // 2. Vertical
    let hV = Math.min(panH, currentMaxGabs);
    let colunasPossiveis = Math.floor(currentMaxGabs / hV);
    let wV = Math.min(colunasPossiveis, panW);
    if (wV < 1) wV = 1;

    const cabosV = gerarMapeamento(panW, panH, wV, hV, currentMaxGabs);
    desenharMapeamento('canvas-altura', panW, panH, cabosV);
    gerarLegenda('legenda-altura', cabosV);
    updateUI('altura', cabosV.length, `Bloco: ${wV}x${hV}`, (wV * hV), limitSafe);

    // 3. Inteligente
    let melhorConfig = { cabos: Infinity, w: 1, h: 1, lista: [] };
    for(let w = 1; w <= panW && w <= currentMaxGabs; w++) {
        let h = Math.floor(currentMaxGabs / w);
        if(h > panH) h = panH;
        if(h >= 1) {
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

    // Inicializa manual
    select.selectedIndex = 0;
    atualizarManual();
    
    // FASE 2: Atualizar estatísticas físicas
    updatePhysicalStats();
}

function atualizarManual() {
    const val = document.getElementById('manualSelect').value;
    if(!val) return;
    const [w, h] = val.split('x').map(Number);
    const lista = gerarMapeamento(G_panW, G_panH, w, h, G_maxGabsAtual);
    desenharMapeamento('canvas-manual', G_panW, G_panH, lista);
    gerarLegenda('legenda-manual', lista);
    updateUI('manual', lista.length, `Personalizado: ${w}x${h}`, (w * h), G_limitSafe);
}

// --- NOVA LÓGICA DE UI ---
// Recebe o total de gabinetes usados no bloco (usedGabs) e o limite seguro (limitSafe)
function updateUI(id, qtd, texto, usedGabs, limitSafe) {
    const badge = document.getElementById(`badge-${id}`);
    badge.classList.remove('warning');
    
    // Só fica laranja se o uso real for maior que o limite seguro
    const isRisky = usedGabs > limitSafe;

    if(isRisky) {
        badge.classList.add('warning');
        badge.innerHTML = `⚠️ ${qtd} Cabos`;
    } else {
        badge.innerHTML = `${qtd} Cabos`;
    }
    
    document.getElementById(`txt-${id}`).innerText = texto;
}

// --- FUNÇÕES DE DESENHO (MANTIDAS) ---
function gerarLegenda(containerId, listaCabos) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    listaCabos.forEach((cabo, index) => {
        const cor = cabo.cor ? cabo.cor : getCor(index);
        const numeroCabo = index + 1;
        const item = document.createElement("div");
        item.className = "legenda-item";
        const dot = document.createElement("div");
        dot.className = "color-dot";
        dot.style.backgroundColor = cor;
        const text = document.createElement("span");
        text.innerText = `Cabo ${numeroCabo}`;
        item.appendChild(dot);
        item.appendChild(text);
        container.appendChild(item);
    });
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

    cabos.forEach((c, i) => { if(!c.cor) c.cor = getCor(i); });
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

function desenharMapeamento(canvasId, totalW, totalH, listaCabos) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    const SIZE = 25; 
    const GAP = 1;   

    canvas.width = totalW * SIZE;
    canvas.height = totalH * SIZE;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0,0, canvas.width, canvas.height);

    listaCabos.forEach((cabo, index) => {
        let corFinal = cabo.cor ? cabo.cor : getCor(index);
        ctx.fillStyle = corFinal;
        for(let i = 0; i < cabo.h; i++) {
            for(let j = 0; j < cabo.w; j++) {
                const drawX = (cabo.x + j) * SIZE;
                const drawY = (cabo.y + i) * SIZE;
                ctx.fillRect(drawX + GAP, drawY + GAP, SIZE - (GAP*2), SIZE - (GAP*2));
            }
        }
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.strokeRect((cabo.x * SIZE), (cabo.y * SIZE), (cabo.w * SIZE), (cabo.h * SIZE));
        
        // Desenhar número do bloco no centro
        const centerX = (cabo.x + cabo.w / 2) * SIZE;
        const centerY = (cabo.y + cabo.h / 2) * SIZE;
        const numeroBloco = (index % 20) + 1; // Números de 1 a 20
        
        // Desenhar badge com número
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

        // Desenhar linhas de cabeamento conforme layoutType
        const activeScreen = getActiveScreen();
        const layout = (activeScreen && activeScreen.layoutType) || 'horizontal';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();

        if (layout === 'horizontal') {
            // Z-Type: varre linha por linha
            for (let i = 0; i < cabo.h; i++) {
                const rowY = cabo.y + i;
                const forward = i % 2 === 0; // linhas pares esquerda->direita
                if (forward) {
                    for (let j = 0; j < cabo.w; j++) {
                        const colX = cabo.x + j;
                        const cx = colX * SIZE + SIZE/2;
                        const cy = rowY * SIZE + SIZE/2;
                        if (j === 0 && i === 0) ctx.moveTo(cx, cy);
                        else ctx.lineTo(cx, cy);
                    }
                } else {
                    for (let j = cabo.w - 1; j >= 0; j--) {
                        const colX = cabo.x + j;
                        const cx = colX * SIZE + SIZE/2;
                        const cy = rowY * SIZE + SIZE/2;
                        ctx.lineTo(cx, cy);
                    }
                }
            }
        } else {
            // U-Type Vertical: varre coluna por coluna
            for (let j = 0; j < cabo.w; j++) {
                const colX = cabo.x + j;
                const downward = j % 2 === 0; // colunas pares cima->baixo
                if (downward) {
                    for (let i = 0; i < cabo.h; i++) {
                        const rowY = cabo.y + i;
                        const cx = colX * SIZE + SIZE/2;
                        const cy = rowY * SIZE + SIZE/2;
                        if (j === 0 && i === 0) ctx.moveTo(cx, cy);
                        else ctx.lineTo(cx, cy);
                    }
                } else {
                    for (let i = cabo.h - 1; i >= 0; i--) {
                        const rowY = cabo.y + i;
                        const cx = colX * SIZE + SIZE/2;
                        const cy = rowY * SIZE + SIZE/2;
                        ctx.lineTo(cx, cy);
                    }
                }
            }
        }

        ctx.stroke();
    });
}

function initTabs() {
    const buttons = Array.from(document.querySelectorAll('.tab-button'));
    const panels = Array.from(document.querySelectorAll('.tab-panel'));
    if (!buttons.length || !panels.length) return;
    const activate = (targetId) => {
        buttons.forEach(btn => btn.classList.toggle('active', btn.dataset.target === targetId));
        panels.forEach(panel => panel.classList.toggle('active', panel.id === targetId));
    };
    buttons.forEach(btn => {
        btn.addEventListener('click', () => activate(btn.dataset.target));
    });
}

// ===== NAVIGATION SYSTEM =====
function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-button[data-page]');
    const pages = document.querySelectorAll('.page-content');
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetPage = btn.dataset.page;
            navButtons.forEach(b => b.classList.remove('active'));
            pages.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(`page-${targetPage}`).classList.add('active');
        });
    });
}

// ===== GABINETE MANAGEMENT SYSTEM =====
function initGabineteSystem() {
    const form = document.getElementById('formGabinete');
    const gabineteSalvo = document.getElementById('gabineteSalvo');
    
    if (form) {
        form.addEventListener('submit', salvarGabinete);
    }
    
    if (gabineteSalvo) {
        populateGabineteSelector();
        gabineteSalvo.addEventListener('change', loadGabineteData);
    }
    
    updateGabineteList();
}

function salvarGabinete(e) {
    e.preventDefault();
    
    const fabricante = document.getElementById('fabricante').value.toUpperCase().trim();
    const nomeGabinete = document.getElementById('nome_gabinete').value.trim();
    
    // Validar se o nome do fabricante está no nome do gabinete
    if (nomeGabinete.toUpperCase().includes(fabricante)) {
        alert('⚠️ Coloque somente o nome do gabinete, sem o nome do fabricante.');
        return;
    }
    
    const gabinete = {
        id: Date.now(),
        fabricante: fabricante,
        nome: nomeGabinete,
        pixel_w: parseInt(document.getElementById('pixel_w').value),
        pixel_h: parseInt(document.getElementById('pixel_h').value),
        mm_w: parseFloat(document.getElementById('mm_w').value),
        mm_h: parseFloat(document.getElementById('mm_h').value),
        peso: parseFloat(document.getElementById('peso').value) || null,
        consumo: parseInt(document.getElementById('consumo').value) || null,
        ambiente: document.querySelector('input[name="ambiente"]:checked').value,
        pixel_pitch: parseFloat(document.getElementById('pixel_pitch').value) || null,
        nits: parseInt(document.getElementById('nits').value) || null,
        refresh_rate: parseInt(document.getElementById('refresh_rate').value) || null,
        ip_rating: document.getElementById('ip_rating').value || null
    };
    
    const gabinetes = getGabinetes();
    gabinetes.push(gabinete);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gabinetes));
    
    alert(`✅ Gabinete "${gabinete.nome}" salvo com sucesso!`);
    e.target.reset();
    updateGabineteList();
    populateGabineteSelector();
}

function getGabinetes() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

function deleteGabinete(id) {
    if (!confirm('Tem certeza que deseja excluir este gabinete?')) return;
    
    const gabinetes = getGabinetes().filter(g => g.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gabinetes));
    updateGabineteList();
    populateGabineteSelector();
}

function updateGabineteList() {
    const container = document.getElementById('listaGabinetes');
    if (!container) return;
    
    const gabinetes = getGabinetes();
    
    if (gabinetes.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--muted); padding: 40px;">Nenhum gabinete cadastrado ainda.</p>';
        return;
    }
    
    container.innerHTML = gabinetes.map(g => `
        <div class="gabinete-item">
            <div class="gabinete-info">
                <h3><strong>${g.fabricante}</strong> - ${g.nome}</h3>
                <div class="gabinete-specs">
                    <span>📐 ${g.pixel_w}x${g.pixel_h} pixels</span>
                    <span>📏 ${g.mm_w}x${g.mm_h} mm</span>
                    ${g.pixel_pitch ? `<span>🔍 P${g.pixel_pitch}</span>` : ''}
                    ${g.ambiente ? `<span>${g.ambiente === 'indoor' ? '🏠 Indoor' : '🌤️ Outdoor'}</span>` : ''}
                </div>
            </div>
            <div class="gabinete-actions">
                <button onclick="loadGabineteToConfigurator(${g.id})">Usar</button>
                <button class="btn-delete" onclick="deleteGabinete(${g.id})">Excluir</button>
            </div>
        </div>
    `).join('');
}

function populateGabineteSelector() {
    const select = document.getElementById('gabineteSalvo');
    if (!select) return;
    
    const gabinetes = getGabinetes();
    select.innerHTML = '<option value="">Selecione ou use valores personalizados</option>';
    
    gabinetes.forEach(g => {
        const option = document.createElement('option');
        option.value = g.id;
        option.textContent = `${g.fabricante} - ${g.nome} (${g.pixel_w}x${g.pixel_h})`;
        select.appendChild(option);
    });
}

function loadGabineteData() {
    const select = document.getElementById('gabineteSalvo');
    const id = parseInt(select.value);
    if (!id) return;
    
    const gabinete = getGabinetes().find(g => g.id === id);
    if (!gabinete) return;
    
    // Carregar dimensões básicas no UI
    document.getElementById('pixelX').value = gabinete.pixel_w;
    document.getElementById('pixelY').value = gabinete.pixel_h;

    // FASE 2: Carregar dados físicos na tela ativa
    const screen = getActiveScreen();
    if (screen) {
        screen.peso = parseFloat(gabinete.peso) || 0;
        screen.consumo = parseFloat(gabinete.consumo) || 0;
        screen.voltagem = parseFloat(gabinete.voltagem) || 220;
        console.log(`📦 Dados físicos carregados: peso=${screen.peso}kg, consumo=${screen.consumo}W, V=${screen.voltagem}`);
        updatePhysicalStats();
    }
}

function loadGabineteToConfigurator(id) {
    const gabinete = getGabinetes().find(g => g.id === id);
    if (!gabinete) return;
    
    // Switch to configurator page
    document.querySelectorAll('.nav-button[data-page]').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
    document.querySelector('.nav-button[data-page="configurator"]').classList.add('active');
    document.getElementById('page-configurator').classList.add('active');
    
    // Load data
    const select = document.getElementById('gabineteSalvo');
    if (select) select.value = id;
    document.getElementById('pixelX').value = gabinete.pixel_w;
    document.getElementById('pixelY').value = gabinete.pixel_h;
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = saved || (prefersDark ? 'dark' : 'light');
    applyTheme(initial);
    
    // Apply theme classes to html element for better CSS selector support
    document.documentElement.classList.add(initial);
    
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
        toggle.addEventListener('click', () => {
            const current = document.body.dataset.theme || (prefersDark ? 'dark' : 'light');
            const next = current === 'dark' ? 'light' : 'dark';
            applyTheme(next);
        });
        
        // Listen for system theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
                if (!localStorage.getItem(THEME_KEY)) {
                    applyTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }
}

function applyTheme(theme) {
    // Remove all theme classes
    document.documentElement.classList.remove('light', 'dark');
    document.body.classList.remove('light', 'dark');
    
    // Add new theme class
    document.documentElement.classList.add(theme);
    document.body.classList.add(theme);
    document.body.dataset.theme = theme;
    
    // Store preference
    localStorage.setItem(THEME_KEY, theme);
    
    // Update toggle button text
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
        toggle.innerHTML = theme === 'dark' ? 
            '<span class="theme-icon">☀️</span>' : 
            '<span class="theme-icon">🌙</span>';
        toggle.title = theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro';
    }
    
    // Trigger any custom theme change events
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
}// ===== RENDERIZAÇÃO DE LISTA DE TELAS (FASE 1.2) =====
function renderScreenList() {
    const list = document.getElementById('screensList');
    if (!list) return;
    
    list.innerHTML = '';
    
    currentProject.screens.forEach((screen, index) => {
        const item = document.createElement('div');
        item.className = `screen-item ${index === currentProject.activeScreenIndex ? 'active' : ''}`;
        
        item.innerHTML = `
            <span class="screen-item-name">${screen.name}</span>
            <button class="screen-item-delete" title="Deletar">✕</button>
        `;
        
        // Clique no item para ativar
        item.addEventListener('click', (e) => {
            if (e.target.classList.contains('screen-item-delete')) return;
            setActiveScreen(index);
            renderScreenList();
        });
        
        // Clique no botão de deletar
        const deleteBtn = item.querySelector('.screen-item-delete');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentProject.screens.length === 1) {
                alert('⚠️ Você precisa ter pelo menos uma tela!');
                return;
            }
            if (confirm(`Tem certeza que deseja deletar "${screen.name}"?`)) {
                currentProject.screens.splice(index, 1);
                // Reajusta índice ativo se necessário
                if (currentProject.activeScreenIndex >= currentProject.screens.length) {
                    currentProject.activeScreenIndex = currentProject.screens.length - 1;
                }
                console.log(`🗑️ Tela "${screen.name}" deletada`);
                setActiveScreen(currentProject.activeScreenIndex);
                renderScreenList();
            }
        });
        
        list.appendChild(item);
    });
}

// Inicializar eventos de telas no DOM ready
function initScreensUI() {
    const addScreenBtn = document.getElementById('addScreenBtn');
    if (addScreenBtn) {
        addScreenBtn.addEventListener('click', () => {
            addScreen();
            renderScreenList();
        });
    }

    const reportBtn = document.getElementById('reportBtn');
    if (reportBtn) {
        reportBtn.addEventListener('click', () => {
            generateProjectReport();
        });
    }
}

// ===== PERSISTÊNCIA AUTOMÁTICA DE DADOS (FASE 1.4) =====
function initInputPersistence() {
    const inputs = [
        { id: 'pixelX', field: 'pixelX' },
        { id: 'pixelY', field: 'pixelY' },
        { id: 'cabinetX', field: 'cabinetX' },
        { id: 'cabinetY', field: 'cabinetY' },
        { id: 'gabineteSalvo', field: 'gabineteSalvoId' },
        { id: 'cablingType', field: 'layoutType' }
    ];
    
    inputs.forEach(({ id, field }) => {
        const element = document.getElementById(id);
        if (element) {
            const handler = () => {
                const screen = getActiveScreen();
                if (screen) {
                    screen[field] = element.value;
                    console.log(`💾 ${field} atualizado: ${element.value}`);
                    if (id === 'cabinetX' || id === 'cabinetY') {
                        updatePhysicalStats();
                    }
                    if (id === 'gabineteSalvo') {
                        // Dispara carregamento de dados físicos e pixels
                        loadGabineteData();
                    }
                }
            };

            // Selects disparam melhor em 'change'
            if (id === 'gabineteSalvo') {
                element.addEventListener('change', handler);
            } else {
                element.addEventListener('input', handler);
                element.addEventListener('change', handler);
            }
        }
    });
    
    // Checkbox de overclock
    const overclockMode = document.getElementById('overclockMode');
    if (overclockMode) {
        overclockMode.addEventListener('change', () => {
            const screen = getActiveScreen();
            if (screen) {
                screen.overclockMode = overclockMode.checked;
                console.log(`💾 overclockMode atualizado: ${overclockMode.checked}`);
            }
        });
    }
}

// ===== MOBILE MENU FUNCTIONALITY =====
function initMobileMenu() {
    const menuToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('screensSidebar');
    const overlay = document.getElementById('sidebarOverlay');

    if (!menuToggle || !sidebar || !overlay) {
        console.warn('⚠️ Mobile menu elements not found');
        return;
    }

    // Toggle sidebar
    const toggleSidebar = () => {
        const isOpen = sidebar.classList.contains('mobile-open');
        if (isOpen) {
            sidebar.classList.remove('mobile-open');
            overlay.classList.remove('active');
            menuToggle.textContent = '📱';
        } else {
            sidebar.classList.add('mobile-open');
            overlay.classList.add('active');
            menuToggle.textContent = '✖️';
        }
    };

    // Close sidebar
    const closeSidebar = () => {
        sidebar.classList.remove('mobile-open');
        overlay.classList.remove('active');
        menuToggle.textContent = '📱';
    };

    // Event listeners
    menuToggle.addEventListener('click', toggleSidebar);
    overlay.addEventListener('click', closeSidebar);

    // Close sidebar when screen item is clicked (mobile only)
    const screensList = document.getElementById('screensList');
    if (screensList) {
        screensList.addEventListener('click', (e) => {
            if (e.target.classList.contains('screen-item')) {
                // Check if mobile (window width < 768px)
                if (window.innerWidth < 768) {
                    setTimeout(closeSidebar, 300); // Small delay for better UX
                }
            }
        });
    }

    // Close sidebar on window resize to desktop
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth >= 768) {
                closeSidebar();
            }
        }, 250);
    });

    console.log('📱 Mobile menu initialized');
}


// ===== ESTATÍSTICAS FÍSICAS (FASE 2) =====
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
    
    // Mostrar card apenas se houver dados físicos
    if (Number(stats.pesoTotal) > 0 || Number(stats.consumoTotal) > 0) {
        card.style.display = 'block';
        
        document.getElementById('statTotalGabinetes').textContent = stats.totalGabinetes;
        document.getElementById('statPesoTotal').textContent = `${stats.pesoTotal} kg`;
        document.getElementById('statConsumoTotal').textContent = `${stats.consumoTotal} W`;
        document.getElementById('statAmperes').textContent = `${stats.amperes} A (${stats.voltagem}V)`;
    } else {
        card.style.display = 'none';
        // Mesmo sem dados físicos, atualiza total de gabinetes para depuração
        document.getElementById('statTotalGabinetes').textContent = stats.totalGabinetes;
        document.getElementById('statPesoTotal').textContent = `0 kg`;
        document.getElementById('statConsumoTotal').textContent = `0 W`;
        document.getElementById('statAmperes').textContent = `0 A (${stats.voltagem}V)`;
    }
    
    // Atualizar resumo global
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

// ===== RELATÓRIO DO PROJETO (FASE 4) =====
function generateProjectReport() {
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
    html += `<div class="header"><div class="title">LedLab Relatório</div><div class="actions"><button class="btn" onclick="window.print()">Salvar PDF / Imprimir</button></div></div>`;

    // Salvar estado atual
    const prevIndex = currentProject.activeScreenIndex;

    // Filtrar telas com dados válidos (sem telas vazias)
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

    // Opcional: começar pela tela ativa, depois as demais
    const start = validScreens.find(v => v.idx === prevIndex);
    const rest = validScreens.filter(v => v.idx !== prevIndex);
    const orderedScreens = start ? [start, ...rest] : validScreens;

    for (const { s: screen, idx: i } of orderedScreens) {
        setActiveScreen(i);
        calcularTudo();
        const stats = calculatePhysicalStats();

        // Capturar imagens dos canvases
        const imgOf = (id) => {
            const c = document.getElementById(id);
            return (c && c.toDataURL) ? `<img class="canvas-img" src="${c.toDataURL()}" alt="${id}">` : `<div class="card">Canvas ${id} indisponível</div>`;
        };

        html += `<div class="screen">`;
        html += `<h3>Tela ${i+1}: ${screen.name}</h3>`;
        html += `<div class="grid">`;
        html += `<div class="card"><h4>Resumo Técnico</h4>
                   <div class="kv"><span>Pixels:</span><span>${screen.pixelX} x ${screen.pixelY}</span></div>
                   <div class="kv"><span>Gabinetes:</span><span>${screen.cabinetX} x ${screen.cabinetY} (${(screen.cabinetX||0)*(screen.cabinetY||0)})</span></div>
                   <div class="kv"><span>Peso unitário:</span><span>${(screen.peso||0)} kg</span></div>
                   <div class="kv"><span>Consumo unitário:</span><span>${(screen.consumo||0)} W</span></div>
                   <div class="kv"><span>Voltagem:</span><span>${(screen.voltagem||220)} V</span></div>
                   <div class="kv"><span>Peso total:</span><span>${stats.pesoTotal} kg</span></div>
                   <div class="kv"><span>Consumo total:</span><span>${stats.consumoTotal} W</span></div>
                   <div class="kv"><span>Amperes estimados:</span><span>${stats.amperes} A</span></div>
                 </div>`;

        html += `<div class="card"><h4>Prioridade Horizontal</h4>${imgOf('canvas-largura')}</div>`;
        html += `<div class="card"><h4>Prioridade Vertical</h4>${imgOf('canvas-altura')}</div>`;
        html += `<div class="card"><h4>Melhor Área</h4>${imgOf('canvas-area')}</div>`;
        html += `<div class="card"><h4>Layout Manual</h4>${imgOf('canvas-manual')}</div>`;
        html += `</div>`; // grid
        html += `</div>`; // screen
    }

    // Restaurar tela ativa
    setActiveScreen(prevIndex);

    html += `</body></html>`;
    w.document.open();
    w.document.write(html);
    w.document.close();
}
