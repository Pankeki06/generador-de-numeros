/**
 * Vista: Generador Congruencial Lineal (LCG)
 * Fórmula: X_{n+1} = (a * X_n + c) mod m
 */
import { BaseView } from '../core/BaseView.js'
import { Validators } from '../core/Validators.js'
import { ChiCuadradaTest } from '../tests/ChiCuadradaTest.js'
import { KolmogorovTest } from '../tests/KolmogorovTest.js'
import { CorridasArribaAbajoTest } from '../tests/ArribaAbajoTest.js'
import { CorridasArribaAbajoMediaTest } from '../tests/ArribaAbajoMediaTest.js'
import { PokerTest } from '../tests/PokerTest.js'
import { HuecosTest } from '../tests/HuecosTest.js'

export class CongruenciaLineal extends BaseView {
  constructor() {
    super('lcg', 'Congruencial Lineal')
  }

  getTitle() { return 'Generador Congruencial Lineal' }

  getFields() {
    return [
      { id: 'seed', label: 'Semilla (X₀)', placeholder: 'ej. 27', default: '27',  type:"number"},
      { id: 'a',    label: 'Multiplicador (a)', placeholder: 'ej. 1664525', default: '1664525', type:"number" },
      { id: 'c',    label: 'Incremento (c)',    placeholder: 'ej. 1013904223', default: '1013904223', type:"number" },
      { id: 'm',    label: 'Módulo (m)',         placeholder: 'ej. 4294967296', default: '4294967296', type:"number" },
      { id: 'n',    label: 'Iteraciones',        placeholder: 'ej. 20', default: '20', type:"number" },
    ]
  }

  onCalculate({ seed, a, c, m, n }) {
    const ba = BigInt(a)
    const bc = BigInt(c)
    const bm = BigInt(m);
    const numbers = []
    const tabla = []

    let formulaTexto, siguiente,resultado;
    let actual =  BigInt(seed);

    for (let i=0; i<Number(n); i++){

      formulaTexto = `(${a} * ${actual} + ${c}) mod ${m}`;
      siguiente = (ba * actual + bc) % bm; 
      resultado = Number(siguiente) / Number(bm); 
 
      tabla.push(`<tr>
        <td>${i + 1}</td> 
        <td>${actual}</td> 
        <td>${formulaTexto}</td> 
        <td>${siguiente}</td> 
        <td>${resultado.toFixed(5)}</td> 
      </tr>`
      );
 
      numbers.push(resultado); 
      actual = siguiente;
    }


    return {
      numbers,
      meta: ["#", "xn", "(a * xn + c)mod m", "Xn + 1", "Ri"],
      fila: tabla,
      tests: [ new ChiCuadradaTest(), new KolmogorovTest(), 
            new CorridasArribaAbajoTest(), new CorridasArribaAbajoMediaTest(),
            new PokerTest(), new HuecosTest()]
    }
  }

  validate(id, { seed, a,c,m, n }) {

    if (id === "seed")
      return Validators.positivo(seed, "Semilla", 1) || 
          Validators.longitud_par(seed, "semilla");

    if(id==="c")
      return Validators.positivo(c, "c", 1) ||
      Validators.Primos(m,c,"m","c");

    if (id === "a")
      return Validators.positivo(a, "a", 1) || 
      Validators.menor_que(a,m,"a","m") || 
      Validators.Divisible_Factores_Primos(a,m,"a", "m") ||
      Validators.Multiplo_cuatro(a,m, "a", "m");

    if (id==="m")
      return Validators.positivo(m, "m", 1) || 
      Validators.menor_que(a,m,"a","m") || 
      Validators.Divisible_Factores_Primos(a,m,"a", "m") ||
      Validators.Multiplo_cuatro(a,m, "a", "m") ||
      Validators.Primos(m,c,"m","c");


    if (id === "n")
      return Validators.positivo(n, "Cantidad", 1) ||
      Validators.maximo(n, "Cantidad"); 

  }
}