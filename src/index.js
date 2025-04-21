
// Carga las variables de entorno definidas en el archivo .env al entorno de Node.js
require('dotenv').config(); 

// Importa la configuración de la aplicación Express desde el archivo server.js
const app = require('./server');

// Importa y ejecuta la conexión a la base de datos desde el archivo database.js
require('./database');

// Inicia el servidor en el puerto especificado en la configuración
app.listen(app.get('port'), () => {
    // Muestra en consola un mensaje indicando que el servidor está en ejecución y en qué puerto
    console.log('Server on port: ', app.get('port'))
})
