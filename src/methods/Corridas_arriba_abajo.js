import { getZ } from "./probabilidad"; 

export class CorridasArribaAbajo {
    static test(numbers, alpha) {
        const n = numbers.length;
        if (!numbers || numbers.length < 2) {
            throw new Error("Se necesitan al menos 2 números para el test");
        }
        let contador = 1;
        let anterior = null;
        const tabla = [];

        for (let i = 0; i < n; i++) {
            let diferencia = 0;

            let conjunto_S = "";

            if (i < numbers.length - 1) {

                let actual = numbers[i] < numbers[i + 1] ? 1 : 0;

                if (anterior !== null && actual !== anterior) {
                    diferencia = 1;
                    contador++;
                }

                anterior = actual;
                conjunto_S = actual;
            }

            tabla.push(`
            <tr>
                <td>${i + 1}</td>
                <td>${numbers[i].toFixed(4)}</td>
                <td>${diferencia}</td>
                <td>${conjunto_S}</td>
            </tr>`);
        }

        let Valor_esperado = (2 * n - 1) / 3;
        let Varianza = (16 * n - 29) / 90;
        let Z_observado = Math.abs((contador - Valor_esperado) / Math.sqrt(Varianza));
        console.log(alpha)
        let Z_critico = getZ((1-alpha)*100);

        const passed = Z_observado <= Z_critico;

        return {
            passed,
            detail: `Z = ${Z_observado.toFixed(4)} vs valor crítico ${Z_critico.toFixed(4)} con α=${alpha}`,
            tableConfig: {
            name: "Corridas Arriba-Abajo - Tabla de Resultados",
            headers: ["#", "Numero", "Corrida", "Conjunto-S"],
            rows: tabla  
            }
        }
    }
}


