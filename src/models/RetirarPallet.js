const {Schema, model} = require('mongoose');

const RetirarPalletSchema = new Schema({
    operacionInicio: { type: Date },
    operacionFin: { type: Date },
    codigoTicket: { type: String },
    turno: { type: String },
    codigoTarea: { type: String },
    bahiaCarga: { type: Number },
    transporte: { type: Number },
    duracion: { type: String },
    idUsuario: { type: String }
    
});

module.exports = model('RetirarPallet', RetirarPalletSchema);


