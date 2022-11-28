const mongoose = require('mongoose'); 

const ordenSchema = new mongoose.Schema({
    name: String,
    img: String,
    direccion: String,
    paquete: String,
    metodoDePago: String,
    date: Date,
    idUsuario: String
});

const Orden = mongoose.model('Orden', ordenSchema); 
module.exports = Orden;