const mongoose = require('mongoose'); 

const carritoSchema = new mongoose.Schema({
    
    img: String,
    name: String,
    price: Number,
    cantidad: Number,
    total: Number,
    idUsuario: String
});

const Carrito = mongoose.model('Carrito', carritoSchema); 
module.exports = Carrito;