const tareasCtrl = {}; // Objeto donde se almacenarán todas las funciones del controlador

// Importación de modelos de Mongoose para interactuar con la base de datos
const Tarea = require('../models/Tarea')
const CargarCamion = require('../models/CargarCamion');
const RetirarPallet = require('../models/RetirarPallet');
const CambioBahia = require('../models/CambioBahia');

// Renderiza el formulario para crear una nueva tarea
tareasCtrl.renderTareaForm = (req,res) => {
    res.render('tareas/tarea-nueva');
};

// Crea una nueva tarea y la guarda en la base de datos
tareasCtrl.crearTarea = async (req,res) => {
    console.log(req.body)
    const {idTarea:idTarea} = req.body;
    const newTarea = new Tarea({idTarea});
    console.table(newTarea);
    await newTarea.save()    
    req.flash('success_msg', 'Tarea registrada correctamente'); // Mensaje flash para el usuario
    res.redirect('/tareass');
};

// Muestra todas las tareas de tipo CargarCamion
tareasCtrl.renderTareas = async(req,res) => {
    const cargarcamions = await CargarCamion.find().lean(); // Consulta la colección
    res.render('tareas/all-tareas', { cargarcamions });
};

// Renderiza el formulario para editar una tarea existente
tareasCtrl.renderEditForm = async(req,res) => {
    const tarea = await Tarea.findById(req.params.id).lean();
    console.log(tarea);
    res.render('tareas/edit-tarea', { tarea });
};

// Actualiza una tarea en la base de datos
tareasCtrl.updateTarea = async (req,res) => {
    console.log(req.body)
    const {idTarea} = req.body;
    await Tarea.findByIdAndUpdate(req.params.id, {idTarea});
    req.flash('success_msg', 'Tarea actualizada correctamente');
    res.redirect('/tareass');
};

// Elimina una tarea de la base de datos
tareasCtrl.eliminarTarea = async(req,res) =>{
    await Tarea.findByIdAndDelete(req.params.id);
    res.redirect('/tareass');
};

// Renderiza la vista de selección de tarea
tareasCtrl.seleccion = (req, res) =>{
    res.render('tareas/seleccion');
};

// Renderiza pantalla de espera (uso en handheld posiblemente)
tareasCtrl.espera = (req, res) =>{
    res.render('tareas/espera');
};

// Renderiza vista para escanear la bahía
tareasCtrl.escanearBahia = (req, res) =>{
    res.render('tareas/escanearBahia');
};

// Renderiza vista de espera durante la carga del camión
tareasCtrl.esperaCargaCamion = (req, res) =>{
    res.render('tareas/esperaCargaCamion');
};

// Renderiza un resumen al finalizar la carga del camión
tareasCtrl.resumenCargaCamion = (req, res) =>{
    res.render('tareas/resumenCargaCamion');
};

// Renderiza vista de espera durante el cambio de bahía
tareasCtrl.esperaCambioBahia = (req, res) =>{
    res.render('tareas/esperaCambioBahia');
};

// Renderiza vista para escanear un pallet durante el cambio de bahía
tareasCtrl.escanearPalletCambio = (req, res) =>{
    res.render('tareas/escanearPalletCambio');
};

// Vista duplicada: espera durante cambio de bahía (deberías considerar unificar esta si es repetida)
tareasCtrl.esperaCambioBahia = (req, res) =>{
    res.render('tareas/esperaCambioBahia');
};

// Vista de espera para retiro de pallet
tareasCtrl.esperaPallet = (req, res) =>{
    res.render('tareas/esperaPallet');
};

// Guarda en la base de datos una operación de carga de camión
tareasCtrl.guardarCargaCamion = async (req, res) => {
    try {
        const { codigoTarea, cargas, operacionInicio, operacionFin, duracionSegundos, codigoEscaneado, transporte, turno, idUsuario } = req.body;

        const nuevaCarga = new CargarCamion({
            operacionInicio: operacionInicio,
            operacionFin: operacionFin,
            codigoTicket: codigoEscaneado,
            turno: turno,
            codigoTarea: codigoTarea,
            cargas: JSON.stringify(cargas), // Se convierte a string para guardar en DB
            transporte: transporte, 
            duracion: duracionSegundos,
            idUsuario: idUsuario  
        });

        await nuevaCarga.save();
        res.status(200).json({ message: "Carga guardada correctamente" });
    } catch (error) {
        console.error("Error al guardar la carga:", error);
        res.status(500).json({ message: "Error al guardar la carga" });
    }
};

// Guarda en la base de datos una operación de retiro de pallet
tareasCtrl.guardarPalletListo = async (req, res) => { 
    try {
        const { codigoTarea, codigoBahia, operacionInicio, operacionFin, duracionSegundos, codigoEscaneado, transporte, turno, idUsuario } = req.body;

        const palletListo = new RetirarPallet({
            operacionInicio: operacionInicio,
            operacionFin: operacionFin, 
            codigoTicket: codigoEscaneado,
            turno: turno, 
            codigoTarea: codigoTarea,
            bahiaCarga: codigoBahia, 
            transporte: transporte, 
            duracion: duracionSegundos,
            idUsuario: idUsuario  
        });

        await palletListo.save();
        res.status(200).json({ message: "Carga guardada correctamente" });
    } catch (error) {
        console.error("Error al guardar la carga:", error);
        res.status(500).json({ message: "Error al guardar la carga" });
    }
};

// Guarda en la base de datos una operación de cambio de bahía
tareasCtrl.guardarCambioBahia = async (req, res) => {
    try {
        const { operacionInicio, operacionFin, codigoEscaneado, codigoTarea, palletConfirmado, bahiaInicial, bahiaDestino, transporte, turno, duracionSegundos, idUsuario } = req.body;

        const cargaCambiada = new CambioBahia({
            operacionInicio: operacionInicio,
            operacionFin: operacionFin,
            codigoTicket: codigoEscaneado,
            turno: turno,
            codigoTarea: codigoTarea,
            palletCambiado: palletConfirmado,
            bahiaInicial: bahiaInicial,
            bahiaFinal: bahiaDestino,
            transporte: transporte, 
            duracion: duracionSegundos,
            idUsuario: idUsuario 
        });

        await cargaCambiada.save();
        res.status(200).json({ message: "Carga guardada correctamente" });
    } catch (error) {
        console.error("Error al guardar la carga:", error);
        res.status(500).json({ message: "Error al guardar la carga" });
    }
};

// Verifica si el código de ticket ya existe en la colección de CargarCamion
tareasCtrl.verificarTicket = async (req, res) => {
    try {
        const { codigoTicket } = req.body;
        const ticketExistente = await CargarCamion.findOne({ codigoTicket: codigoTicket });

        if (ticketExistente) {
            res.status(200).json({ exists: true, message: "El código ya existe" });
        } else {
            res.status(200).json({ exists: false, message: "El código es válido" });
        }
    } catch (error) {
        console.error("Error al verificar el ticket:", error);
        res.status(500).json({ message: "Error en la verificación" });
    }
};

// Exporta el controlador para usarlo en las rutas
module.exports = tareasCtrl;
