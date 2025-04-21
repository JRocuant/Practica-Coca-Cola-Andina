const { Router } = require('express'); // Importamos Router desde Express para definir rutas
const router = Router(); // Creamos una instancia del enrutador

// Importamos los controladores que renderizan las vistas para cada sección del panel de administración
const { 
    renderInicio,
    renderUsuarios, 
    renderTransportes, 
    renderCargarCamionAdmin, 
    renderRetirarPalletAdmin, 
    renderCambioEntreBahiasAdmin, 
    renderTiempos
} = require('../controllers/admin.controller');

// Ruta para el dashboard de inicio de administración
router.get('/admin/inicio', renderInicio);

// Rutas para distintas secciones del panel de administración
router.get('/admin/usuarios', renderUsuarios);                   // Ruta para la gestión de usuarios (estatica)
router.get('/admin/transportes', renderTransportes);             // Ruta para la gestión de transportes (estatica)
router.get('/admin/cargarCamionAdmin', renderCargarCamionAdmin); // Ruta para la vista de carga de camiones
router.get('/admin/retirarPalletAdmin', renderRetirarPalletAdmin); // Ruta para el retiro de pallets
router.get('/admin/cambioEntreBahiasAdmin', renderCambioEntreBahiasAdmin); // Ruta para cambios entre bahías
router.get('/admin/tiempos', renderTiempos);                     // Ruta para visualización de tiempos (estatica)

// Exportamos el enrutador para que pueda ser utilizado en la app principal
module.exports = router;
