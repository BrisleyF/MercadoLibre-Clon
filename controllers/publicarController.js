const Productos = require('../model/Productos');

exports.vender = async (req, res) => {
    
    res.render('vender', {});
};


exports.paso1 = async (req, res) => {
    
    res.render('publicarPaso1', {});
};

exports.paso2 = async (req, res) => {
    const url = req.url;
	nombre = req.query.name;
	condicion = req.query.condicion;
	cantidad = req.query.cantidad;
	imagen = req.query.img;

	let products = new Productos({
		name: nombre,
		condicion: condicion,
		img: imagen,
		cantidad: cantidad
	});

	products.save();

	res.render('publicarPaso2', {products});
};

exports.confirmacion = async (req, res) => {
    const id = req.params.id;
	const url = req.url;
	precio = req.query.price;
	tipoDePublicacion = req.query.tipoDePublicacion;
	garantia = req.query.garantia;

	idUsuario = req.session.passport.user.id;

	let producto = await Productos.findOne({ _id: id }); 
	
	const products = await Productos.updateOne(
		{_id: id}, 
		{
			$set: {
				price: precio,
				tipoDePublicacion: tipoDePublicacion,
				garantia: garantia,
				idUsuario: idUsuario
			}
		}); 

	res.render('publicarConfirmacion', {producto})
};