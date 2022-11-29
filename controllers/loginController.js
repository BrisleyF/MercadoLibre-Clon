const User = require('../model/User');

exports.registrar = async (req, res) => {
    const {nombre, email, clave} = req.body;
	console.log('req.body', req.body)

	const usuario = new User({nombre, email, clave});

	usuario.save(err => {
		if (err) {
			res.status(500).send('ERROR AL REGISTRAR EL USUARIO');
		} else {
			res.redirect('/inicioDeSesion');
		}
	});
};

exports.registro = async (req, res) => {
    res.render('registro', {});
};

exports.autenticar = async (req, res) => {
    const {email, clave} = req.body;

	let usuario = User.findOne({email}, (err, usuario) => {
		if (err) {
			res.status(500).send('ERROR AL AUTENTICAR EL USUARIO');
		} else if (!usuario) {
			res.status(500).send('EL USUARIO NO EXISTE');
		} else {
			User.findOne({clave}, (err, usuario) => {
				if (err) {
					res.status(500).send('ERROR AL AUTENTICAR');
				} else if (!usuario) {
					res.status(500).send('LA CLAVE NO COINCIDE');
				} else {
					req.login(usuario, function(err) {
						if(err){
							Error('Error al crear session');
							console.log('Error al crear session');
						}
						return res.redirect('/');
					})
				}
			});
		}
	});
};

exports.inicioDeSesion = async (req, res) => {
    res.render('inicioDeSesion', {})
};

exports.logout = async (req, res) => {
    req.logout(function(err) {
		if (err) { return next(err); }
		res.redirect('/inicioDeSesion')
	});
};

