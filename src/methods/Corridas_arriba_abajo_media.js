import { getZ } from "./probabilidad"; 

export class CorridasArribaAbajoMedia {
    static test(numbers, alpha) {
        const n = numbers.length;
        let contador = 1;
        let anterior = null;
        let No = 0;
        const tabla = [];

        for (let i = 0; i < Number(n); i++) {
            let diferencia = 0;
            let conjunto_S = "";

            let actual = numbers[i] < 0.5 ? 1 : 0;

            

            if (i < numbers.length - 1) {
                if (anterior !== null && actual !== anterior) {
                    contador++;
                    diferencia = 1;
                }
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
        let Z_critico = getZ(100-alpha);

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

// function Corridas_arriba_abajo_media(numeros, n, intervalo) {
//             cuerpoTabla.innerHTML = "";

//             let contador = 1;
//             let anterior = null;
//             let No = 0;
//             const tabla = [];

//             for (let i = 0; i < Number(n); i++) {
//                 let diferencia = 0;
//                 let conjunto_S = "";

//                 let actual = numeros[i] < 0.5 ? 1 : 0;

                

//                 if (i < numeros.length - 1) {
//                     if (anterior !== null && actual !== anterior) {
//                         contador++;
//                         diferencia = 1;
//                     }
//                 }

//                 if (Number(actual) === 1 ){
//                     No++;
//                 }

//                 anterior = actual;
//                 conjunto_S = actual;

//                 tabla.push(`
//                     <td>${i + 1}</td>
//                     <td>${numeros[i].toFixed(4)}</td>
//                     <td>${conjunto_S}</td>
//                     <td>${diferencia}</td>
//                 `)
                

//                 cuerpoTabla.appendChild(fila);
//             }
//             let N1 = n-No;
//             let multiplicacion = 2*No*N1
//             let Valor_esperado = (multiplicacion/n) + 0.5;
//             let Varianza = (multiplicacion)*(multiplicacion-n) / ((n**2)*(n-1)) ;
//             let Z_observado = Math.abs((contador - Valor_esperado) / Math.sqrt(Varianza));
//             let Z_critico = getZ(intervalo);

//             resultado.textContent = `Valor observado: ${Z_observado.toFixed(4)}, Valor crítico: ${Z_critico.toFixed(4)}`
//             numerosCorridas.textContent = `Número de corridas: ${contador}, numero de 1: ${No}, numeros de 0: ${N1}`;

//             if (Z_observado <= Z_critico) {
//                 confirmacion.textContent = "Los números son independientes";
//             } else {
//                 confirmacion.textContent = "Los números NO son independientes";
//             }

//         }

