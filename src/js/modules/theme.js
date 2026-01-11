/**
 * THEME MODULE
 * Gerenciamento de temas visuais (Material Design 3)
 * Responsável por: carregar temas, alternar entre light/dark, aplicar cores
 */

const THEME_STORAGE_KEY = 'ledlab-theme';
const THEME_VARIANTS = {
    light: 'light',
    dark: 'dark',
    'light-hc': 'light-hc',
    'light-mc': 'light-mc',
    'dark-hc': 'dark-hc',
    'dark-mc': 'dark-mc'
};

/**
 * Obtém tema atual do localStorage
 * @returns {string} Nome do tema
 */
function getCurrentTheme() {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved && THEME_VARIANTS[saved]) {
        return saved;
    }
    // Detecta preferência do sistema
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Aplica tema
 * @param {string} themeName - Nome do tema
 */
function applyTheme(themeName) {
    if (!THEME_VARIANTS[themeName]) {
        console.warn(`⚠️ Tema "${themeName}" não encontrado, usando light`);
        themeName = 'light';
    }

    // Carrega CSS do tema
    const themeLink = document.getElementById('themeLink');
    if (themeLink) {
        themeLink.href = `src/themes/material-theme/css/${themeName}.css`;
    }

    // Salva preferência
    localStorage.setItem(THEME_STORAGE_KEY, themeName);

    // Atualiza atributo do documento
    document.documentElement.setAttribute('data-theme', themeName);

    // Atualiza botão de toggle
    updateThemeToggleButton(themeName);

    console.log(`🎨 Tema aplicado: ${themeName}`);
}

/**
 * Alterna entre temas light/dark
 */
function toggleTheme() {
    const currentTheme = getCurrentTheme();
    const isLight = currentTheme.includes('light');
    const newTheme = isLight ? 'dark' : 'light';

    applyTheme(newTheme);
}

/**
 * Alterna entre modo normal e high-contrast
 */
function toggleHighContrast() {
    const currentTheme = getCurrentTheme();
    let newTheme = currentTheme;

    if (currentTheme.includes('-hc')) {
        // Remove -hc
        newTheme = currentTheme.replace('-hc', '');
    } else if (currentTheme.includes('-mc')) {
        // Remove -mc, adiciona -hc
        newTheme = currentTheme.replace('-mc', '-hc');
    } else {
        // Adiciona -mc
        newTheme = currentTheme + '-mc';
    }

    applyTheme(newTheme);
}

/**
 * Atualiza visual do botão de toggle de tema
 * @param {string} themeName - Nome do tema ativo
 */
function updateThemeToggleButton(themeName) {
    const btn = document.getElementById('themeToggleBtn');
    if (!btn) return;

    const isLight = themeName.includes('light');
    btn.textContent = isLight ? '🌙' : '☀️';
    btn.title = isLight ? 'Ativar modo escuro' : 'Ativar modo claro';
}

/**
 * Inicializa sistema de temas
 */
function initTheme() {
    const currentTheme = getCurrentTheme();
    applyTheme(currentTheme);

    // Botão de toggle
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }

    // Detector de preferência do sistema
    const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    colorSchemeQuery.addEventListener('change', (e) => {
        if (!localStorage.getItem(THEME_STORAGE_KEY)) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });

    console.log('🎨 Sistema de temas inicializado');
}

/**
 * Obtém lista de temas disponíveis
 * @returns {Array} Lista de temas
 */
function getAvailableThemes() {
    return Object.keys(THEME_VARIANTS);
}

/**
 * Aplica cor CSS com base na categoria
 * @param {string} categoria - Categoria do LED
 * @returns {string} Código da cor
 */
function getThemeColor(categoria) {
    const colors = {
        R: 'var(--color-red, #FF0000)',
        G: 'var(--color-green, #00FF00)',
        B: 'var(--color-blue, #0000FF)',
        W: 'var(--color-white, #FFFFFF)',
        RGB: 'var(--color-rgb, #FFFF00)',
        default: 'var(--color-gray, #808080)'
    };

    return colors[categoria] || colors.default;
}
