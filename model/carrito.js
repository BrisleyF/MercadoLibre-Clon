const mongoose = require('mongoose'); 

const carritoSchema = new mongoose.Schema({
    
    img: String,
    name: String,
    price: Number,
    cantidad: Number,
    total: Number,
});

const carrito = mongoose.model('carrito', carritoSchema); 
module.exports = carrito;