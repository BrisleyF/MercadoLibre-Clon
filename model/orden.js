const mongoose = require('mongoose'); 

const ordenSchema = new mongoose.Schema({
    
    direccion: String,
    paquete: String,
    metodoDePago: String,
    date: Date,
});

const orden = mongoose.model('orden', ordenSchema); 
module.exports = orden;