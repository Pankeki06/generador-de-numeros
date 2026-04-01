export class ResultRenderer {
  constructor() {
    this.currentPage = {};
    this.rowsPerPage = 500;
    this._dynCounter = 0;
  }

  render($container, { numbers, meta = [], fila = [], tests = [], testTables = [] }) {
    $container.innerHTML = `
      <div class="tabs-container">
        <div class="tabs-header">
          <button class="tab-btn active" data-tab="tab-datos">Datos Generados</button>
          ${tests.length > 0 ? `<button class="tab-btn" data-tab="tab-pruebas">Pruebas Estadísticas</button>` : ''}
          ${testTables.map((t, i) =>
            `<button class="tab-btn" data-tab="tab-table-${i}">${t.name || `Tabla ${i + 1}`}</button>`
          ).join('')}
        </div>

        <div class="tab-content active" id="tab-datos">
          <h3>Tabla de Resultados (${numbers.length} valores)</h3>
          ${this._tableShell('datos')}
        </div>

        ${tests.length > 0 ? `
          <div class="tab-content" id="tab-pruebas">
            <h3>Análisis de Uniformidad e Independencia</h3>
            <div class="tests-tabs-header" id="tests-tabs-header"></div>
            <div class="tests-content" id="tests-content"></div>
          </div>` : ''}

        ${testTables.map((t, i) => `
          <div class="tab-content" id="tab-table-${i}">
            <h3>${t.name || `Tabla ${i + 1}`}</h3>
            ${this._tableShell(`table-${i}`)}
          </div>`).join('')}
      </div>`;

    const $w = $container.querySelector('.tabs-container');

    const dataRows = fila.length
      ? fila
      : numbers.map((n, i) => `<tr><td>${i + 1}</td><td>${n}</td></tr>`);

    this._renderTable($w, 'datos', { headers: meta.length ? meta : ['#', 'Ri'], rows: dataRows });

    testTables.forEach((t, i) => this._renderTable($w, `table-${i}`, t));

    if (tests.length > 0) this._renderTests($w, tests, numbers);

    this._setupMainTabNavigation($w);
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  _tableShell(key) {
    return `
      <div class="pagination-info" id="${key}-pagination-info"></div>
      <div class="table-wrap">
        <table>
          <thead id="${key}-thead"></thead>
          <tbody id="${key}-tbody"></tbody>
        </table>
      </div>
      <div class="pagination-controls" id="${key}-pagination-controls"></div>`;
  }

  _renderTable($scope, key, config) {
    const $thead = $scope.querySelector(`#${key}-thead`);
    const $tbody = $scope.querySelector(`#${key}-tbody`);
    const $info  = $scope.querySelector(`#${key}-pagination-info`);
    const $ctrl  = $scope.querySelector(`#${key}-pagination-controls`);

    if (!$tbody) return;

    if (config.headers?.length) {
      $thead.innerHTML = `<tr>${config.headers.map(h => `<th>${h}</th>`).join('')}</tr>`;
    }

    const rows  = config.rows;
    const total = rows.length;
    const pages = Math.ceil(total / this.rowsPerPage);

    const render = (page) => {
      $tbody.innerHTML = '';
      const start = page * this.rowsPerPage;
      const end   = Math.min(start + this.rowsPerPage, total);

      for (let i = start; i < end; i++) {
        rows[i] instanceof HTMLElement
          ? $tbody.appendChild(rows[i].cloneNode(true))
          : $tbody.insertAdjacentHTML('beforeend', rows[i]);
      }
      this.currentPage[key] = page;
      this._renderPaginationControls($ctrl, page, pages, render);
    };

    render(0);
  }

  _renderTests($wrapper, tests, numbers) {
    const $header  = $wrapper.querySelector('#tests-tabs-header');
    const $content = $wrapper.querySelector('#tests-content');

    $header.innerHTML = tests.map((t, i) =>
      `<button class="test-tab-btn ${i === 0 ? 'active' : ''}" data-test-index="${i}">${t.getName()}</button>`
    ).join('');

    $content.innerHTML = tests.map((t, i) => {
      const extraFields = t.getFields?.() ?? [];
      const extraHTML = extraFields.map(f => `
        <div class="field-group">
          <label for="test-field-${i}-${f.id}">${f.label}</label>
          <input id="test-field-${i}-${f.id}" type="${f.type ?? 'number'}"
            placeholder="${f.placeholder ?? ''}" value="${f.default ?? ''}">
        </div>`).join('');

      return `
        <div class="test-tab-content ${i === 0 ? 'active' : ''}" data-test-index="${i}">
          <div class="test-controls">
            <label for="confianza-${i}">Nivel de Confianza (%):</label>
            <input id="confianza-${i}" type="number" class="confianza-input" value="95" min="80" max="99">
            ${extraHTML}
            <button class="btn-run-test" data-test-index="${i}">Ejecutar Prueba</button>
          </div>
          <div class="test-result-output">
            <p class="text-muted">Esperando ejecución...</p>
          </div>
        </div>`;
    }).join('');

    this._setupTestTabNavigation($header, $content);

    $content.querySelectorAll('.btn-run-test').forEach(btn => {
      btn.addEventListener('click', () => {
        const i         = parseInt(btn.dataset.testIndex);
        const tab       = $content.querySelector(`[data-test-index="${i}"]`);
        const confianza = parseFloat(tab.querySelector('.confianza-input').value);
        const $output   = tab.querySelector('.test-result-output');

        // Recoger campos extra del test
        const extraFields = tests[i].getFields?.() ?? [];
        const params = {};
        extraFields.forEach(f => {
          const el = tab.querySelector(`#test-field-${i}-${f.id}`);
          params[f.id] = el ? el.value : '';
        });

        this._executeSingleTest(tests[i], numbers, confianza, $output, params);
      });
    });
  }

  _executeSingleTest(test, numbers, confianza, $output, params = {}) {
    if (isNaN(confianza) || confianza <= 79 || confianza >= 100) {
      $output.innerHTML = `<span class="error">Confianza inválida (80-99)</span>`;
      return;
    }

    try {
      const alpha  = parseFloat((1 - confianza / 100).toFixed(4));
      const result = test.run(numbers, alpha, params);

      if (!result || typeof result !== 'object') throw new Error('Resultado inválido');

      const { passed, detail } = result;

      // Tablas inline debajo del resultado
      const tables   = result.tableConfigs ?? (result.tableConfig ? [result.tableConfig] : []);
      const tablesKey = `dyn-${++this._dynCounter}`;
      const tablesHTML = tables.map((cfg, i) =>
        `<h4>${cfg.name}</h4>${this._tableShell(`${tablesKey}-${i}`)}`
      ).join('');

      $output.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:1rem;">
          <div class="test-result ${passed ? 'passed' : 'failed'}">
            <strong>${passed ? '✓ PASA' : '✗ NO PASA'}</strong>
            <small>(α: ${alpha})</small>
            <p>${detail || 'Sin descripción'}</p>
          </div>
          ${tablesHTML}
        </div>`;

      tables.forEach((cfg, i) => this._renderTable($output, `${tablesKey}-${i}`, cfg));

    } catch (err) {
      $output.innerHTML = `<div class="error">Error en la prueba: ${err.message}</div>`;
      console.error('_executeSingleTest:', err);
    }
  }

  _renderPaginationControls($container, currentPage, totalPages, onPageChange) {
    if (totalPages <= 1) { $container.innerHTML = ''; return; }

    const buttons = [];

    if (currentPage > 0) {
      buttons.push(`<button class="pagination-btn" data-page="0">« Primera</button>`);
      buttons.push(`<button class="pagination-btn" data-page="${currentPage - 1}">‹ Anterior</button>`);
    }

    const start = Math.max(0, currentPage - 2);
    const end   = Math.min(totalPages - 1, currentPage + 2);

    if (start > 0) buttons.push(`<span class="pagination-dots">...</span>`);

    for (let i = start; i <= end; i++) {
      buttons.push(`<button class="pagination-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i + 1}</button>`);
    }

    if (end < totalPages - 1) buttons.push(`<span class="pagination-dots">...</span>`);

    if (currentPage < totalPages - 1) {
      buttons.push(`<button class="pagination-btn" data-page="${currentPage + 1}">Siguiente ›</button>`);
      buttons.push(`<button class="pagination-btn" data-page="${totalPages - 1}">Última »</button>`);
    }

    $container.innerHTML = buttons.join('');
    $container.querySelectorAll('.pagination-btn').forEach(btn => {
      btn.addEventListener('click', () => onPageChange(parseInt(btn.dataset.page)));
    });
  }

  _setupTestTabNavigation($header, $content) {
    const btns = $header.querySelectorAll('.test-tab-btn');
    const tabs = $content.querySelectorAll('.test-tab-content');

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        tabs.forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        $content.querySelector(`[data-test-index="${btn.dataset.testIndex}"]`).classList.add('active');
      });
    });
  }

  _setupMainTabNavigation($wrapper) {
    const btns     = $wrapper.querySelectorAll('.tabs-header > .tab-btn');
    const contents = $wrapper.querySelectorAll(':scope > .tab-content');

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        $wrapper.querySelector(`#${btn.dataset.tab}`)?.classList.add('active');
      });
    });
  }
}