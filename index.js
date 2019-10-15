const express = require('express');
const morgan = require('morgan');
//init
const app = express();//ejecuto express

//settings
app.set('port', process.env.PORT || 4000);//utilizo un puerto asignado o sino el 4000

//middlewares
app.use(morgan('dev'));

//Global
//routes
//public




//starting the server
app.listen(app.get('port'), () => {
    console.log('server on port',app.get('port'));
});