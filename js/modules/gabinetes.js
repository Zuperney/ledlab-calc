// Dados e funções de gabinetes

function createGabinete(fabricante, nome, pixel_w, pixel_h, mm_w, mm_h, options = {}) {
    return {
        id: Date.now(),
        fabricante: fabricante.toUpperCase().trim(),
        nome: nome.trim(),
        pixel_w: parseInt(pixel_w),
        pixel_h: parseInt(pixel_h),
        mm_w: parseFloat(mm_w),
        mm_h: parseFloat(mm_h),
        peso: parseFloat(options.peso) || null,
        consumo: parseInt(options.consumo) || null,
        ambiente: options.ambiente || 'indoor',
        pixel_pitch: parseFloat(options.pixel_pitch) || null,
        nits: parseInt(options.nits) || null,
        refresh_rate: parseInt(options.refresh_rate) || null,
        ip_rating: options.ip_rating || null
    };
}

function validateGabinete(gabinete) {
    const errors = [];
    if (!gabinete.fabricante) errors.push("Fabricante é obrigatório");
    if (!gabinete.nome) errors.push("Nome do gabinete é obrigatório");
    if (gabinete.pixel_w <= 0) errors.push("Largura de pixels deve ser maior que 0");
    if (gabinete.pixel_h <= 0) errors.push("Altura de pixels deve ser maior que 0");
    if (gabinete.mm_w <= 0) errors.push("Largura em mm deve ser maior que 0");
    if (gabinete.mm_h <= 0) errors.push("Altura em mm deve ser maior que 0");
    return { valid: errors.length === 0, errors };
}

function getPixelPitch(pixel_w, pixel_h, mm_w, mm_h) {
    const pixelWidth = mm_w / pixel_w;
    const pixelHeight = mm_h / pixel_h;
    return Math.round((pixelWidth + pixelHeight) / 2 * 100) / 100;
}

function formatGabineteDisplay(gabinete) {
    return `${gabinete.fabricante} - ${gabinete.nome} (${gabinete.pixel_w}x${gabinete.pixel_h}px)`;
}

function filterGabinetesByAmbiente(gabinetes, ambiente) {
    return gabinetes.filter(g => g.ambiente === ambiente);
}

export {
    createGabinete,
    validateGabinete,
    getPixelPitch,
    formatGabineteDisplay,
    filterGabinetesByAmbiente
};

