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

    /**
 * http://localhost:3000
 * 
 * registrar nuevo usuario
 * @openapi
 * /api/registrar:
 *      post:
 *          tags:
 *              - usuario
 *          summary: "Registrar nuevo usario"
 *          description: "Esta ruta es para registrar un nuevo usuario"
 *          requestBody:
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/User"
 *          responses:
 *                  '201':
 *                      description: El usuario se registra de manera correcta
 *                  '403':
 *                      description: Error por validacion
 */

    router.post('/api/registrar', loginController.apiRegistrar);

    router.get('/registro', loginController.registro);

    router.post('/autenticar', loginController.autenticar);

        /**
 * http://localhost:3000
 * 
 * inicio de session
 * @openapi
 * /api/autenticar:
 *      post:
 *          tags:
 *              - usuario
 *          summary: "Inicio de sesion"
 *          description: "Esta ruta es para iniciar sesion con los datos ya antes registrados"
 *          requestBody:
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/inicioSession"
 *          responses:
 *                  '201':
 *                      description: El usuario inicio session de manera correcta
 *                  '403':
 *                      description: Error por validacion
 */

    router.post('/api/autenticar', loginController.apiAutenticar);

    router.get('/inicioDeSesion', loginController.inicioDeSesion);

    router.get('/logout', loginController.logout);

     // Buscador 
    router.get('/buscar', busquedaController.busqueda);

    router.get('/api/buscar', busquedaController.apiBusqueda);

    // Productos 
    router.get('/productos', productoController.mostrarProductos);

    /**
 * http://localhost:3000
 * 
 * obtener todos los productos
 * @openapi
 * /api/productos:
 *      get:
 *          tags:
 *              - productos
 *          summary: "Obtener todos los productos"
 *          description: "Esta ruta es para obtener todos los productos"
 *          requestBody:
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/Productos"
 *          responses:
 *                  '201':
 *                      description: Se encontraron todos los productos
 *                  '403':
 *                      description: Error en la busqueda de productos 
 */

    router.get('/api/productos', productoController.apiMostrarProductos);

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

    /**
 * http://localhost:3000
 * 
 * crear una orden
 * @openapi
 * /api/orden:
 *      post:
 *          tags:
 *              - orden
 *          summary: "Crear una orden"
 *          description: "Esta ruta es para crear una orden"
 *          security:
 *              - bearerAuth: []
 *          requestBody:
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/Orden"
 *          responses:
 *                  '201':
 *                      description: El usuario creo una orden de manera correcta
 *                  '403':
 *                      description: Error al crear orden   
 */
    router.post('/api/orden', verifyToken, checkoutController.apiOrden);

    // Mis compras y mis publicaciones 
    router.get('/compras/:id', comprasPublicacionesController.misCompras);

    router.get('/publicaciones/:id', comprasPublicacionesController.misPublicaciones);


    return router;
};

// Authorization: Bearer <token>
function verifyToken(req, res, next){
    const bearerHeader =  req.headers['authorization'];

    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(" ")[1];
        req.token = bearerToken;
        next();
    } else {
        res.status(403);
    }
}