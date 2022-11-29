const Productos = require('../model/Productos');
const Comentarios = require('../model/Comentarios');
const Carrito = require('../model/Carrito');

exports.mostrarProductos = async (req, res) => {
    userName = req.session.passport.user.nombre;
	idUsuario = req.session.passport.user.id;

    let products =  await Productos.find({});

	res.render('productos', { products, userName, idUsuario });
};

exports.mostrarProducto = async (req, res) => {
    const id = req.params.id;
	const url = req.url;

	userName = req.session.passport.user.nombre;
	idUsuario = req.session.passport.user.id;

	let mensaje = await Comentarios.find({ productId: id });

	let products = await Productos.find({ _id: id }); 

	res.render('detalleDelProducto', { products, userName, idUsuario, mensaje });
};

exports.comentarioDelProducto = async (req, res) => {
    const id = req.params.id;
	const url = req.url;
	let comentario = req.query.comentario;

	userName = req.session.passport.user.nombre;

	const comentarioDelProducto = new Comentarios({
		comentario: comentario,
		productId: id,
		userName: userName
	});

	comentarioDelProducto.save();

	res.redirect(`/detalleDelProducto/${id}`);
};

exports.agregarProductoAlCarrito = async (req, res) => {
    const id = req.params.id;
	const url = req.url;
	cantidad = req.query.cantidad;
	console.log(url);
	console.log(cantidad);

	idUsuario = req.session.passport.user.id;
	
    let product = await Productos.findOne({ _id: id }); 

	let totalPagar = cantidad * product.price;
	console.log(totalPagar);
	
	// agregar al carrito
	const productCarrito = new Carrito({
		img: product.img,
		name: product.name,
		price: product.price,
		cantidad: cantidad,
		total: totalPagar,
		idUsuario: idUsuario
	}); 

	await Carrito.remove();
	productCarrito.save();
	
	res.redirect('/checkout' );
};
