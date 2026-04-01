import { BaseTest } from '../core/BaseTest.js'
import { ChiCuadrada } from '../methods/Chi_cuadrada.js'

export class ChiCuadradaTest extends BaseTest {
  constructor() {
    super('chi-squared', 'Chi-Cuadrada ')
  }

  run(numbers, alpha) {
    return ChiCuadrada.test(numbers, alpha)
  }
}