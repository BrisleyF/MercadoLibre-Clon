const express = require('express');
const app = express(); 
const session = require('express-session');
const passport = require('passport')
const MongoStore = require('connect-mongo');
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');
const initDb = require('./libs/db-connection');
const productos = require('./model/productos');
const carrito = require('./model/carrito');
const user = require('./model/user');
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
app.get('/', verificarUser ,async (req, res) => {
	let products =  await productos.find().limit( 4 );

	userName = req.session.passport.user.nombre;
    
	res.render('home', { products, userName });
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

	res.render('productos', { products, userName });
});

app.get('/detalleDelProducto/:id', async (req, res) => {
	const id = req.params.id;
    let products = await productos.find({ _id: id }); 

	userName = req.session.passport.user.nombre;

	res.render('detalleDelProducto', { products, userName });
});

app.get('/carrito/agregar/:id', async (req, res) => {
    const id = req.params.id;

    let product = await productos.findOne({ _id: id }); 
	

	// agregar al carrito
	const productCarrito = new carrito({
		img: product.img,
		name: product.name,
		price: product.price,
		cantidad: 1,
		total: product.price,
		direccion: 'calle arrioja',
		date: Date(),
		metodoDePago: 'Efectivo'

	}); 
	await carrito.remove();
	await productCarrito.save();

	res.redirect('/checkout' );
    
});

app.get('/checkout', async (req, res) => {
	let products = await carrito.find({}); 

	res.render('checkout', {products});
});

app.get('/checkout2', async (req, res) => {
	let products = await carrito.find({}); 

	res.render('checkout2', {products});
});

app.get('/checkoutConfirmacion', async (req, res) => {
	let products = await carrito.find({}); 

	res.render('checkoutConfirmacion', {products});
});

app.get('/success', async (req, res) => {
	let products = await carrito.find({}); 

	res.render('success', {products});
});

app.get('/orden/:id', async (req, res) => {
	const id = req.params.id;

	userName = req.session.passport.user.nombre;

	let products = await carrito.find({}); 

	let ordenes = await carrito.findOne({_id: id}); 

	res.render('orden', {ordenes, userName, products});
});


const PUERTO = process.env.PORT || 3000;

app.listen(PUERTO, () => {
	console.log(`El servidor esta escuchando en el puerto ${PUERTO}...`);
})

initDb();