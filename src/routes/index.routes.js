const { Router } = require('express') // Importamos Router desde Express para definir rutas
const router = Router(); // Creamos una instancia del enrutador

// Importamos funciones del controlador principal (index.controller) que se encargan de renderizar las vistas
const { renderIndex } = require('../controllers/index.controller')

// Ruta para la página principal (landing page o login, según el diseño de tu app)
router.get('/', renderIndex);

// Exportamos el router para que pueda ser usado en el archivo principal del servidor
module.exports = router;
