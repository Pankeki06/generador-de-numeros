export class KolmogorovSmirnov {

  static test(numbers, alpha) {
    const n = numbers.length;
    const fila = []

    if (n > 40) {
      throw new Error("Demasiados números para la prueba (máx. 40).");
    }

    const sorted = [...numbers].sort((a, b) => a - b);

    const DPlus  = [];
    const DMinus = [];

    for (let i = 0; i < n; i++) {
      const r = sorted[i];
      DPlus[i]  = Math.abs(((i + 1) / n) - r);
      DMinus[i] = Math.abs(r - (i / n));

      fila.push(`
      <tr>
          <td>${i + 1}</td>
          <td>${DPlus[i].toFixed(4)}</td>
          <td>${DMinus[i].toFixed(4)}</td>
      </tr>`
      );
    }

    const maxDPlus  = Math.max(...DPlus);
    const maxDMinus = Math.max(...DMinus);
    const D         = Math.max(maxDPlus, maxDMinus);

    const Kalpha   = Math.sqrt(-0.5 * Math.log(alpha / 2));
    const Dcritico = Kalpha / Math.sqrt(n);

    const passed = D <= Dcritico;

    return {
      passed,
      detail: `D = ${D.toFixed(4)} vs D crítico = ${Dcritico.toFixed(4)} (α=${alpha})`,
      tableConfig: {
            name: "Kolmogorov-Smirnov - Tabla de Resultados",
            headers: ["#", "D+", "D-"],
            rows: fila  
      }
    };
  }
}