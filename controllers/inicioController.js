const Productos = require('../model/Productos');

exports.inicio = async (req, res) => {
	userName = req.session.passport.user.nombre;
	idUsuario = req.session.passport.user.id;

    let products =  await Productos.find().limit( 4 );
    
	res.render('home', { products, userName, idUsuario});
};