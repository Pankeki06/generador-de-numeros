/**
 * Router — maneja la navegación entre vistas y el ciclo render.
 *
 * Responsabilidades:
 *  - Registrar vistas (BaseView)
 *  - Construir el menú de navegación
 *  - Renderizar la vista activa (campos + botón calcular)
 *  - Invocar onCalculate() y pasar resultados al ResultRenderer
 *  - Mostrar errores de validación
 */
import { ResultRenderer } from './ResultRenderer.js'

export class Router {
  /**
   * @param {string} navId      - id del elemento del menú
   * @param {string} screenId   - id del contenedor principal
   */
  constructor(navId, screenId) {
    this.$nav    = document.getElementById(navId)
    this.$screen = document.getElementById(screenId)
    this.views   = new Map()       // id → BaseView
    this.current = null
    this.renderer = new ResultRenderer()
  }

  /** Registra una vista y agrega su botón al menú */
  register(view) {
    this.views.set(view.id, view)

    const btn = document.createElement('button')
    btn.className = 'btn-nav'
    btn.textContent = view.label
    btn.dataset.viewId = view.id
    btn.addEventListener('click', () => this.navigate(view.id))
    this.$nav.appendChild(btn)
  }

  navigate(id) {
    if (!this.views.has(id)) return
    this.current = id

    // Actualizar estado del menú
    this.$nav.querySelectorAll('.btn-nav').forEach(b =>
      b.classList.toggle('activo', b.dataset.viewId === id)
    )

    this._renderView(this.views.get(id))
  }

  start() {
    const first = this.views.keys().next().value
    if (first) this.navigate(first)
  }

  // ─── privado ────────────────────────────────────────────────

  _renderView(view) {
    this.$screen.innerHTML = `
      <h2>${view.getTitle()}</h2>
      <div class="campos" id="campos-${view.id}">
        ${this._buildFields(view.getFields())}
      </div>
      ${view.getExtraHTML()}
      <div class="botones">
        <button id="btn-calcular" >Calcular</button>
        <button id="btn-limpiar">Limpiar</button>
      </div>
      <div id="error-msg" class="error-msg" style="display:none"></div>
      <div id="resultado"></div>
    `

    document.getElementById('btn-calcular')
      .addEventListener('click', () => this._handleCalculate(view))

    document.getElementById('btn-limpiar')
      .addEventListener('click', () => this._handleClear(view))

    this._validaciones(view)
  }

  _buildFields(fields) {
  return fields.map(f => `
    <div class="field-group">
      <label for="field-${f.id}">
        ${f.label}${f.required ? '<span class="required">*</span>' : ''}
      </label>

      <input
        id="field-${f.id}"
        type="${f.type ?? 'text'}"
        placeholder="${f.placeholder ?? ''}"
        value="${f.default ?? ''}"
      />
    </div>
  `).join('')
}

  _collectParams(fields) {
    const params = {}
    for (const f of fields) {
      params[f.id] = document.getElementById(`field-${f.id}`)?.value ?? ''
    }
    return params
  }

  _handleCalculate(view) {
    const $err = document.getElementById('error-msg')
    const $res = document.getElementById('resultado')
    $err.style.display = 'none'
    $res.innerHTML = ''

    const params = this._collectParams(view.getFields())

    try {
      const result = view.onCalculate(params)
      this.renderer.render($res, result)
    } catch (e) {
      $err.textContent = e.message
      $err.style.display = 'block'
    }
  }

  _handleClear(view) {
    document.getElementById('error-msg').style.display = 'none'
    document.getElementById('resultado').innerHTML = ''
    const btn = document.getElementById("btn-calcular");
    // Restaurar defaults
    for (const f of view.getFields()) {
      const el = document.getElementById(`field-${f.id}`)
      if (el) el.value = f.default ?? ''
      el.setCustomValidity('')
    }
    btn.disabled = true;
  }
  _validaciones(view) {
    const fields = view.getFields();

    for (const f of fields) {
      const input = document.getElementById(`field-${f.id}`);
      if (!input) continue;

      input.addEventListener("input", () => {
        const btn = document.getElementById("btn-calcular");
        const params = this._collectParams(fields);
        for (const field of fields) {
          const el = document.getElementById(`field-${field.id}`);
          if (!el) continue;

          try {
            const error = view.validate?.(field.id, params);
            el.setCustomValidity(error ?? "");
          } catch (e) {
            el.setCustomValidity(e.message);
          }
        }

        // Rehabilita el botón solo si todos son válidos
        const allValid = fields.every(field => {
          const el = document.getElementById(`field-${field.id}`);
          return el ? el.checkValidity() : true;
        });

        btn.disabled = !allValid;

        input.reportValidity();
      });
    }
  }
}

