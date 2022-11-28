const mongoose = require('mongoose'); 

const productosSchema = new mongoose.Schema({
    
    name: String,
    img: String,
    price: Number,
    marca: String,
    modelo: String,
    tamaño: String,
    genero: String,
    condicion: String,
    cantidad: Number,
    tipoDePublicacion: String,
    garantia: String,
    idUsuario: String

});

const Productos = mongoose.model('Productos', productosSchema); 
module.exports = Productos;