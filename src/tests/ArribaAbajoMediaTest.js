import { BaseTest } from '../core/BaseTest.js'
import { CorridasArribaAbajoMedia } from '../methods/Corridas_arriba_abajo_media.js' 



export class CorridasArribaAbajoMediaTest extends BaseTest {
  constructor() {
    super('corridas-arriba-abajo de la media', 'Corridas Arriba/Abajo de la media')
  }

  run(numbers, alpha) {
    return CorridasArribaAbajoMedia.test(numbers, alpha)
  }
}