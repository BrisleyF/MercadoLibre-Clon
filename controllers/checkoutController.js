const Carrito = require('../model/Carrito');
const Orden = require('../model/Orden');

exports.paso1 = async (req, res) => {
    let products = await Carrito.find({}); 

	res.render('checkout', {products});
};

exports.paso2 = async (req, res) => {
    const id = req.params.id;
	const url = req.url;
	direccion = req.query.direccion;
	paquete = req.query.paquete;
	
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