import { BaseTest } from '../core/BaseTest.js'
import { Huecos } from '../methods/Huecos.js'

export class HuecosTest extends BaseTest {
  constructor() {
    super('huecos', 'Huecos')
  }

  getFields() {
    return [
      {
        id:          'a',
        label:       'Límite inferior (a)',
        type:        'number',
        default:     '0.3',
        placeholder: 'ej. 0.3',
      },
      {
        id:          'b',
        label:       'Límite superior (b)',
        type:        'number',
        default:     '0.7',
        placeholder: 'ej. 0.7',
      },
    ]
  }

  run(numbers, alpha, params) {
    const a = parseFloat(params.a)
    const b = parseFloat(params.b)

    if (isNaN(a) || a <= 0 || a >= 1) throw new Error('a debe estar entre 0 y 1')
    if (isNaN(b) || b <= 0 || b >= 1) throw new Error('b debe estar entre 0 y 1')
    if (a >= b)                        throw new Error('a debe ser menor que b')

    return Huecos.test(numbers, alpha, a, b)
  }
}