import { BaseTest } from '../core/BaseTest.js'
import { Poker } from '../methods/Poker.js'  

export class PokerTest extends BaseTest {
  constructor() { 
    super('poker', 'Poker') 
  }

  getFields() {
    return [
      {
        id: 'digitos',
        type: 'select',   // 🔥 ESTO lo hace selector
        default: '5',
        noLabel: true,
        options: [
          { value: '3', label: '3 dígitos' },
          { value: '4', label: '4 dígitos' },
          { value: '5', label: '5 dígitos' }
        ]
      }
    ]
  }

  run(numbers, alpha, params) {
    const digitos = parseInt(params.digitos)

    return Poker.test(numbers, alpha, digitos)
  }
}