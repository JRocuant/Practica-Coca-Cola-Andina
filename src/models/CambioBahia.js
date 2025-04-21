const {Schema, model} = require('mongoose');

const CambioBahiaSchema = new Schema({
    operacionInicio: { type: Date },
    operacionFin: { type: Date },
    turno: { type: String },
    codigoTarea: { type: String },
    palletCambiado: { type: String} ,
    bahiaInicial: { type: Number },
    bahiaFinal: { type: Number },
    transporte: { type: Number },
    duracion: { type: String },
    idUsuario: { type: String }
    
});

module.exports = model('CambioBahia', CambioBahiaSchema);
