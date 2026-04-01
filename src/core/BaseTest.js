export class BaseTest {
  constructor(id, name) {
    this.id   = id
    this.name = name
  }

  getName() { return this.name }

  /** Opcional — campos extra que necesita el test además del nivel de confianza */
  getFields() { return [] }

  /**
   * @param {number[]} numbers - datos generados
   * @param {number}   alpha   - nivel de significancia (ej. 0.05)
   * @param {Object}   params  - valores de getFields(), o {} si no hay
   * @returns {{ passed: boolean, detail: string, tableConfig?, tableConfigs? }}
   */
  run(numbers, alpha, params = {}) {
    throw new Error(`${this.id}: run() no implementado`)
  }
}