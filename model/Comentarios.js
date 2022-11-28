const mongoose = require('mongoose'); 

const comentarioSchema = new mongoose.Schema({
    comentario: String,
    productId: Object,
    userName: String
});

const Comentario = mongoose.model('Comentario', comentarioSchema); 
module.exports = Comentario;