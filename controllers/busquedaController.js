const Productos = require('../model/Productos');

exports.busqueda = async (req, res) => {
    userName = req.session.passport.user.nombre;
	idUsuario = req.session.passport.user.id;

	if(req.query.buscar) {
		
		console.log(req.query.buscar);

		var products = await Productos.find({ name: { $regex: '.*' + req.query.buscar + '.*', $options: 'i' } });

		res.render('busqueda', { products, valor: req.query.buscar });

	} else {
		res.redirect('/')
	}
};

exports.apiBusqueda = async (req, res) => {
	if(req.query.buscar) {
		
		console.log(req.query.buscar);

		var products = await Productos.find({ name: { $regex: '.*' + req.query.buscar + '.*', $options: 'i' } });

		res.json({ products, valor: req.query.buscar });
	} else {
		res.status(404);
		res.json({error: 'not matched results'})
	}
};