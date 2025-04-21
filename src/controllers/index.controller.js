const indexCtrl = {}; // Objeto para almacenar los métodos del controlador principal

// Método para renderizar la página principal
indexCtrl.renderIndex = (req, res) => {
    res.render('index'); // Renderiza la vista llamada 'index'
};

// Se exporta el objeto indexCtrl para poder usarlo en otras partes de la aplicación
module.exports = indexCtrl;
