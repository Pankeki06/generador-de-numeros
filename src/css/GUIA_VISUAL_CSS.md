# 📁 Guía Visual - Estructura CSS Modular

## Árbol de Carpetas

```
mi-proyecto/
│
├── 📄 index.html                          ← Punto de entrada
│   └── Carga todos los CSS en orden
│
├── 📄 main.js                             ← Script principal
│
├── 📁 css/                                ← Carpeta de estilos
│   │
│   ├── 📄 base.css                        (Reset, body, pantalla principal)
│   │   └─ Contiene: html, body, #pantalla-principal, h1-h3
│   │
│   ├── 📄 navegacion.css                  (Menú y botones nav)
│   │   └─ Contiene: #menu-navegacion, .btn-nav
│   │
│   ├── 📄 inputs.css                      (Formularios)
│   │   └─ Contiene: input, .campos, .field-group, .required
│   │
│   ├── 📄 botones.css                     (Botones principales)
│   │   └─ Contiene: button, .botones
│   │
│   ├── 📄 tablas.css                      (Tablas de datos)
│   │   └─ Contiene: table, th, td, .table-wrap
│   │
│   ├── 📄 tabs-principales.css            (Pestañas principales)
│   │   └─ Contiene: .tabs-header, .tab-btn, .tab-content, @keyframes slideIn
│   │
│   ├── 📄 tabs-pruebas.css                (Pestañas internas de pruebas)
│   │   └─ Contiene: .tests-tabs-header, .test-tab-btn, .test-tab-content
│   │
│   ├── 📄 test-controles.css              (Controles de pruebas)
│   │   └─ Contiene: .test-controls, .confianza-input, .btn-run-test
│   │
│   ├── 📄 test-resultados.css             (Resultados de pruebas)
│   │   └─ Contiene: .test-result-output, .test-result, .stats-list
│   │
│   ├── 📄 paginacion.css                  (Controles de paginación)
│   │   └─ Contiene: .pagination-info, .pagination-controls, .pagination-btn
│   │
│   ├── 📄 mensajes.css                    (Alertas y mensajes)
│   │   └─ Contiene: .text-muted, .error
│   │
│   └── 📄 responsive.css                  (Media queries)
│       └─ Contiene: @media (max-width: 768px) y @media (max-width: 480px)
│
├── 📁 js/
│   ├── 📄 ResultRenderer_Adaptado.js
│   └── ... (otros archivos JS)
│
└── 📄 README.md
```

---

## 📊 Tabla: Qué CSS cargar según necesidad

| Necesito... | Archivos a cargar |
|-------------|-------------------|
| **Solo tabla de datos** | base + tablas + paginacion + responsive |
| **Tabla + formulario** | base + inputs + botones + tablas + paginacion + responsive |
| **Tabla + navegación** | base + navegacion + tablas + paginacion + responsive |
| **Todo (recomendado)** | Todos los archivos |

---

## 🔗 Orden de Carga en index.html

```html
<!DOCTYPE html>
<html>
<head>
  <!-- PASO 1: Reset y base -->
  <link rel="stylesheet" href="css/base.css">

  <!-- PASO 2: Componentes principales -->
  <link rel="stylesheet" href="css/navegacion.css">
  <link rel="stylesheet" href="css/inputs.css">
  <link rel="stylesheet" href="css/botones.css">
  <link rel="stylesheet" href="css/tablas.css">

  <!-- PASO 3: Pestañas y navegación -->
  <link rel="stylesheet" href="css/tabs-principales.css">
  <link rel="stylesheet" href="css/tabs-pruebas.css">

  <!-- PASO 4: Específico de pruebas -->
  <link rel="stylesheet" href="css/test-controles.css">
  <link rel="stylesheet" href="css/test-resultados.css">

  <!-- PASO 5: Paginación -->
  <link rel="stylesheet" href="css/paginacion.css">

  <!-- PASO 6: Utilidades -->
  <link rel="stylesheet" href="css/mensajes.css">

  <!-- PASO 7: Responsive (siempre último) -->
  <link rel="stylesheet" href="css/responsive.css">
</head>
<body>
  <!-- ... contenido ... -->
</body>
</html>
```

---

## 🎯 Flujo: De CSS a HTML

```
index.html
    ↓
Carga <link> a css/base.css
    ↓
Carga <link> a css/navegacion.css
    ↓
Carga <link> a css/inputs.css
    ↓
... (y así sucesivamente)
    ↓
Carga <link> a css/responsive.css
    ↓
El navegador aplica todos los estilos
    ↓
Renderiza la página
```

---

## 📍 Dónde Encontrar Cada Estilo

```
¿Quiero cambiar el color del botón de navegación?
→ Abre: css/navegacion.css
→ Busca: .btn-nav

¿Quiero cambiar el color de fondo de la tabla?
→ Abre: css/tablas.css
→ Busca: table { background: ...}

¿Quiero cambiar el color de la pestaña activa?
→ Abre: css/tabs-principales.css
→ Busca: .tab-btn.active

¿Quiero cambiar el tamaño de letra en móvil?
→ Abre: css/responsive.css
→ Busca: @media (max-width: 768px)

¿Quiero cambiar el resultado de prueba fallida?
→ Abre: css/test-resultados.css
→ Busca: .test-result.failed
```

---

## 🔄 Dependencias Entre CSS

```
responsive.css (siempre lo último)
       ↑
       │ (sobrescribe todo lo anterior)
       │
  ┌────┴──────┬──────────┬──────────┐
  │           │          │          │
mensajes.css  paginacion.css   test-resultados.css   test-controles.css
  │           │          │          │
  └────┬──────┴──────────┴──────────┘
       │
   tabs-pruebas.css  tabs-principales.css
       │
  ┌────┴──────┬──────────┬──────────┐
  │           │          │          │
tablas.css  botones.css  inputs.css  navegacion.css
  │           │          │          │
  └────┬──────┴──────────┴──────────┘
       │
   base.css
   (primera carga)
```

---

## 💾 Ejemplo: Crear CSS Compilado

Si quieres un solo archivo para producción:

### Opción 1: Manualmente (Windows)
```bash
# Abre cmd en la carpeta del proyecto
copy css\base.css + css\navegacion.css + css\inputs.css + ... styles.css
```

### Opción 2: Bash (Linux/Mac)
```bash
cat css/base.css css/navegacion.css css/inputs.css css/botones.css \
    css/tablas.css css/tabs-principales.css css/tabs-pruebas.css \
    css/test-controles.css css/test-resultados.css css/paginacion.css \
    css/mensajes.css css/responsive.css > styles.css
```

### Opción 3: Node.js (cualquier SO)
```javascript
// build-css.js
const fs = require('fs');
const path = require('path');

const archivos = [
  'css/base.css',
  'css/navegacion.css',
  'css/inputs.css',
  'css/botones.css',
  'css/tablas.css',
  'css/tabs-principales.css',
  'css/tabs-pruebas.css',
  'css/test-controles.css',
  'css/test-resultados.css',
  'css/paginacion.css',
  'css/mensajes.css',
  'css/responsive.css'
];

const contenido = archivos
  .map(file => fs.readFileSync(file, 'utf8'))
  .join('\n');

fs.writeFileSync('styles.css', contenido);
console.log('✅ styles.css creado');
```

Ejecuta con: `node build-css.js`

Luego en `index.html` usa:
```html
<link rel="stylesheet" href="styles.css">
```

---

## ✨ Pro Tips

### Tip 1: Agregar CSS para una nueva vista
```
css/
├── ... (existentes)
└── vistas/
    ├── congruencia-lineal.css
    ├── cuadrados-medios.css
    ├── fibonacci.css
    └── ...
```

### Tip 2: Variables CSS para reutilizar colores
Agrega en `css/base.css`:
```css
:root {
  --color-primary: #0ac1d1;
  --color-primary-dark: #0a9fb5;
  --color-error: #dc3545;
  --color-success: #28a745;
}
```

Luego usa en otros archivos:
```css
.btn-run-test {
  background-color: var(--color-primary);
}
```

### Tip 3: Organizar por componente en Git
```bash
git log --oneline -- css/tabs-principales.css
# Ver solo cambios de ese archivo
```

---

## 🐛 Debugging CSS

### Ver qué CSS está aplicado
1. Abre DevTools (F12)
2. Inspecciona un elemento
3. Panel derecho muestra todos los CSS aplicados
4. Busca qué archivo los tiene

### Si algo no se ve como esperado
```
1. ¿El archivo CSS existe?
2. ¿La ruta es correcta?
3. ¿El orden de carga es correcto?
4. ¿Hay un media query que lo oculta?
5. ¿Hay especificidad CSS que lo sobrescribe?
```

### Verificar especificidad
```css
/* Esto sobrescribe al anterior */
.tabs-header .tab-btn { color: red; }  /* 0,2,1 */
.tab-btn { color: blue; }              /* 0,1,1 */
/* Resultado: RED */
```

---

## 📋 Checklist de Integración

- [ ] Crear carpeta `css/`
- [ ] Copiar todos los 12 archivos CSS en esa carpeta
- [ ] Copiar `index.html` (o editar el existente)
- [ ] Verificar que las rutas `css/archivo.css` sean correctas
- [ ] Probar en navegador
- [ ] Verificar responsive (F12 → Device Toolbar)
- [ ] Verificar colores (tema oscuro/claro si aplica)

---

## 🎨 Personalización Rápida

### Cambiar color principal a rojo:
```bash
# Windows
findstr /r "#0ac1d1" css/*.css

# Linux/Mac
grep -r "#0ac1d1" css/

# Luego reemplazar todas las ocurrencias en esos archivos
```

---

## 📞 Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| Estilos no se aplican | Ruta CSS incorrecta | Verifica `css/archivo.css` |
| Orden de estilos incorrecto | Responsive cargado antes | Mueve responsive.css al final |
| Estilos se sobrescriben | Especificidad CSS | Usa DevTools para ver cuál |
| Diferentes en móvil | Media queries no aplicadas | Verifica device toolbar F12 |

