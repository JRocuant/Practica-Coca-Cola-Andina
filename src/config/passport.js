const passport = require('passport'); // Importar el módulo Passport para la autenticación
const LocalStrategy = require('passport-local').Strategy; // Importar la estrategia local (usuario y contraseña)

const User = require('../models/User'); // Importar el modelo de usuario desde la carpeta models

// Configurar la estrategia local de Passport
passport.use(new LocalStrategy({
    usernameField: 'email',        // Usamos "email" como campo de usuario
    passwordField: 'password'      // Usamos "password" como campo de contraseña
}, async (email, password, done) => {
    try {
        // Buscar un usuario en la base de datos por su email
        const user = await User.findOne({ email });
        if (!user) {
            // Si no se encuentra, devolver error de autenticación
            return done(null, false, { message: 'Usuario no encontrado' });
        }

        // Verificar si la contraseña ingresada coincide con la almacenada
        const isMatch = await user.compararPassword(password);
        if (!isMatch) {
            // Si no coinciden, devolver error de autenticación
            return done(null, false, { message: 'Contraseña incorrecta' });
        }

        // Si el email y la contraseña son correctos, autenticamos al usuario
        return done(null, user);
    } catch (err) {
        // En caso de error en la base de datos u otro, retornar el error
        return done(err);
    }
}));

// Serialización del usuario: guarda solo el ID en la sesión
passport.serializeUser((user, done) =>{
    done(null, user.id);
});

// Deserialización del usuario: a partir del ID, recupera el usuario completo
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id); // Buscar usuario por su ID
        done(null, user); // Retorna el usuario completo
    } catch (err) {
        done(err, null); // En caso de error, pasar el error a done
    }
});
