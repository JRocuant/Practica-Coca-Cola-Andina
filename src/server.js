const express = require('express'); //Importar express modulo de integración (Para el motor de plantillas Handlebars .hbs)
const {engine} = require('express-handlebars'); //Motor de plantillas para las vistas html en modulos .hbs
const path = require('path'); //Importar rutas (para el acceso entre elementos)
const morgan = require('morgan'); //Importar morgan de express para registrar información sobre las solicitudes entrantes
const methodOverride = require('method-override'); //Para poder eliminar y sobreescribir información
const flash = require('connect-flash'); //Para poder relaizar conexiones entre vistas
const session = require('express-session'); //Para poder inicializar la sesion que utilizara connect-flash
const passport = require('passport'); //Para poder inicializar y verificar credenciales

//Inicializaciones
const app = express();
require('./config/passport');

//Configuración
app.set('port', process.env.PORT || 4000); //Establecer puerto (Si no hay uno designado como PORT utilizar el puerto 4000)
app.set('views', path.join(__dirname, 'views')); //Establecer path para las vistas
app.engine('.hbs',engine({
    defaultLayout: 'main', //Layout Preddeterminado es main.hbs
    layoutsDir: path.join(app.get('views'), 'layouts'), //Carpeta para los layouts
    partialsDir: path.join(app.get('views'), 'partials'), //Carpeta para los partials (modulos de html)
    extname: '.hbs',
    helpers: {
        formatDate: function(date) {
            if (!date) return '';
            return new Date(date).toISOString().split('T')[0];
        }
    }
}));
app.set('view engine', '.hbs');

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev')); //Utilizar morgan en modo desarrollo para ver las solicitudes de la app web
app.use(express.urlencoded({extended: false})); //Utilizar express para traducir a JSON
app.use(methodOverride('_method'));
app.use(session({ //Utilización de express-session
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(flash()); //Utilización de connect flash

//Variables Globales
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

//Rutas
app.use(require('./routes/index.routes'));
app.use(require('./routes/tareas.routes'));
app.use(require('./routes/users.routes'));
app.use(require('./routes/admin.routes'));

//Archivos estaticos
app.use(express.static(path.join(__dirname, 'public')))

module.exports = app;