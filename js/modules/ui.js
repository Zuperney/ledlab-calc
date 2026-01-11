/**
 * UI MODULE
 * Atualização de interface e interações com usuário
 * Responsável por: renderização de telas, inputs, abas, navegação
 */

/**
 * Carrega dados da tela ativa para a interface
 * @param {number} screenIndex - Índice da tela
 */
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

/**
 * Renderiza lista de telas na sidebar
 */
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

        // Clique para ativar
        item.addEventListener('click', (e) => {
            if (e.target.classList.contains('screen-item-delete')) return;
            setActiveScreen(index);
            renderScreenList();
        });

        // Clique para deletar
        const deleteBtn = item.querySelector('.screen-item-delete');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentProject.screens.length === 1) {
                alert('⚠️ Você precisa ter pelo menos uma tela!');
                return;
            }
            if (confirm(`Tem certeza que deseja deletar "${screen.name}"?`)) {
                currentProject.screens.splice(index, 1);
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

/**
 * Inicializa eventos da UI de telas
 */
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

/**
 * Atualiza UI com resultado de cálculo
 * @param {string} id - ID do elemento
 * @param {number} qtd - Quantidade de cabos
 * @param {string} texto - Texto descritivo
 * @param {number} usedGabs - Gabinetes usados
 * @param {number} limitSafe - Limite seguro
 */
function updateUI(id, qtd, texto, usedGabs, limitSafe) {
    const statusClass = usedGabs > limitSafe ? 'alerta' : 'ok';
    const icon = usedGabs > limitSafe ? '⚠️' : '✅';

    const resultHtml = `
        <div class="result-content">
            <div class="result-label">${texto}</div>
            <div class="result-value">
                <span class="result-number">${qtd}</span>
                <span class="result-unit">cabo${qtd !== 1 ? 's' : ''}</span>
            </div>
            <div class="result-status ${statusClass}">
                ${icon} ${usedGabs}/${limitSafe} gabinetes
            </div>
        </div>
    `;

    const element = document.getElementById(`result-${id}`);
    if (element) element.innerHTML = resultHtml;
}

/**
 * Inicializa sistema de abas
 */
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

    if (buttons.length) activate(buttons[0].dataset.target);
}

/**
 * Inicializa navegação entre páginas
 */
function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-button[data-page]');
    const pages = document.querySelectorAll('.page-content');
    const tabIndicator = document.getElementById('tabIndicator');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetPage = btn.dataset.page;
            navButtons.forEach(b => b.classList.remove('active'));
            pages.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');

            document.getElementById(`page-${targetPage}`).classList.add('active');

            if (tabIndicator) {
                tabIndicator.classList.remove('at-configurator', 'at-cadastro');
                if (targetPage === 'configurator') {
                    tabIndicator.classList.add('at-configurator');
                } else if (targetPage === 'cadastro') {
                    tabIndicator.classList.add('at-cadastro');
                }
            }

            console.log(`📄 Página ativa: ${targetPage}`);
        });
    });
}

/**
 * Inicializa menu mobile
 */
function initMobileMenu() {
    const menuToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('screensSidebar');
    const overlay = document.getElementById('sidebarOverlay');

    if (!menuToggle || !sidebar || !overlay) {
        console.warn('⚠️ Mobile menu elements not found');
        return;
    }

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

    const closeSidebar = () => {
        sidebar.classList.remove('mobile-open');
        overlay.classList.remove('active');
        menuToggle.textContent = '📱';
    };

    menuToggle.addEventListener('click', toggleSidebar);
    overlay.addEventListener('click', closeSidebar);

    const screensList = document.getElementById('screensList');
    if (screensList) {
        screensList.addEventListener('click', (e) => {
            if (e.target.classList.contains('screen-item') && window.innerWidth < 768) {
                setTimeout(closeSidebar, 300);
            }
        });
    }

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

/**
 * Inicializa persistência de inputs
 */
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
                        loadGabineteData();
                    }
                    if (id === 'cablingType') {
                        redrawAllCanvas();
                    }
                }
            };

            if (id === 'gabineteSalvo') {
                element.addEventListener('change', handler);
            } else {
                element.addEventListener('input', handler);
                element.addEventListener('change', handler);
            }
        }
    });

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
