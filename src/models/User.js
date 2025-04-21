const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    rol: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    id: { type: String }  // Agregar un campo id como string
}, {
    timestamps: true
});

// Hook pre-save para asignar el _id como string al campo id
UserSchema.pre('save', function(next) {
    if (this.isNew) {  // Si el documento es nuevo
        this.id = this._id.toString();  // Convertir el _id a string y guardarlo en id
    }
    next();
});

// Métodos para encriptar y comparar la contraseña
UserSchema.methods.encriptarPassword = async password => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

UserSchema.methods.compararPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = model('User', UserSchema);
