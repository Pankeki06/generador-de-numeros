import { getZ } from "./probabilidad"; 

export class CorridasArribaAbajoMedia {
    static test(numbers, alpha) {
        const n = numbers.length;
        if (n < 10) {
            throw new Error("Se necesitan al menos 10 números para el test de la media");
        }
        let contador = 1;
        let anterior = null;
        let No = 0;
        const tabla = [];

        for (let i = 0; i < Number(n); i++) {
            let diferencia = 0;
            let conjunto_S = "-";

            let actual = numbers[i] < 0.5 ? 0 : 1;

            

            if (anterior !== null && actual !== anterior) {
                contador++;
                diferencia = 1;
            }

            if (Number(actual) === 1 ){
                No++;
            }

            anterior = actual;
            conjunto_S = actual;

            tabla.push(`
            <tr>
                <td>${i + 1}</td>
                <td>${numbers[i].toFixed(4)}</td>
                <td>${conjunto_S}</td>
                <td>${diferencia}</td>
            </tr>`)
        }

        let N1 = n-No;
        let multiplicacion = 2*No*N1
        let Valor_esperado = (multiplicacion/n) + 0.5;
        let Varianza = (multiplicacion)*(multiplicacion-n) / ((n**2)*(n-1)) ;
        let Z_observado = Math.abs((contador - Valor_esperado) / Math.sqrt(Varianza));
        let Z_critico = getZ((1-alpha)*100);

        const passed = Z_observado <= Z_critico;

        return {
            passed,
            detail: `Z = ${Z_observado.toFixed(4)} vs valor crítico ${Z_critico.toFixed(4)} con α=${alpha}`,
            tableConfig: {
            name: "Corridas Arriba-Abajo de la media - Tabla de Resultados",
            headers: ["#", "Numero", "Conjunto-S", "Corrida"],
            rows: tabla  
            }
        }
    }
}
