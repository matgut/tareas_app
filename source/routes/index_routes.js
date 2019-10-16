const express = require('express');
const router = express.Router();
const pool = require('../database');

router.get('/', async (req, res) => {
    const tareas= await pool.query('SELECT * FROM TAREA');
    res.render('tareas/listar', { tareas } );

});
module.exports = router;