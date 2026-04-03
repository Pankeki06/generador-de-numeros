import { getChi2Critical } from "./probabilidad"; 

function contarFrecuencias(numero) {
    let conteo = {};

    let str = numero.toFixed(5).split('.')[1]; 

    for (let digito of str) {
        conteo[digito] = (conteo[digito] || 0) + 1;
    }

    return Object.values(conteo);
}

function clasificar(numero) {
    let frecs = contarFrecuencias(numero).sort((a, b) => b - a);

    if (frecs[0] === 5) return "quintilla";
    if (frecs[0] === 4) return "poker";
    if (frecs[0] === 3 && frecs[1] === 2) return "full";
    if (frecs[0] === 3) return "tercia";
    if (frecs[0] === 2 && frecs[1] === 2) return "doble par";
    if (frecs[0] === 2) return "un par";

    return "todos diferentes";
}

export class Poker {
  static test(numbers, alpha) {
    const n = numbers.length;
    let fila = [];
    let datos = [];

    let probabilidades = {
        "todos diferentes": 0.3024,
        "un par": 0.5040,
        "doble par": 0.1080,
        "tercia": 0.0720,
        "full": 0.0090,
        "poker": 0.0045,
        "quintilla": 0.0001
    };

    let conteo = {
        "todos diferentes": 0,
        "un par": 0,
        "doble par": 0,
        "tercia": 0,
        "full": 0,
        "poker": 0,
        "quintilla": 0
    };

    for (let i = 0; i < n; i++) {

        let clasificacion = clasificar(numbers[i]);

        conteo[clasificacion]++;

        fila.push(`
            <tr>
            <td>${i + 1}</td>
            <td>${numbers[i].toFixed(5)}</td>
            <td>${clasificacion}</td>
            </tr>
        `);
    }

    
    let categorias = Object.entries(conteo).map(([tipo, observado]) => {
        return {
            tipo,
            observado,
            esperado: probabilidades[tipo] * n
        };
    });


    categorias.sort((a, b) => a.esperado - b.esperado);

    let agrupadas = [];
    let grupo = { tipo: "", observado: 0, esperado: 0 };


    // agrupa categorias menores a 5
    for (let cat of categorias) {

        grupo.tipo += (grupo.tipo ? " + " : "") + cat.tipo;
        grupo.observado += cat.observado;
        grupo.esperado += cat.esperado;

        if (grupo.esperado >= 5) {
            agrupadas.push(grupo);
            grupo = { tipo: "", observado: 0, esperado: 0 };
        }
    }
    
    if (grupo.esperado > 0) {
        agrupadas.push(grupo);
    }

    let chi2 = 0;

    for (let cat of agrupadas) {

        let chi = Math.pow(cat.observado - cat.esperado, 2) / cat.esperado;
        chi2 += chi;

        
        datos.push(`
            <td>${cat.tipo}</td>
            <td>${cat.observado}</td>
            <td>${cat.esperado.toFixed(4)}</td>
            <td>${chi.toFixed(4)}</td>
        `);
    }

    let df = agrupadas.length - 1;

    let chiCritico = getChi2Critical(alpha, df);

    const passed = chi2 <= chiCritico

    return {
        passed,
        detail: `χ² = ${chi2.toFixed(4)} vs valor crítico ${chiCritico.toFixed(4)} con ${df} g.l. (α=${alpha})`,
        tableConfigs: [
                {
                    name: "Tablas de frecuencias - Prueba de Poker",
                    headers: ["Tipo", " Oi (Observado)", "Ei (Esperada)", "(O - E)^2 / E"],
                    rows: datos   
                }, 
                {
                    name: "Tablas de resultados - Prueba de Poker",
                    headers: ["#", "Numero", "Clasificacion"],
                    rows: fila
                }
            ]
        }
    }
}
