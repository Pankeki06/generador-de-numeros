import { getChi2Critical } from "./probabilidad"; 

export class ChiCuadrada {
  static test(numbers, alpha) {
    const n = numbers.length;
    let k = Math.ceil(Math.sqrt(n)); 

    let tabla = []
     
    let frecuencias = new Array(k).fill(0); 
 
    numbers.forEach(r =>{ 
        let intervalo = Math.floor(r * k); 
        if (intervalo === k) { 
            intervalo = k - 1; 
        } 
        frecuencias[intervalo]++; 
    }) 
 
    let x_total = 0 
    let ei = n / k 
 
    for (let i = 0; i < k; i++) { 
      
        let limInf = (i / k); 
        let limSup = ((i + 1) / k); 
        let oi = frecuencias[i];  
        let xi2 = ((oi - ei) ** 2) / ei; 
        x_total += xi2;  
        
        let fila = document.createElement("tr");  
 
        fila.innerHTML = `  
            <td>${i + 1}</td>  
            <td>${limInf}</td>  
            <td>${limSup}</td>  
            <td>${oi}</td>  
            <td>${ei.toFixed(2)}</td>  
            <td>${xi2.toFixed(4)}</td>  
        `;  

        tabla.push(fila);
         

    } 
 
    let df = k-1; 
    let x_critico = getChi2Critical(alpha, df);
    const passed = x_total <= x_critico

    return {
      passed,
      detail: `χ² = ${x_total.toFixed(4)} vs valor crítico ${x_critico.toFixed(4)} con ${df} g.l. (α=${alpha})`,
      tableConfig: {
        name: "Prueba Chi-Cuadrada - Tabla de Frecuencias",
        headers: ["Intervalo", "Límite Inferior", "Límite Superior", "Oi (Observada)", "Ei (Esperada)", "χ² parcial"],
        rows: tabla   // Array de <tr> HTMLElement
      }
    }
  }
}



 

