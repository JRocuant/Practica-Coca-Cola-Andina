const adminCtrl = {}; // Objeto controlador para funciones del panel de administración

// Modelos requeridos para acceder a la base de datos
const CargarCamion = require('../models/CargarCamion'); 
const CambioBahia = require('../models/CambioBahia');
const RetirarPallet = require('../models/RetirarPallet');
const User = require('../models/User');

// Renderiza la vista principal del panel de administración
adminCtrl.renderInicio = (req,res) => {
    res.render('admin/inicio');
};



// Renderiza la vista de administración de usuarios
adminCtrl.renderUsuarios = (req,res) => {
    res.render('admin/usuarios');
};

// Renderiza la vista de administración de transportes
adminCtrl.renderTransportes = (req,res) => {
    res.render('admin/transportes');
};

// Renderiza la vista de administración de carga de camiones con datos procesados
adminCtrl.renderCargarCamionAdmin = async (req, res) => {
    try {
        // Obtiene todos los registros de carga de camiones desde la base de datos
        const registros = await CargarCamion.find().lean();

        // Obtiene todos los usuarios, solo con su id y nombre
        const usuarios = await User.find({}, 'id name').lean();

        // Crea un mapa con los IDs de usuario como clave y los nombres como valor
        const mapaUsuarios = {};
        usuarios.forEach(usuario => {
            mapaUsuarios[usuario.id] = usuario.name;
        });

        // Procesa cada registro para reemplazar el idUsuario por el nombre
        // y parsea la propiedad "cargas" para mostrarla como una lista
        const registrosConNombre = registros.map(registro => {
            let listaCargas = [];
        
            try {
                // Intenta parsear como JSON
                listaCargas = JSON.parse(registro.cargas);
            } catch (e) {
                // Si falla el parseo, divide el string por comas
                listaCargas = registro.cargas.split(',').map(c => c.trim());
            }
        
            return {
                ...registro,
                nombreUsuario: mapaUsuarios[registro.idUsuario] || 'Desconocido', // Asigna nombre o "Desconocido" si no se encuentra
                listaCargas
            };
        });

        // Renderiza la vista con los registros procesados
        res.render('admin/cargarCamionAdmin', { registros: registrosConNombre });

    } catch (error) {
        // Captura y muestra errores
        console.error('Error cargando registros:', error);
        res.status(500).send('Error cargando datos');
    }
};

// Renderiza la vista de administración de retiro de pallets
adminCtrl.renderRetirarPalletAdmin = async (req, res) => {
    try {
        // Obtener todos los registros de retiro de pallets
        const registros = await RetirarPallet.find().lean();

        // Obtener usuarios (id y nombre)
        const usuarios = await User.find({}, 'id name').lean();
        const mapaUsuarios = {};
        usuarios.forEach(usuario => {
            mapaUsuarios[usuario.id] = usuario.name;
        });

        // Agregar el nombre del usuario a cada registro
        const registrosConNombre = registros.map(registro => ({
            ...registro,
            nombreUsuario: mapaUsuarios[registro.idUsuario] || 'Desconocido'
        }));

        // Renderizar la vista con los datos
        res.render('admin/retirarPalletAdmin', { registros: registrosConNombre });

    } catch (error) {
        console.error('Error cargando registros de retiro de pallets:', error);
        res.status(500).send('Error al cargar los datos');
    }
};

// Renderiza la vista de administración de cambios entre bahías con datos procesados
adminCtrl.renderCambioEntreBahiasAdmin = async (req, res) => {
    try {
        // Obtiene todos los registros de cambios entre bahías
        const registros = await CambioBahia.find().lean();

        // Obtiene los usuarios con sus IDs y nombres
        const usuarios = await User.find({}, 'id name').lean();
        const mapaUsuarios = {};
        usuarios.forEach(usuario => {
            mapaUsuarios[usuario.id] = usuario.name;
        });

        // Reemplaza el idUsuario por el nombre correspondiente
        const registrosConNombre = registros.map(registro => ({
            ...registro,
            nombreUsuario: mapaUsuarios[registro.idUsuario] || 'Desconocido'
        }));

        // Renderiza la vista con los registros procesados
        res.render('admin/cambioEntreBahiasAdmin', { registros: registrosConNombre });

    } catch (error) {
        // Captura y muestra errores
        console.error('Error cargando registros de cambio entre bahías:', error);
        res.status(500).send('Error cargando datos');
    }
};

// Renderiza la vista de tiempos (posiblemente para métricas o KPIs)
adminCtrl.renderTiempos = (req,res) => {
    res.render('admin/tiempos');
};

// Exporta el controlador para ser utilizado en las rutas
module.exports = adminCtrl;
