const express = require('express');
const app = express(); 
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');
const initDb = require('./libs/db-connection');
const productos = require('./model/productos');
const carrito = require('./model/carrito');
const user = require('./model/user');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

// Routing
app.get('/', async (req, res) => {

	let products =  await productos.find().limit( 4 );
    
	res.render('home', { products });
});

app.get('/registro', async (req, res) => {

	res.render('registro', {})
});

app.get('/inicioDeSesion', async (req, res) => {

	res.render('inicioDeSesion', {})
});

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

	user.findOne({email}, (err, usuario) => {
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
					res.redirect('/');
				}
			});
			
			
		}
	} )

});

app.get('/productos', async (req, res) => {

	let products =  await productos.find({});

	res.render('productos', { products });
});

app.get('/detalleDelProducto/:id', async (req, res) => {
	const id = req.params.id;
    let products = await productos.find({ _id: id }); 

	res.render('detalleDelProducto', { products });
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

app.get('/orden/:id', async (req, res) => {
	const id = req.params.id;

	let ordenes = await carrito.findOne({_id: id}); 

	res.render('orden', {ordenes});
});


const PUERTO = process.env.PORT || 3000;

app.listen(PUERTO, () => {
	console.log(`El servidor esta escuchando en el puerto ${PUERTO}...`);
})

initDb();