import { getZ } from "./probabilidad"; 

export class CorridasArribaAbajo {
    static test(numbers, alpha) {

        if (!numbers || numbers.length < 2) {
            throw new Error("Se necesitan al menos 2 números para el test");
        }

        const n = numbers.length;
        const tabla = [];

        let contador = 1;      // número de corridas
        let anterior = null;   // valor anterior de S

        for (let i = 0; i < n; i++) {

            let conjunto_S = "-";
            let diferencia = "-";

            if (i < n - 1) {

                // 🔹 definir subida (1) o bajada (0)
                let actual = numbers[i + 1] > numbers[i] ? 1 : 0;

                conjunto_S = actual;

                // 🔹 detectar cambio de corrida
                if (anterior !== null && actual !== anterior) {
                    diferencia = 1;
                    contador++;
                } else{
                    diferencia = 0;
                }

                // 🔹 actualizar anterior DESPUÉS de comparar
                anterior = actual;
            }

            tabla.push(`
            <tr>
                <td>${i + 1}</td>
                <td>${numbers[i].toFixed(4)}</td>
                <td>${conjunto_S}</td>
                <td>${diferencia}</td>
            </tr>`);
        }

        // 🔹 estadísticos
        let Valor_esperado = (2 * n - 1) / 3;
        let Varianza = (16 * n - 29) / 90;
        let Z_observado = Math.abs((contador - Valor_esperado) / Math.sqrt(Varianza));

        let Z_critico = getZ((1 - alpha) * 100);

        const passed = Z_observado <= Z_critico;

        return {
            passed,
            detail: `Z = ${Z_observado.toFixed(4)} vs ${Z_critico.toFixed(4)} con α=${alpha}`,
            tableConfig: {
                name: "Corridas Arriba-Abajo - Tabla de Resultados",
                headers: ["#", "X", "Conjunto-S", "Corrida"],
                rows: tabla
            }
        };
    }
}