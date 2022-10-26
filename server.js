const express = require('express');
const app = express(); 
const path = require('path');
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

// Routing
app.get('/', (req, res) => {
	res.send("Hola mundo");
});


const PUERTO = process.env.PORT || 3000;

app.listen(PUERTO, () => {
	console.log(`El servidor esta escuchando en el puerto ${PUERTO}...`);
})

