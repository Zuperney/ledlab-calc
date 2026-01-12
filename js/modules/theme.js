const THEME_KEY = "ledlab-theme";

export function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = saved || (prefersDark ? "dark" : "light");
    applyTheme(initial);

    document.documentElement.classList.add(initial);

    const toggle = document.getElementById("themeToggle");
    if (toggle) {
        toggle.addEventListener("click", () => {
            const current = document.body.dataset.theme || (prefersDark ? "dark" : "light");
            const next = current === "dark" ? "light" : "dark";
            applyTheme(next);
        });

        if (window.matchMedia) {
            window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", e => {
                if (!localStorage.getItem(THEME_KEY)) {
                    applyTheme(e.matches ? "dark" : "light");
                }
            });
        }
    }
}

export function applyTheme(theme) {
    document.documentElement.classList.remove("light", "dark");
    document.body.classList.remove("light", "dark");

    document.documentElement.classList.add(theme);
    document.body.classList.add(theme);
    document.body.dataset.theme = theme;

    localStorage.setItem(THEME_KEY, theme);

    const toggle = document.getElementById("themeToggle");
    if (toggle) {
        toggle.innerHTML = theme === "dark" ?
            '<span class="theme-icon">☀️</span>' :
            '<span class="theme-icon">🌙</span>';
        toggle.title = theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro";
    }

    window.dispatchEvent(new CustomEvent("themechange", { detail: { theme } }));
}
