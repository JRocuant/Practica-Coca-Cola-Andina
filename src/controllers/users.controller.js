const { text } = require("express"); //Importación de express

const usersCtrl = {}; // Objeto donde se almacenan los métodos del controlador de usuarios

const passport = require('passport'); // Middleware de autenticación

const User = require('../models/User') // Modelo de usuario 

const fs = require('fs'); // Módulo para manejar archivos del sistema
const path = require('path'); // Módulo para manipular rutas de archivos
const csv = require('csv-parser'); // Librería para parsear archivos CSV

// Muestra el formulario de registro de usuario
usersCtrl.renderSignUpForm = (req, res) => {
    res.render('users/signup');
};

// Maneja la lógica del registro de usuario
usersCtrl.signup = async (req, res) => {
    console.log(req.body)
    const errors = [];
    const {name, email, password, confirm_password, rol} = req.body;

    // Validación: contraseñas no coinciden
    if (password != confirm_password) {
        errors.push({text: 'Las Contraseñas no coinciden'});
    }

    // Validación: contraseña demasiado corta
    if (password.length < 4) {
        errors.push({text: 'La contraseña debe tener al menos 4 caracteres'});
    }

    // Si hay errores, volver a renderizar el formulario con mensajes
    if (errors.length > 0){
        res.render('users/signup', {
            errors,
            name,
            email
        })
    } else {
        // Verificar si el correo ya existe en la base de datos
        const emailUser = await User.findOne({email: email});
        if (emailUser) {
            req.flash('error_msg', 'Este correo electronico ya se encuentra en uso.');
            res.redirect('/users/signup');
        } else {
            // Crear nuevo usuario y guardar en la base de datos
            const newUser = new User({name, email, password, rol});
            newUser.password = await newUser.encriptarPassword(password) // Encriptar la contraseña
            await newUser.save();
            // Redirigir a la página principal después del registro
            res.redirect('/');
        }
    }
};

// Muestra el formulario de inicio de sesión
usersCtrl.renderSigninForm = (req, res) => {
    res.render('users/signin');
};

// Maneja el inicio de sesión con Passport
usersCtrl.signin = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err); // Error del sistema
        if (!user) {
            req.flash('error_msg', info.message); // Usuario no autenticado
            return res.redirect('/');
        }

        // Iniciar sesión con el usuario autenticado
        req.logIn(user, (err) => {
            if (err) return next(err);
            console.log(user);

            // Extraer datos del usuario
            const { name, email, _id, rol } = user;
            const transportes = {};
            const palletMaximo = {};
            let headers = [];

            // Leer archivo CSV con datos de transporte
            fs.createReadStream(path.resolve(__dirname, '..', 'public', 'datos', 'RP2.csv'))
                .pipe(csv({ separator: ',' }))
                .on('headers', (headerRow) => {
                    headers = headerRow; // Guardar encabezados del CSV
                })
                .on('data', (data) => {
                    const transporte = data[headers[0]];
                    const pallet = parseInt(data[headers[1]], 10);

                    if (isNaN(pallet)) {
                        console.warn(`Valor de pallet no válido: ${data[headers[1]]}`);
                        return;
                    }

                    if (!transportes[transporte]) {
                        transportes[transporte] = new Set();
                    }

                    transportes[transporte].add(pallet); // Añadir pallet al set del transporte correspondiente
                })
                .on('end', () => {
                    // Convertir sets a arrays y calcular el pallet máximo por transporte
                    for (const transporte in transportes) {
                        transportes[transporte] = Array.from(transportes[transporte]);
                        palletMaximo[transporte] = Math.max(...transportes[transporte]);
                    }

                    // Renderizar la vista post-login con los datos del usuario y CSV
                    res.render('users/postlogin', { 
                        name, 
                        email, 
                        id: _id,
                        rol, 
                        transportes: JSON.stringify(transportes),
                        palletMaximo: JSON.stringify(palletMaximo) 
                    });

                    
                })
                .on('error', (err) => {
                    console.error('Error al procesar el archivo CSV:', err.message);
                    res.status(500).send('Error al procesar el archivo CSV');
                });
        });
    })(req, res, next); // Llamada a la función middleware devuelta por `passport.authenticate`
};

/*
- - - TESTEAR DESDE CONSOLA - - -
const usuario = JSON.parse(localStorage.getItem('usuarioActual'));
console.log(usuario); 
*/

// Controlador para cerrar sesión (aún sin implementación real)
usersCtrl.logout = (req, res) => {
    res.send('logout');
}

// Muestra el formulario para recuperar la contraseña
usersCtrl.olvido = (req, res) => {
    res.render('users/olvido');
}

// Exportar el objeto controlador
module.exports = usersCtrl;
