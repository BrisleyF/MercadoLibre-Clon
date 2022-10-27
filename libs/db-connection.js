const mongoose = require('mongoose');

let db;

module.exports = function Connection() {
    if(!db) {
        console.log('se inicio la base de datos');
        db = mongoose.connect('mongodb://localhost:27017/mercadoLibre');
    }

    return db; 
}