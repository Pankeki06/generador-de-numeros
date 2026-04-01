import { BaseTest } from '../core/BaseTest.js'
import { KolmogorovSmirnov } from '../methods/Kolmogorov_smirnov.js'

export class KolmogorovTest extends BaseTest {
  constructor() { super('kolmogorov', 'Kolmogorov Smirnov') }

  run(numbers, alpha) {
    return KolmogorovSmirnov.test(numbers,alpha)
  }
}