import './style.css'
import { Router } from './core/Router.js'
import { CongruenciaLineal } from './views/Congruencia_lineal.js'
import { CuadradoMedioView } from './views/Cuadrado_medio.js'
import { MultiplicadorConstanteView } from './views/Multiplicador_constante.js'
import { ProductoMedioView } from './views/Producto_medio.js'

const router = new Router('menu-navegacion', 'pantalla-principal')

router.register(new CuadradoMedioView())
router.register(new ProductoMedioView())
router.register(new MultiplicadorConstanteView())
router.register(new CongruenciaLineal())

router.start()