/**
 * Validators — funciones puras de validación de parámetros.
 * No tienen estado ni efectos secundarios.
 * Retornan null si pasa, o string con el mensaje de error.
 */

export const Validators = {
  /**
   * Verifica que el valor sea un entero positivo mayor que `min`.
   * @param {string} value
   * @param {string} label
   * @param {number} [min=0]
   */
  positivo(value, label, min = 0) {
    const n = parseInt(value, 10)
    if (isNaN(n) || !Number.isInteger(n) || n <= min)
      return `"${label}" debe ser un entero mayor que ${min}.`
    return null
  },

  /**
   * Verifica que el valor sea un número (entero o decimal) > 0.
   */
  longitud_par(value, label) {
    if ((String(value).length) % 2 !== 0)
      return `"${label}" debe ser de longitud par.`
    return null
  },

  /**
   * Verifica que las semillas sean iguales (entero o decimal) > 0.
   */
  comparar_semilla(a,b,labelA,labelB){
    if (String(a).length !== String(b).length)
      return `"${labelA}" debe tener la misma longitud que "${labelB}" .`
    return null
  },

  /**
   * Verifica que a < m (condición típica de LCG).
   */
  menor_que(a, b, labelA, labelB) {
    const na = parseFloat(a)
    const nb = parseFloat(b);
    if (isNaN(na) || isNaN(nb)) return null; 
    if (na > nb )
      return `"${labelA}" debe ser menor que "${labelB}".`
    return null
  },

  mcd(a, b) {
    a = Math.abs(parseInt(a, 10));
    b = Math.abs(parseInt(b, 10));
    while (b) {
      a %= b;
      [a, b] = [b, a];
    }
    return a;
  },

  /**
   * Helper: Factores primos con protección contra NaN/0
   */
  _getPrimeFactors(n) {
    const factors = new Set();
    let num = Math.abs(parseInt(n, 10));
    if (isNaN(num) || num < 2) return factors;

    let d = 2;
    while (num >= d * d) {
      if (num % d === 0) {
        factors.add(d);
        num /= d;
      } else {
        d++;
      }
    }
    if (num > 1) factors.add(num);
    return factors;
  },

  Primos(a, b, labelA, labelB) {
    const numA = parseInt(a, 10);
    const numB = parseInt(b, 10);
    if (isNaN(numA) || isNaN(numB)) return null; // Protección

    if (this.mcd(numA, numB) !== 1)
      return `"${labelA}" y "${labelB}" deben ser coprimos (mcd=1).`;
    return null;
  },

  Divisible_Factores_Primos(a, m, labelA, labelM) {
    const numA = parseInt(a, 10);
    const numM = parseInt(m, 10);
    if (isNaN(numA) || isNaN(numM)) return null; // Protección

    const aMinusOne = numA - 1;
    const factors = this._getPrimeFactors(numM);

    for (let p of factors) {
      if (aMinusOne % p !== 0) {
        return `"${labelA}-1" (${aMinusOne}) debe ser divisible por el factor primo ${p} de "${labelM}".`;
      }
    }
    return null;
  },

  Multiplo_cuatro(a, m, labelA, labelM) {
    const numA = parseInt(a, 10);
    const numM = parseInt(m, 10);
    if (isNaN(numA) || isNaN(numM)) return null; // Protección

    if (numM % 4 === 0 && (numA - 1) % 4 !== 0)
      return `Si "${labelM}" es múltiplo de 4, "${labelA}-1" también debe serlo.`;
    return null;
  },

  /**
   * Ejecuta un array de validaciones y retorna el primer error encontrado.
   * @param {Array<() => string|null>} checks
   * @returns {string|null}
   */
  first(...checks) {
    for (const check of checks) {
      const err = check()
      if (err) return err
    }
    return null
  }
}