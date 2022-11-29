const express = require('express');
const app = express(); 
const routes = require('./routes')
const session = require('express-session');
const passport = require('passport')
const MongoStore = require('connect-mongo');
const path = require('path');
const bodyParser = require('body-parser');
const initDb = require('./libs/db-connection');
const User = require('./model/User');


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
	const userDb = await User.findById(usuario.id);
	return done(null, { id: userDb._id, nombre: userDb.nombre })
})

app.use(function(req, res, next) {
	//console.log(req.session.id);

	//req.session.cuenta = req.session.cuenta ? req.session.cuenta + 1 : 1;
	//console.log(`Has visto esta pagina: ${req.session.cuenta}`)
	
	next();
});

// Rutas de la App
app.use('/', routes());


const PUERTO = process.env.PORT || 3000;

app.listen(PUERTO, () => {
	console.log(`El servidor esta escuchando en el puerto ${PUERTO}...`);
})

initDb();