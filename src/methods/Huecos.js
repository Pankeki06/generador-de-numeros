import { getChi2Critical } from './probabilidad.js'

export class Huecos {
  static test(numbers, alpha, a, b) {
    const n    = numbers.length
    const prob = b - a

    const cantidades = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    const rowsResultados = []
    let contador = 0

    for (let i = 0; i < n; i++) {
      const dentro = numbers[i] > a && numbers[i] < b ? 1 : 0

      if (dentro !== 1) {
        contador++
        rowsResultados.push(`<tr>
          <td>${i + 1}</td>
          <td>${numbers[i].toFixed(5)}</td>
          <td>${dentro}</td>
          <td>-</td>
        </tr>`)
      } else {
        const idx = Math.min(contador, 5)
        cantidades[idx]++
        rowsResultados.push(`<tr>
          <td>${i + 1}</td>
          <td>${numbers[i].toFixed(5)}</td>
          <td>${dentro}</td>
          <td>${contador}</td>
        </tr>`)
        contador = 0
      }
    }

    // Si al final queda un hueco abierto
    if (contador > 0) {
      cantidades[Math.min(contador, 5)]++
    }

    const totalHuecos = Object.values(cantidades).reduce((s, v) => s + v, 0)

    // === SIN AGRUPACIÓN ===
    let categorias = Object.entries(cantidades).map(([tipo, observado]) => {
      const t  = Number(tipo)
      const Pi = t < 5
        ? prob * Math.pow(1 - prob, t)
        : Math.pow(1 - prob, 5)   // huecos de 5 o más
      return { 
        tipo: t.toString(), 
        observado, 
        Pi, 
        Ei: Pi * totalHuecos 
      }
    })

    // Calcular chi-cuadrado con todas las categorías separadas
    let chi2 = 0
    const rowsFrecuencias = categorias.map(cat => {
      const chi = cat.Ei > 0 ? Math.pow(cat.observado - cat.Ei, 2) / cat.Ei : 0
      chi2 += chi

      return `<tr>
        <td>${cat.tipo}</td>
        <td>${cat.observado}</td>
        <td>${cat.Pi.toFixed(4)}</td>
        <td>${cat.Ei.toFixed(4)}</td>
        <td>${chi.toFixed(4)}</td>
      </tr>`
    })

    // Grados de libertad = número de categorías - 1 → aquí siempre 5
    const df = categorias.length - 1   // 6 categorías → df = 5

    if (df <= 0) {
        return { 
            passed: false, 
            detail: "Df igual o menor a cero, por favor ingresar mas numeros"
        };
    }

    const chiCritico = getChi2Critical(alpha, df)
    const passed     = chi2 <= chiCritico

    return {
      passed,
      detail: `χ² = ${chi2.toFixed(4)} vs valor crítico ${chiCritico.toFixed(4)} con ${df} g.l. (α=${alpha})`,
      tableConfigs: [
        {
          name:    'Huecos — Frecuencias (sin agrupar)',
          headers: ['Tamaño hueco', 'Oi', 'Pi', 'Ei', 'χ²'],
          rows:    rowsFrecuencias,
        },
        {
          name:    'Huecos — Resultados por número',
          headers: ['#', 'Número', 'Dentro del intervalo', 'Tamaño del hueco'],
          rows:    rowsResultados,
        },
      ]
    }
  }
}