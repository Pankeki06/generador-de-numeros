import { BaseView } from '../core/BaseView.js'
import { Validators } from '../core/Validators.js'
import { ChiCuadradaTest } from '../tests/ChiCuadradaTest.js'
import { KolmogorovTest } from '../tests/KolmogorovTest.js'
import { CorridasArribaAbajoTest } from '../tests/ArribaAbajoTest.js'
import { CorridasArribaAbajoMediaTest } from '../tests/ArribaAbajoMediaTest.js'
import { PokerTest } from '../tests/PokerTest.js'
import { HuecosTest } from '../tests/HuecosTest.js'

export class MultiplicadorConstanteView extends BaseView {
  constructor() {
    super('Multiplicador_constante', 'Multiplicador Constante')
  }

  getTitle() { return 'Método del Multiplicador Constante' }

  getFields() {
    return [
      { id: 'seed_1',   label: 'Semilla (X1)', placeholder: 'ej. 1234', default: '1234', type : "number"},
      { id: 'seed_2',   label: 'Semilla (X2)', placeholder: 'ej. 5463', default: '5463', type : "number"},
      { id: 'n',      label: 'Cantidad (n)',          placeholder: 'ej. 20',   default: '20', type : "number"  },
    ]
  }

  getExtraHTML() {
    return `<p class="formula">X<sub>n+1</sub> = dígitos centrales de X<sub>n</sub>²</p>`
  }

  onCalculate({ seed_1, seed_2, n }) {

    const longitud = seed_1.length;
    const inicio = longitud / 2;
    const numbers = [];
    let cuadrado, normalizar, central, resultado;
    const tabla = [];

    for (let i = 0; i < Number(n); i++) {
      cuadrado = (BigInt(seed_1) * BigInt(seed_2)).toString(); 
      normalizar = cuadrado.padStart(longitud * 2, '0'); 
      central = normalizar.slice(inicio, inicio + longitud); 
      resultado = central ? Number(central) / (10 ** longitud) : 0 ; 

      tabla.push(`<tr>
        <td>${i + 1}</td> 
        <td>${seed_1}</td> 
        <td>${seed_2}</td> 
        <td>${normalizar}</td> 
        <td>${central}</td> 
        <td>${resultado.toFixed(longitud)}</td>
      </tr>`
      );

      numbers.push(resultado);
      seed_2 = central;
      if (Number(seed_2) === 0) break;
    }
    
    return {
      numbers,
      meta: ["#", "X1","X2", "X1 * X2","central","Ri"],
      fila: tabla,
      tests: [ new ChiCuadradaTest(), new KolmogorovTest(), 
            new CorridasArribaAbajoTest(), new CorridasArribaAbajoMediaTest(),
            new PokerTest(), new HuecosTest()]
    }
  }


  validate(id, { seed_1, seed_2, n }) {

    if (id === "n")
      return Validators.positivo(n, "Cantidad", 0) ||
      Validators.maximo(n, "Cantidad");

    if (id === "seed_1")
      return Validators.positivo(seed_1, "Semilla 1", 1) || 
          Validators.longitud_par(seed_1, "semilla 1") ||
          Validators.comparar_semilla(seed_1,seed_2, "semilla 1", "semilla 2");

    if (id === "seed_2")
      return Validators.positivo(seed_2, "Semilla 2", 1) ||
          Validators.longitud_par(seed_2, "semilla 2") ||
          Validators.comparar_semilla(seed_1,seed_2, "semilla 2", "semilla 1");

  }

}