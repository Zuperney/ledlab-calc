const STORAGE_KEY = "ledlab-gabinetes";

function getGabinetes() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

function saveGabinete(gabinete) {
    const gabinetes = getGabinetes();
    gabinetes.push(gabinete);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gabinetes));
    return gabinete;
}

function updateGabinete(id, updates) {
    const gabinetes = getGabinetes();
    const index = gabinetes.findIndex(g => g.id === id);
    if (index !== -1) {
        gabinetes[index] = { ...gabinetes[index], ...updates };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(gabinetes));
        return gabinetes[index];
    }
    return null;
}

function deleteGabinete(id) {
    const gabinetes = getGabinetes().filter(g => g.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gabinetes));
}

function getGabineteById(id) {
    return getGabinetes().find(g => g.id === id);
}

function clearAllGabinetes() {
    localStorage.removeItem(STORAGE_KEY);
}

export {
    STORAGE_KEY,
    getGabinetes,
    saveGabinete,
    updateGabinete,
    deleteGabinete,
    getGabineteById,
    clearAllGabinetes
};

