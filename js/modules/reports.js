/**
 * REPORTS MODULE
 * Geração de relatórios de projetos
 * Responsável por: criar relatórios visuais, exportar dados, gerar PDFs
 */

/**
 * Calcula estatísticas globais do projeto
 * @returns {Object} Estatísticas do projeto
 */
function calculateProjectStats() {
    const stats = {
        totalScreens: currentProject.screens.length,
        totalPixels: 0,
        totalCabos: 0,
        totalWeight: 0,
        totalPower: 0,
        totalAmperage: 0,
        gabinetes: {}
    };

    currentProject.screens.forEach((screen, index) => {
        const resultado = calcularTudo();
        if (resultado) {
            stats.totalPixels += resultado.totalPixels;
            stats.totalCabos += resultado.totalCabos;
            stats.totalWeight += resultado.peso;
            stats.totalPower += resultado.potencia;
            stats.totalAmperage += resultado.amperagem;
        }
    });

    return stats;
}

/**
 * Gera relatório de projeto completo
 */
function generateProjectReport() {
    const modalReport = document.getElementById('reportModal');
    if (!modalReport) {
        console.error('❌ Modal de relatório não encontrado');
        return;
    }

    const reportTitle = document.getElementById('reportTitle');
    const reportContent = document.getElementById('reportContent');
    const reportCanvas = document.getElementById('reportCanvas');

    if (!reportTitle || !reportContent) {
        console.error('❌ Elementos do relatório não encontrados');
        return;
    }

    // Calcula estatísticas
    const stats = calculateProjectStats();

    // Título
    reportTitle.textContent = `${currentProject.name} - Relatório Técnico`;

    // Conteúdo do relatório
    let html = `
        <div class="report-header">
            <h2>${currentProject.name}</h2>
            <p>Data: ${new Date().toLocaleDateString('pt-BR')}</p>
            <p>Telas: ${stats.totalScreens}</p>
        </div>

        <div class="report-section">
            <h3>📊 Resumo Geral</h3>
            <div class="report-grid">
                <div class="report-item">
                    <span class="label">Total de Pixels</span>
                    <span class="value">${stats.totalPixels.toLocaleString('pt-BR')}</span>
                </div>
                <div class="report-item">
                    <span class="label">Total de Cabos</span>
                    <span class="value">${stats.totalCabos}</span>
                </div>
                <div class="report-item">
                    <span class="label">Peso Total (kg)</span>
                    <span class="value">${stats.totalWeight.toFixed(2)}</span>
                </div>
                <div class="report-item">
                    <span class="label">Potência Total (W)</span>
                    <span class="value">${stats.totalPower.toFixed(2)}</span>
                </div>
                <div class="report-item">
                    <span class="label">Amperagem Total (A)</span>
                    <span class="value">${stats.totalAmperage.toFixed(2)}</span>
                </div>
            </div>
        </div>

        <div class="report-section">
            <h3>🖥️ Detalhes das Telas</h3>
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Tela</th>
                        <th>Dimensões</th>
                        <th>Pixels</th>
                        <th>Cabos</th>
                        <th>Peso (kg)</th>
                        <th>Potência (W)</th>
                    </tr>
                </thead>
                <tbody>
    `;

    currentProject.screens.forEach((screen, index) => {
        setActiveScreen(index);
        const resultado = calcularTudo();

        html += `
            <tr>
                <td>${screen.name}</td>
                <td>${screen.pixelX} × ${screen.pixelY}</td>
                <td>${resultado?.totalPixels || 0}</td>
                <td>${resultado?.totalCabos || 0}</td>
                <td>${resultado?.peso?.toFixed(2) || '0.00'}</td>
                <td>${resultado?.potencia?.toFixed(2) || '0.00'}</td>
            </tr>
        `;
    });

    html += `
                </tbody>
            </table>
        </div>

        <div class="report-section">
            <h3>🎯 Mapeamento das Telas</h3>
            <div class="report-canvases">
    `;

    currentProject.screens.forEach((screen, index) => {
        setActiveScreen(index);
        html += `
            <div class="report-canvas-container">
                <h4>${screen.name}</h4>
                <canvas id="reportCanvas-${index}" width="400" height="400" class="report-canvas"></canvas>
            </div>
        `;
    });

    html += `
            </div>
        </div>

        <div class="report-footer">
            <p>Relatório gerado automaticamente pelo LED Lab Calc</p>
            <p>${new Date().toLocaleString('pt-BR')}</p>
        </div>
    `;

    reportContent.innerHTML = html;

    // Renderiza canvases
    currentProject.screens.forEach((screen, index) => {
        setTimeout(() => {
            setActiveScreen(index);
            const canvas = document.getElementById(`reportCanvas-${index}`);
            if (canvas) {
                desenharMapeamento(canvas);
            }
        }, 100 * index);
    });

    // Mostra modal
    modalReport.classList.add('active');
    console.log('📄 Relatório gerado com sucesso');
}

/**
 * Fecha modal de relatório
 */
function closeReportModal() {
    const modal = document.getElementById('reportModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

/**
 * Exporta relatório como PDF
 */
function exportReportPDF() {
    window.print();
    console.log('🖨️ Abrindo diálogo de impressão');
}

/**
 * Exporta dados de projeto como JSON
 */
function exportProjectJSON() {
    const dataStr = JSON.stringify(currentProject, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentProject.name}-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log('📥 Projeto exportado como JSON');
}

/**
 * Importa projeto de arquivo JSON
 */
function importProjectJSON(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const imported = JSON.parse(e.target.result);
            if (imported.screens && imported.name) {
                currentProject = imported;
                currentProject.activeScreenIndex = 0;
                setActiveScreen(0);
                renderScreenList();
                console.log('✅ Projeto importado com sucesso');
                saveProject();
            } else {
                alert('❌ Arquivo de projeto inválido');
            }
        } catch (error) {
            alert('❌ Erro ao importar projeto: ' + error.message);
            console.error(error);
        }
    };
    reader.readAsText(file);
}

/**
 * Inicializa eventos do modal de relatório
 */
function initReportModal() {
    const modal = document.getElementById('reportModal');
    const closeBtn = document.querySelector('.report-close');
    const printBtn = document.getElementById('reportPrintBtn');
    const exportBtn = document.getElementById('reportExportBtn');

    if (closeBtn) {
        closeBtn.addEventListener('click', closeReportModal);
    }

    if (printBtn) {
        printBtn.addEventListener('click', exportReportPDF);
    }

    if (exportBtn) {
        exportBtn.addEventListener('click', exportProjectJSON);
    }

    // Fecha ao clicar fora
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeReportModal();
            }
        });
    }

    console.log('📋 Modal de relatório inicializado');
}
