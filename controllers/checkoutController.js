const Carrito = require('../model/Carrito');
const Orden = require('../model/Orden');
const Productos = require('../model/Productos');
const User = require('../model/User');
const jwt = require('jsonwebtoken');

exports.paso1 = async (req, res) => {
    let products = await Carrito.find({}); 

	res.render('checkout', {products});
};

exports.paso2 = async (req, res) => {
    const id = req.params.id;
	const url = req.url;
	direccion = req.query.direccion;
	paquete = req.query.paquete;
	cantidad = req.query.cantidad;
	
	idUsuario = req.session.passport.user.id;

	let products = await Carrito.findOne({_id: id}); 

	const ordenes = new Orden({
		name: products.name,
		img: products.img,
		price: products.price,
		cantidad: products.cantidad,
		total: products.total,
		direccion: direccion,
		paquete: paquete,
		metodoDePago: '',
		date: Date(), 
		idUsuario: idUsuario
	}); 
	
	ordenes.save();
	
	res.render('checkout2', {products, ordenes});
};

exports.confirmacion = async (req, res) => {
    const id = req.params.id;
	const url = req.url;
	metodo = req.query.metodoDePago;	
	
	let products = await Carrito.find({}); 

	const ordenes = await Orden.updateOne(
		{_id: id}, 
		{
			$set: {
				metodoDePago: metodo
			}
		}); 

	let ordenDeCompra = await Orden.findOne({_id: id});

	res.render('checkoutConfirmacion', {products, ordenDeCompra});
};

exports.success = async (req, res) => {
    const id = req.params.id;

	let ordenDeCompra = await Orden.find({_id: id});

	res.render('success', { ordenDeCompra });
};


exports.orden = async (req, res) => {
    const id = req.params.id;

	userName = req.session.passport.user.nombre;
	idUsuario = req.session.passport.user.id;

	let products = await Carrito.find({}); 

	let ordenes = await Orden.find({_id: id}); 

	res.render('orden', {ordenes, userName, products, idUsuario});
};


exports.apiOrden = async (req, res) => {
	const idProducto = req.body.idProducto;
	const cantidad = req.body.cantidad;
	const direccion = req.body.direccion;
	const paquete = req.body.paquete;
	const metodoDePago = req.body.metodoDePago;
	const idUsuario = req.body.idUsuario;

	const decoded = jwt.verify(req.token, 'secretkey');
	
	const user = await User.findById({_id: decoded.payload.sub});
	console.log(user);
	console.log(idUsuario)
	console.log(decoded.payload.sub);
	if (decoded.payload.sub === idUsuario) {
		const order = await createOrder(
			idProducto,
			cantidad,
			direccion,
			paquete,
			metodoDePago,
			idUsuario
		);
	
		res.json(order);
	} else {
		res.status(404).send('El token no corresponde al usuario');
	}

};


async function createOrder(
	idProducto,
	cantidad,
	direccion,
	paquete,
	metodoDePago,
	idUsuario
) {
	//conseguir los datos del producto
	let products = await Productos.findOne({ _id: idProducto });

	console.log(products)
	//procesar el total
	let totalPagar = cantidad * products.price;

	//guardar en la base de datos
	const orden = new Orden({
		name: products.name,
		img: products.img,
		price: products.price,
		cantidad: cantidad,
		total: totalPagar,
		direccion: direccion,
		paquete: paquete,
		metodoDePago: metodoDePago,
		date: Date(),
		idUsuario: idUsuario
	});

	orden.save();

	return orden;
}

