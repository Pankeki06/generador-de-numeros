# 📁 Estructura CSS Modular

## Organización de Archivos

```
proyecto/
├── index.html
├── main.js
├── css/
│   ├── base.css                    # Reset y estilos globales
│   ├── navegacion.css              # Estilos del menú de navegación
│   ├── inputs.css                  # Inputs, campos y formularios
│   ├── botones.css                 # Estilos de botones
│   ├── tablas.css                  # Estilos de tablas
│   ├── tabs-principales.css        # Pestañas principales (Datos, Pruebas, etc)
│   ├── tabs-pruebas.css            # Pestañas internas de pruebas
│   ├── test-controles.css          # Controles de ejecución de pruebas
│   ├── test-resultados.css         # Resultados de pruebas (success/failed)
│   ├── paginacion.css              # Controles y info de paginación
│   ├── mensajes.css                # Alertas y mensajes de error
│   └── responsive.css              # Media queries para responsive design
├── js/
│   ├── ResultRenderer_Adaptado.js
│   └── ... resto de archivos
```

---

## 📊 Qué va en cada CSS

| Archivo | Contenido |
|---------|-----------|
| **base.css** | Reset CSS, body, pantalla principal, títulos |
| **navegacion.css** | Menú de navegación, botones de navegación |
| **inputs.css** | Input, textarea, campos de formulario |
| **botones.css** | Botones principales, hover, active |
| **tablas.css** | table, th, td, filas alternas, hover |
| **tabs-principales.css** | Headers de pestañas principales, contenido, animaciones |
| **tabs-pruebas.css** | Pestañas internas para pruebas estadísticas |
| **test-controles.css** | Inputs de confianza, botón ejecutar, label |
| **test-resultados.css** | Resultados passed/failed, stats list, colores |
| **paginacion.css** | Botones de paginación, info de filas, dots |
| **mensajes.css** | Alertas de error, mensajes muted |
| **responsive.css** | Media queries para tablet y móvil |

---

## ✅ Ventajas de esta Estructura

### 1. **Modularidad**
- Cada componente en su propio archivo
- Fácil de encontrar y modificar estilos
- No hay mezcla de responsabilidades

### 2. **Mantenimiento**
- Cambios en un componente no afectan otros
- Reutilizable en otros proyectos
- Escalable para nuevas vistas

### 3. **Rendimiento**
- Los navegadores cachean mejor archivos más pequeños
- Puedes cargar solo lo que necesitas
- En producción se pueden minificar/concatenar

### 4. **Colaboración**
- Múltiples personas pueden trabajar en diferentes CSS
- Menos conflictos de merge en Git
- Responsabilidades claras

---

## 🚀 Cómo Usar

### Opción 1: Cargar todos (recomendado para desarrollo)

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="css/base.css">
  <link rel="stylesheet" href="css/navegacion.css">
  <link rel="stylesheet" href="css/inputs.css">
  <link rel="stylesheet" href="css/botones.css">
  <link rel="stylesheet" href="css/tablas.css">
  <link rel="stylesheet" href="css/tabs-principales.css">
  <link rel="stylesheet" href="css/tabs-pruebas.css">
  <link rel="stylesheet" href="css/test-controles.css">
  <link rel="stylesheet" href="css/test-resultados.css">
  <link rel="stylesheet" href="css/paginacion.css">
  <link rel="stylesheet" href="css/mensajes.css">
  <link rel="stylesheet" href="css/responsive.css">
</head>
```

O usa el archivo `index.html` que ya los tiene todos.

### Opción 2: Crear un CSS compilado (producción)

```bash
# Concatenar todos en uno
cat css/base.css css/navegacion.css css/inputs.css ... > styles.min.css

# Minificar
uglify-css styles.min.css > styles.min.css
```

### Opción 3: Cargar solo lo necesario

Si tu página solo tiene inputs y tablas:

```html
<link rel="stylesheet" href="css/base.css">
<link rel="stylesheet" href="css/inputs.css">
<link rel="stylesheet" href="css/tablas.css">
<link rel="stylesheet" href="css/responsive.css">
```

---

## 🎨 Personalizándolo

### Cambiar color principal (#0ac1d1)

1. Abre `css/tabs-principales.css` y busca:
```css
.tab-btn.active {
  background: #0ac1d1;  /* ← Cambia aquí */
}
```

2. Abre `css/tabs-pruebas.css`:
```css
.test-tab-btn.active {
  background: #0ac1d1;  /* ← Y aquí */
}
```

3. Abre `css/test-controles.css`:
```css
.btn-run-test {
  background-color: #0ac1d1;  /* ← Y aquí */
}
```

4. Abre `css/paginacion.css`:
```css
.pagination-btn.active {
  background: #0ac1d1;  /* ← Y aquí también */
}
```

### Cambiar color de error

En `css/test-resultados.css`:
```css
.test-result.failed {
  background: #f8d7da;  /* Fondo */
  border-left-color: #dc3545;  /* Borde izquierdo */
  color: #721c24;  /* Texto */
}
```

### Agregar nuevos estilos

1. Si es para un componente existente: edita su CSS
2. Si es para un nuevo componente: crea un nuevo archivo

Ejemplo - nuevo archivo `css/custom.css`:
```css
/* Mis estilos personalizados */
.mi-clase {
  background: red;
}
```

Y agrega en `index.html`:
```html
<link rel="stylesheet" href="css/custom.css">
```

---

## 🔄 Orden de Carga Importante

La orden en que cargas los CSS importa por la cascada de CSS:

1. **base.css** - Primero, resetea todo
2. **Componentes** (navegacion, inputs, botones, tablas)
3. **Pestañas** (tabs-principales, tabs-pruebas)
4. **Pruebas** (test-controles, test-resultados)
5. **Paginación** (paginacion.css)
6. **Utilidades** (mensajes.css)
7. **Responsive** - Último (sobrescribe para pequeñas pantallas)

✅ El archivo `index.html` ya tiene el orden correcto.

---

## 💾 Git - Ignorar archivos

Si usas Git, quizá quieras ignorar CSS compilado:

```bash
# .gitignore
css/styles.min.css
css/styles.compiled.css
```

Pero mantén los CSS modular en el repo.

---

## 🚨 Debugging

Si algo no se ve como esperaba:

1. **Verifica el orden de carga** en el HTML
2. **Abre DevTools** (F12) → Pestaña "Elements"
3. **Busca la clase** en el inspector
4. **Verifica si hay conflictos** CSS (especificidad)
5. **Usa !important** solo como último recurso

```css
/* Solo si es absolutamente necesario */
.mi-clase {
  color: red !important;
}
```

---

## ✨ Tips

✅ **Do:**
- Mantén CSS específico en su archivo
- Usa clases descriptivas (.test-result-passed, no .tr)
- Agrupa propiedades relacionadas
- Comenta secciones importantes

❌ **Don't:**
- Pongas CSS de pruebas en navegacion.css
- Uses ID's para estilos (usa clases)
- Dejes estilos inline en HTML
- Olvides el responsive.css

---

## 📞 Preguntas

**P: ¿Puedo tener un solo archivo CSS?**
A: Sí, concatena todos en `styles.css`

**P: ¿Los navegadores cargan todos los CSS si hay un error?**
A: Sí, continúan cargando los demás

**P: ¿Es más lento tener muchos archivos CSS?**
A: Con HTTP/2, no. Los navegadores descargan en paralelo.

**P: ¿Cómo organizo CSS para otras vistas?**
A: Crea más archivos: `css/vistas/congruencia-lineal.css`, `css/vistas/cuadrados-medios.css`, etc.
