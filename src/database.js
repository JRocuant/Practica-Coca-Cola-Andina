const mongoose = require('mongoose') //Importación de mongoose

const {MONGODB_HOST, MONGODB_DATABASE} =process.env; //Importacion informacion del host y base de datos desde .env
const MONGODB_URI = `mongodb://${MONGODB_HOST}/${MONGODB_DATABASE}`; //Incializacion Base de datos

mongoose.connect(MONGODB_URI, { //Conexión con la base de datos
    useUnifiedTopology: true, //Valores predefinidos para conexion local
    useNewUrlParser: true
})

    .then(db => console.log('La base de datos esta conectada'))//Mensaje de confirmación conexion con la base de datos
    .catch(err => console.log(err)); //Mensaje de erro para conexión fallida



/*
COMANDOS BASE DE DATOS
- show dbs : Mostrar bases de datos
- use "name" : Seleccionar base de datos
- show collections : Mostrar colecciones
- db."colección".find() : Buscar/Mostrar elementos de la colección indicada
- db."colección".find().pretty() : Buscar/Mostrar elementos de la colección indicada de manera ordenada
*/
