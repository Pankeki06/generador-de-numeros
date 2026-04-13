import { getChi2Critical } from "./probabilidad"; 

function contarFrecuencias(numero, digitos) {
    let conteo = {};
    let str = numero.toFixed(digitos).split('.')[1];

    for (let digito of str) {
        conteo[digito] = (conteo[digito] || 0) + 1;
    }

    return Object.values(conteo);
}

function clasificar(numero, digitos) {
    let frecs = contarFrecuencias(numero, digitos).sort((a, b) => b - a);

    if (digitos === 5) {
        if (frecs[0] === 5) return "quintilla";
        if (frecs[0] === 4) return "poker";
        if (frecs[0] === 3 && frecs[1] === 2) return "full";
        if (frecs[0] === 3) return "tercia";
        if (frecs[0] === 2 && frecs[1] === 2) return "doble par";
        if (frecs[0] === 2) return "un par";
        return "todos diferentes";
    }

    if (digitos === 4) {
        if (frecs[0] === 4) return "poker";
        if (frecs[0] === 3) return "tercia";
        if (frecs[0] === 2 && frecs[1] === 2) return "doble par";
        if (frecs[0] === 2) return "un par";
        return "todos diferentes";
    }

    if (digitos === 3) {
        if (frecs[0] === 3) return "tercia";
        if (frecs[0] === 2) return "un par";
        return "todos diferentes";
    }

    return "error";
}

export class Poker {
    static test(numbers, alpha, digitos) {
        const n = numbers.length;
        let fila = [];
        let datos = [];

        // Probabilidades según número de dígitos
        const probabilidadesCinco = {
            "todos diferentes": 0.3024,
            "un par": 0.5040,
            "doble par": 0.1080,
            "tercia": 0.0720,
            "full": 0.0090,
            "poker": 0.0045,
            "quintilla": 0.0001
        };

        const probabilidadesCuatro = {
            "todos diferentes": 0.5040,
            "un par": 0.4320,
            "doble par": 0.0270,
            "tercia": 0.0360,
            "poker": 0.0010
        };

        const probabilidadesTres = {
            "todos diferentes": 0.72,
            "un par": 0.27,
            "tercia": 0.01
        };

        let probabilidades;
        if (digitos === 5) probabilidades = probabilidadesCinco;
        else if (digitos === 4) probabilidades = probabilidadesCuatro;
        else if (digitos === 3) probabilidades = probabilidadesTres;
        else {
            return { passed: false, detail: "Número de dígitos no válido" };
        }

        // Conteo de frecuencias observadas
        let conteo = {};
        for (let key in probabilidades) {
            conteo[key] = 0;
        }

        // Clasificar cada número
        for (let i = 0; i < n; i++) {
            let clasificacion = clasificar(numbers[i], digitos);

            if (conteo.hasOwnProperty(clasificacion)) {
                conteo[clasificacion]++;
            }

            fila.push(`
                <tr>
                    <td>${i + 1}</td>
                    <td>${numbers[i].toFixed(digitos)}</td>
                    <td>${clasificacion}</td>
                </tr>
            `);
        }

        // Construir categorías SIN AGRUPACIÓN
        let categorias = Object.entries(conteo).map(([tipo, observado]) => ({
            tipo,
            observado,
            esperado: probabilidades[tipo] * n
        }));

        // Calcular chi-cuadrado (todas las categorías por separado)
        let chi2 = 0;
        for (let cat of categorias) {
            const chi = Math.pow(cat.observado - cat.esperado, 2) / cat.esperado;
            chi2 += chi;

            datos.push(`
                <tr>
                    <td>${cat.tipo}</td>
                    <td>${cat.observado}</td>
                    <td>${cat.esperado.toFixed(4)}</td>
                    <td>${chi.toFixed(4)}</td>
                </tr>
            `);
        }

        // Grados de libertad = número de categorías - 1
        const df = categorias.length - 1;

        if (df <= 0) {
            return { 
                passed: false, 
                detail: "Df igual o menor a cero, por favor ingresar más números" 
            };
        }

        const chiCritico = getChi2Critical(alpha, df);

        const passed = chi2 <= chiCritico;

        return {
            passed,
            detail: `χ² = ${chi2.toFixed(4)} vs valor crítico ${chiCritico.toFixed(4)} con ${df} g.l. (α=${alpha})`,
            tableConfigs: [
                {
                    name: "Tabla de frecuencias - Prueba de Poker",
                    headers: ["Tipo", "Oi (Observado)", "Ei (Esperada)", "(O - E)^2 / E"],
                    rows: datos
                },
                {
                    name: "Tabla de resultados - Prueba de Poker",
                    headers: ["#", "Número", "Clasificación"],
                    rows: fila
                }
            ]
        };
    }
}