import { BaseTest } from '../core/BaseTest.js'
import { Poker } from '../methods/Poker.js'  

export class PokerTest extends BaseTest {
  constructor() { super('Poker', 'Poker') }


  run(numbers, alpha) {
    return Poker.test(numbers,alpha)
  }
}