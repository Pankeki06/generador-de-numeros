import { BaseTest } from '../core/BaseTest.js'
import { CorridasArribaAbajo } from '../methods/Corridas_arriba_abajo.js'

export class CorridasArribaAbajoTest extends BaseTest {
  constructor() {
    super('corridas-arriba-abajo', 'Corridas Arriba/Abajo')
  }

  run(numbers, alpha) {
    return CorridasArribaAbajo.test(numbers, alpha)
  }
}