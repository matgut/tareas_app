const mysql = require('mysql');
const { database } = require('./keys');
const { promisify } = require('util'); //metodo para transformar a promesas


const pool = mysql.createPool(database);//crea conexion y se ejecuta en secuencia para considerar errores
pool.getConnection((err, connection) =>{
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('CONEXIÓN A LA DB A SIDO CERRADA');
          }
        if (err.code === 'ER_CON_COUNT_ERROR') {
           console.error('DEMACIADAS CONEXIONES PARA LA DB');
        }
        if (err.code === 'ECONNREFUSED') {
          console.error('CONEXION A LA DB HA SIDO RECHAZADA');
        }
        
    }

    if (connection) connection.release();
    console.log('DB CONECTADA');
    return;
});

pool.query = promisify(pool.query);//cada vez que haga una consulta a la db voy a poder usar promesas

module.exports = pool;