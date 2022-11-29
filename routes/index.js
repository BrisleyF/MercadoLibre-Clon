const express = require('express');
const router = express.Router();
const verificarUser = require('../middleware/verificarUser');
const inicioController = require('../controllers/inicioController');
const busquedaController = require('../controllers/busquedaController');
const loginController = require('../controllers/loginController');
const productoController = require('../controllers/productoController');
const publicarController = require('../controllers/publicarController');
const checkoutController = require('../controllers/checkoutController');
const comprasPublicacionesController = require('../controllers/comprasPublicacionesController');

module.exports = function() {

    // Inicio
    router.get('/', verificarUser, inicioController.inicio);

    // Login y registro
    router.post('/registrar', loginController.registrar);

    router.get('/registro', loginController.registro);

    router.post('/autenticar', loginController.autenticar);

    router.get('/inicioDeSesion', loginController.inicioDeSesion);

    router.get('/logout', loginController.logout);

     // Buscador 
    router.get('/buscar', busquedaController.busqueda);

    // Productos 
    router.get('/productos', productoController.mostrarProductos);

    router.get('/detalleDelProducto/:id', productoController.mostrarProducto);

    router.get('/comentario/:id', productoController.comentarioDelProducto);

    router.get('/carrito/agregar/:id', productoController.agregarProductoAlCarrito);

    // Publicar productos 
    router.get('/vender', publicarController.vender);

    router.get('/publicarPaso1', publicarController.paso1);

    router.get('/publicarPaso2', publicarController.paso2);

    router.get('/publicarConfirmacion/:id', publicarController.confirmacion);

    // Checkout y orden 
    router.get('/checkout', checkoutController.paso1);

    router.get('/checkout2/:id', checkoutController.paso2);

    router.get('/checkoutConfirmacion/:id', checkoutController.confirmacion);

    router.get('/success/:id', checkoutController.success);

    router.get('/orden/:id', checkoutController.orden);

    // Mis compras y mis publicaciones 
    router.get('/compras/:id', comprasPublicacionesController.misCompras);

    router.get('/publicaciones/:id', comprasPublicacionesController.misPublicaciones);


    return router;
};