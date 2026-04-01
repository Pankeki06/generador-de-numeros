import { BaseView } from '../core/BaseView.js'
import { Validators } from '../core/Validators.js'
import { ChiCuadradaTest } from '../tests/ChiCuadradaTest.js'
import { KolmogorovTest } from '../tests/KolmogorovTest.js'
import { CorridasArribaAbajoTest } from '../tests/ArribaAbajoTest.js'
import { CorridasArribaAbajoMediaTest } from '../tests/ArribaAbajoMediaTest.js'
import { PokerTest } from '../tests/PokerTest.js'
import { HuecosTest } from '../tests/HuecosTest.js'

export class CuadradoMedioView extends BaseView {
  constructor() {
    super('mid-squares', 'Cuadrado Medio')
  }

  getTitle() { return 'Método Cuadrado Medio' }

  getFields() {
    return [
      { id: 'seed',label: 'Semilla', placeholder: 'ej. 1234', type:"number", default: '1234'},
      { id: 'n',label: 'Cantidad (n)',placeholder: 'ej. 20', type:"number", default: '20'},
    ]
  }

  onCalculate({ seed, n }) {

    const longitud = seed.length;
    const inicio = longitud / 2;
    const numbers = [];
    let cuadrado, normalizar, central, resultado;
    const tabla = [];

    for (let i = 0; i < Number(n); i++) {
      cuadrado = (BigInt(seed) ** 2n).toString();
      normalizar = cuadrado.padStart(longitud * 2, '0');
      central = normalizar.slice(inicio, inicio + longitud);
      resultado = Number(central) / (10 ** longitud);

      tabla.push(`<tr>
        <td>${i + 1}</td>
        <td>${seed}</td>
        <td>${normalizar}</td>
        <td>${central}</td>
        <td>${resultado.toFixed(longitud)}</td>
      </tr>`
      );

      numbers.push(resultado);;
      seed = central;
      if (Number(seed) === 0) break;
    }
    
    return {
      numbers,
      meta: ["#", "Xi", "Xi²","central","Ri"],
      fila: tabla,
      tests: [ new ChiCuadradaTest(), new KolmogorovTest(), 
            new CorridasArribaAbajoTest(), new CorridasArribaAbajoMediaTest(),
            new PokerTest(), new HuecosTest() ]
    }
  }

  validate(id, { seed, n }) {

    if (id === "n")
      return Validators.positivo(n, "Cantidad", 0);

    if (id === "seed")
      return Validators.positivo(seed, "Semilla 1", 1) || 
          Validators.longitud_par(seed, "semilla 1")

  }

}