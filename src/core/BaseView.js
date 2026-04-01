/**
 * BaseView — clase base para todas las vistas.
 * Cada vista extiende esta clase e implementa:
 *  - getTitle()   → string con el título de la sección
 *  - getFields()  → array de definiciones de inputs
 *  - onCalculate(params) → objeto con resultados
 *
 * El layout (nav, contenedor, tabla) lo maneja el Router,
 * nunca la vista hija.
 */
export class BaseView {
  /**
   * @param {string} id  - identificador único (usado en el menú y routing)
   * @param {string} label - texto del botón de navegación
   */
  constructor(id, label) {
    this.id = id
    this.label = label
  }

  /** Título que aparece como <h2> en la pantalla principal */
  getTitle() {
    return this.label
  }

  /**
   * Definición de los campos del formulario.
   * @returns {Array<{id, label, type, placeholder, default}>}
   */
  getFields() {
    return []
  }

  /**
   * Lógica de cálculo. Recibe un objeto { campo_id: valor }.
   * Debe retornar { numbers: number[], meta: {} } o lanzar Error con mensaje.
   * @param {Record<string, string>} params
   * @returns {{ numbers: number[], meta: Record<string, any> }}
   */
  onCalculate(params) {
    throw new Error(`${this.id}: onCalculate() no implementado`)
  }

  /**
   * HTML extra que se inyecta debajo del formulario (opcional).
   * Útil para notas o fórmulas de referencia.
   * @returns {string}
   */
  getExtraHTML() {
    return ''
  }

  validate(params) {
    return null 
  }
}