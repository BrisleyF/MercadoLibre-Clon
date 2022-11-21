const express = require('express');
const app = express(); 
const session = require('express-session');
const passport = require('passport')
const MongoStore = require('connect-mongo');
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');
const queryString = require('query-string');
const initDb = require('./libs/db-connection');
const productos = require('./model/productos');
const carrito = require('./model/carrito');
const user = require('./model/user');
const orden = require('./model/orden');
const verificarUser = require('./middleware/verificarUser');

const MONGO_URL = 'mongodb://localhost:27017/mercadoLibre';

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
	secret: 'esto es un secreto',
	resave: true,
	saveUninitialized: true,
	store: new MongoStore({
		mongoUrl: MONGO_URL,
		autoReconnect: true
	})
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((usuario, done) => done(null, { id: usuario._id, nombre: usuario.nombre }));
passport.deserializeUser(async(usuario, done) => {
	const userDb = await user.findById(usuario.id);
	return done(null, { id: userDb._id, nombre: userDb.nombre })
})

app.use(function(req, res, next) {
	//console.log(req.session.id);

	//req.session.cuenta = req.session.cuenta ? req.session.cuenta + 1 : 1;
	//console.log(`Has visto esta pagina: ${req.session.cuenta}`)
	
	next();
});

// Routing
app.get('/', verificarUser, async (req, res) => {
	let products =  await productos.find().limit( 4 );

	userName = req.session.passport.user.nombre;
	idUsuario = req.session.passport.user.id;
    
	res.render('home', { products, userName, idUsuario });
});

app.get('/registro', async (req, res) => {

	res.render('registro', {})
});

app.get('/inicioDeSesion', async (req, res) => {

	res.render('inicioDeSesion', {})
});

app.get('/logout', async (req,res) => {
	req.logout(function(err) {
		if (err) { return next(err); }
		res.redirect('/inicioDeSesion')
	});
})

app.post('/registrar', async (req, res) => {
	const {nombre, email, clave} = req.body;
	console.log('req.body', req.body)

	const usuario = new user({nombre, email, clave});

	usuario.save(err => {
		if (err) {
			res.status(500).send('ERROR AL REGISTRAR EL USUARIO');
		} else {
			res.redirect('/inicioDeSesion');
		}
	})
	
});

app.post('/autenticar', async (req, res) => {
	const {email, clave} = req.body;

	let usuario = user.findOne({email}, (err, usuario) => {
		if (err) {
			res.status(500).send('ERROR AL AUTENTICAR EL USUARIO');
		} else if (!usuario) {
			res.status(500).send('EL USUARIO NO EXISTE');
		} else {
			user.findOne({clave}, (err, usuario) => {
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
});

app.get('/productos', async (req, res) => {
	let products =  await productos.find({});

	userName = req.session.passport.user.nombre;
	idUsuario = req.session.passport.user.id;

	res.render('productos', { products, userName, idUsuario });
});

app.get('/detalleDelProducto/:id', async (req, res) => {
	const id = req.params.id;
    let products = await productos.find({ _id: id }); 

	userName = req.session.passport.user.nombre;
	idUsuario = req.session.passport.user.id;

	res.render('detalleDelProducto', { products, userName, idUsuario });
});

app.get('/carrito/agregar/:id', async (req, res) => {
    const id = req.params.id;
	const url = req.url;
	cantidad = req.query.cantidad;
	console.log(url);
	console.log(cantidad);

	idUsuario = req.session.passport.user.id;
	
    let product = await productos.findOne({ _id: id }); 

	let totalPagar = cantidad * product.price;
	console.log(totalPagar);
	
	// agregar al carrito
	const productCarrito = new carrito({
		img: product.img,
		name: product.name,
		price: product.price,
		cantidad: cantidad,
		total: totalPagar,
		idUsuario: idUsuario
	}); 

	await carrito.remove();
	productCarrito.save();
	
	res.redirect('/checkout' );
});

app.get('/vender', async (req, res) => {

	res.render('vender', {});
});

app.get('/publicarPaso1', async (req, res) => {

	res.render('publicarPaso1', {});
});

app.get('/publicarPaso2', async (req, res) => {
	const url = req.url;
	nombre = req.query.name;
	condicion = req.query.condicion;
	cantidad = req.query.cantidad;
	imagen = req.query.img;

	let products = new productos({
		name: nombre,
		condicion: condicion,
		img: imagen,
		cantidad: cantidad
	});

	products.save();

	res.render('publicarPaso2', {products});
});

app.get('/publicarConfirmacion/:id', async (req, res) => {
	const id = req.params.id;
	const url = req.url;
	precio = req.query.price;
	tipoDePublicacion = req.query.tipoDePublicacion;
	garantia = req.query.garantia;

	idUsuario = req.session.passport.user.id;

	let producto = await productos.findOne({ _id: id }); 
	
	const products = await productos.updateOne(
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
});

app.get('/checkout', async (req, res) => {
	let products = await carrito.find({}); 

	res.render('checkout', {products});
});

app.get('/checkout2/:id', async (req, res) => {
	const id = req.params.id;
	const url = req.url;
	direccion = req.query.direccion;
	paquete = req.query.paquete;
	console.log(url);
	console.log(direccion);
	console.log(paquete);

	idUsuario = req.session.passport.user.id;

	let products = await carrito.findOne({_id: id}); 

	const ordenes = new orden({
		name: products.name,
		img: products.img,
		direccion: direccion,
		paquete: paquete,
		metodoDePago: '',
		date: Date(), 
		idUsuario: idUsuario
	}); 
	
	ordenes.save();
	
	res.render('checkout2', {products, ordenes});
});

app.get('/checkoutConfirmacion/:id', async (req, res) => {
	const id = req.params.id;
	const url = req.url;
	metodo = req.query.metodoDePago;	
	console.log(id)
	console.log(url);
	console.log(metodo);

	
	let products = await carrito.find({}); 

	const ordenes = await orden.updateOne(
		{_id: id}, 
		{
			$set: {
				metodoDePago: metodo
			}
		}); 

	let ordenDeCompra = await orden.findOne({_id: id});

	res.render('checkoutConfirmacion', {products, ordenDeCompra});
});

app.get('/success/:id', async (req, res) => {
	const id = req.params.id;

	let ordenDeCompra = await orden.find({_id: id});

	res.render('success', { ordenDeCompra });
});

app.get('/orden/:id', async (req, res) => {
	const id = req.params.id;

	userName = req.session.passport.user.nombre;
	idUsuario = req.session.passport.user.id;

	let products = await carrito.find({}); 

	let ordenes = await orden.findOne({_id: id}); 


	res.render('orden', {ordenes, userName, products, idUsuario});
});

app.get('/compras/:id', async (req, res) => {
	const id = req.params.id;

	userName = req.session.passport.user.nombre;
	idUsuario = req.session.passport.user.id;


	let ordenes = await orden.find({idUsuario: id}); 

	res.render('compras', {ordenes, userName, idUsuario})
});

app.get('/publicaciones/:id', async (req, res) => {
	const id = req.params.id;

	userName = req.session.passport.user.nombre;
	idUsuario = req.session.passport.user.id;

	let products = await productos.find({idUsuario: id});

	let ordenes = await orden.findOne({idUsuario: id}); 

	res.render('publicaciones', {products, ordenes})
})


const PUERTO = process.env.PORT || 3000;

app.listen(PUERTO, () => {
	console.log(`El servidor esta escuchando en el puerto ${PUERTO}...`);
})

initDb();