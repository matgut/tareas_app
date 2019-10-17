const express = require('express');
const morgan = require('morgan');
const exphbs  = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const mysqlstore = require('express-mysql-session');
const { database } = require('./keys');


//init
const app = express();//ejecuto express

//settings
app.set('port', process.env.PORT || 4000);//utilizo un puerto asignado o sino el 4000
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partial'),
    extname: '.hbs',
    helpers: require('./libs/handlebars')
}));
app.set('view engine', '.hbs');

//middlewares
app.use(session({
    secret: 'mySesion',
    resave: false,
    saveUninitialized: false,
    store: new mysqlstore(database)
}));
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));//solo se aceptan nombres o textos, no imagenes
app.use(express.json());
app.use(flash());

//Global
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    next();
});

//routes
app.use(require('./routes/index_routes'));
app.use(require('./routes/authentication'));
app.use('/tarea', require('./routes/links'));


//public
app.use(express.static(path.join(__dirname, 'public')));



//starting the server
app.listen(app.get('port'), () => {
    console.log('server on port',app.get('port'));
});
