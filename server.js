const express = require('express');
const app = express(); 
const path = require('path');
const bodyParser = require('body-parser');
const initDb = require('./libs/db-connection');
const productos = require('./model/productos');
const carrito = require('./model/carrito');

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


	// if () {}

	
	// agregar al carrito
    const productCarrito = new carrito({
        name: products.name,
        price: products.price,
        cantidad: 1,
        total: 50
    }); 

    await productCarrito.save();


	res.render('detalleDelProducto', { products });
});

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