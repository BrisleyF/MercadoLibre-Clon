const Productos = require('../model/Productos');
const Carrito = require('../model/Carrito');
const Orden = require('../model/Orden');

exports.misCompras = async (req, res) => {
    const id = req.params.id;

	userName = req.session.passport.user.nombre;
	idUsuario = req.session.passport.user.id;

	let ordenes = await Orden.find({idUsuario: id}); 

	res.render('compras', {ordenes, userName, idUsuario})
};

exports.misPublicaciones = async (req, res) => {
    const id = req.params.id;

	userName = req.session.passport.user.nombre;
	idUsuario = req.session.passport.user.id;

	let products = await Productos.find({idUsuario: id});

	let ordenes = await Orden.findOne({idUsuario: id}); 

	res.render('publicaciones', {products, ordenes});
};