const express = require('express');
const app = express(); 
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');
const initDb = require('./libs/db-connection');
const productos = require('./model/productos');
const carrito = require('./model/carrito');
const { updateOne } = require('./model/carrito');

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
	

	let preciototal = 0

	if (product.cantidad) {
		let preciototal = product.cantidad * product.price
	}


	/*// agregar al carrito
	const productCarrito = new carrito({
		name: product.name,
		price: product.price,
		cantidad: 1,
		total: preciototal
	}); 

	await productCarrito.save();*/

	res.redirect('/checkout' );
    
});

app.post('/carrito/agregar', async (req, res) => {
	console.log('req.body', req.body)
    let body = req.body; 

	let preciototal = 0

	const productCarrito = carrito.updateOne({
		cantidad: body.cantidad
	}); 

    const order = await productCarrito.save();

	res.json(order)
})

app.get('/checkout', (req, res) => {
	res.render('checkout');
});

app.get('/orden', (req, res) => {
	res.render('orden');
});


const PUERTO = process.env.PORT || 3000;

app.listen(PUERTO, () => {
	console.log(`El servidor esta escuchando en el puerto ${PUERTO}...`);
})

initDb();