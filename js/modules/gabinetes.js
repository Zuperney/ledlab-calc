/**
 * GABINETES MODULE
 * Gerenciamento de gabinetes (Cadastro de equipamentos)
 * Responsável por: CRUD de gabinetes e dados de equipamento
 */

const STORAGE_KEY = 'ledlab-gabinetes';

/**
 * Salva novo gabinete no localStorage
 * @param {Object} gabineteData - Dados do gabinete
 * @returns {Object} Gabinete salvo com ID
 */
function salvarGabinete(gabineteData) {
    const gabinetes = getGabinetes();
    const id = Date.now().toString();

    const gabinete = {
        id,
        nome: gabineteData.nome || 'Sem nome',
        potencia: parseFloat(gabineteData.potencia) || 0,
        ampersPerPorta: parseFloat(gabineteData.ampersPerPorta) || 0,
        pesoVazio: parseFloat(gabineteData.pesoVazio) || 0,
        pesoLED: parseFloat(gabineteData.pesoLED) || 0,
        criado: new Date().toLocaleDateString('pt-BR'),
        atualizado: new Date().toLocaleDateString('pt-BR')
    };

    gabinetes.push(gabinete);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gabinetes));
    console.log(`💾 Gabinete "${gabinete.nome}" salvo com ID: ${id}`);

    return gabinete;
}

/**
 * Recupera todos os gabinetes do localStorage
 * @returns {Array} Lista de gabinetes
 */
function getGabinetes() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('❌ Erro ao ler gabinetes:', e);
        return [];
    }
}

/**
 * Deleta gabinete por ID
 * @param {string} id - ID do gabinete
 */
function deleteGabinete(id) {
    let gabinetes = getGabinetes();
    const index = gabinetes.findIndex(g => g.id === id);

    if (index > -1) {
        const nome = gabinetes[index].nome;
        gabinetes.splice(index, 1);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(gabinetes));
        console.log(`🗑️ Gabinete "${nome}" deletado`);
    }
}

/**
 * Atualiza gabinete existente
 * @param {string} id - ID do gabinete
 * @param {Object} data - Novos dados
 */
function updateGabinete(id, data) {
    const gabinetes = getGabinetes();
    const gabinete = gabinetes.find(g => g.id === id);

    if (gabinete) {
        gabinete.nome = data.nome || gabinete.nome;
        gabinete.potencia = parseFloat(data.potencia) || gabinete.potencia;
        gabinete.ampersPerPorta = parseFloat(data.ampersPerPorta) || gabinete.ampersPerPorta;
        gabinete.pesoVazio = parseFloat(data.pesoVazio) || gabinete.pesoVazio;
        gabinete.pesoLED = parseFloat(data.pesoLED) || gabinete.pesoLED;
        gabinete.atualizado = new Date().toLocaleDateString('pt-BR');

        localStorage.setItem(STORAGE_KEY, JSON.stringify(gabinetes));
        console.log(`✏️ Gabinete "${gabinete.nome}" atualizado`);
    }
}

/**
 * Carrega dados do gabinete selecionado para a tela
 */
function loadGabineteData() {
    const gabineteSalvo = document.getElementById('gabineteSalvo');
    if (!gabineteSalvo || !gabineteSalvo.value) return;

    const gabinete = getGabinetes().find(g => g.id === gabineteSalvo.value);
    if (!gabinete) return;

    const screen = getActiveScreen();
    if (!screen) return;

    screen.gabineteInfo = {
        ...gabinete
    };

    console.log(`📦 Dados do gabinete "${gabinete.nome}" carregados`);
    calcularTudo();
}

/**
 * Atualiza lista de gabinetes na dropdown
 */
function updateGabineteList() {
    const select = document.getElementById('gabineteSalvo');
    if (!select) return;

    const gabinetes = getGabinetes();
    const currentValue = select.value;

    select.innerHTML = '<option value="">-- Selecionar Gabinete --</option>';

    gabinetes.forEach(gab => {
        const option = document.createElement('option');
        option.value = gab.id;
        option.textContent = gab.nome;
        select.appendChild(option);
    });

    select.value = currentValue;
    console.log(`📋 Lista de gabinetes atualizada (${gabinetes.length} itens)`);
}

/**
 * Renderiza tabela de gabinetes cadastrados
 */
function renderGabineteList() {
    const container = document.getElementById('gabinetesList');
    if (!container) return;

    const gabinetes = getGabinetes();
    container.innerHTML = '';

    if (gabinetes.length === 0) {
        container.innerHTML = '<p class="empty-message">Nenhum gabinete cadastrado ainda</p>';
        return;
    }

    const table = document.createElement('table');
    table.className = 'gabinetes-table';

    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>Nome</th>
            <th>Potência (W)</th>
            <th>Amperes/Porta</th>
            <th>Peso Vazio (kg)</th>
            <th>Peso LED (kg)</th>
            <th>Criado</th>
            <th>Ações</th>
        </tr>
    `;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    gabinetes.forEach(gab => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${gab.nome}</td>
            <td>${gab.potencia.toFixed(2)}</td>
            <td>${gab.ampersPerPorta.toFixed(2)}</td>
            <td>${gab.pesoVazio.toFixed(2)}</td>
            <td>${gab.pesoLED.toFixed(2)}</td>
            <td>${gab.criado}</td>
            <td>
                <button class="btn-small edit-gab" data-id="${gab.id}" title="Editar">✏️</button>
                <button class="btn-small delete-gab" data-id="${gab.id}" title="Deletar">🗑️</button>
            </td>
        `;

        // Edit button
        row.querySelector('.edit-gab').addEventListener('click', () => {
            console.log('✏️ Editar gabinete:', gab.id);
            // Implementar modal de edição
        });

        // Delete button
        row.querySelector('.delete-gab').addEventListener('click', () => {
            if (confirm(`Tem certeza que deseja deletar "${gab.nome}"?`)) {
                deleteGabinete(gab.id);
                updateGabineteList();
                renderGabineteList();
            }
        });

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    container.appendChild(table);
}

/**
 * Inicializa formulário de cadastro de gabinetes
 */
function initGabinetesForm() {
    const form = document.getElementById('gabinetesForm');
    if (!form) return;

    const inputs = [
        { id: 'gab-nome', field: 'nome' },
        { id: 'gab-potencia', field: 'potencia' },
        { id: 'gab-amperes', field: 'ampersPerPorta' },
        { id: 'gab-pesoVazio', field: 'pesoVazio' },
        { id: 'gab-pesoLED', field: 'pesoLED' }
    ];

    const inputMap = {};
    inputs.forEach(({ id, field }) => {
        const el = document.getElementById(id);
        if (el) inputMap[field] = el;
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const gabineteData = {
            nome: inputMap.nome?.value || '',
            potencia: inputMap.potencia?.value || 0,
            ampersPerPorta: inputMap.ampersPerPorta?.value || 0,
            pesoVazio: inputMap.pesoVazio?.value || 0,
            pesoLED: inputMap.pesoLED?.value || 0
        };

        if (!gabineteData.nome.trim()) {
            alert('⚠️ Nome do gabinete é obrigatório');
            return;
        }

        salvarGabinete(gabineteData);
        updateGabineteList();
        renderGabineteList();

        form.reset();
        console.log('✅ Novo gabinete adicionado');
    });

    console.log('📝 Formulário de gabinetes inicializado');
}

/**
 * Inicializa aba de gabinetes
 */
function initGabinetes() {
    initGabinetesForm();
    updateGabineteList();
    renderGabineteList();
    console.log('📦 Módulo de gabinetes inicializado');
}
