const express = require('express');
const router = express.Router();
const dateTimeFormat = require('dateformat');

const pool = require('../database');

router.get('/agregar', (req, res) => {
    res.render('tareas/agregar');
});

router.post('/agregar', async (req, res) => {
    const { name_task, status_task, descrip_task} = req.body;
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+' '+today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const newTask = {
        name_task,
        descrip_task,
        status_task,
        fc_creation: date,
        fc_update: date,
        id_usuario: 1
    };

    console.log(newTask);
    await pool.query('INSERT INTO TAREA SET ?',[newTask]);
    res.redirect('/');
});

router.get('/eliminar/:id', async (req, res) => {
    const { id } = req.params
    await pool.query('DELETE FROM TAREA WHERE ID = ?',[id]);
    res.redirect('/');
})

router.get('/editar/:id', async (req, res) => {
    const { id } = req.params;
    const tareaEdit = await pool.query('SELECT * FROM TAREA WHERE ID = ?',[id]);
    console.log(tareaEdit[0]);
    res.render('tareas/editar', {tareaEdit: tareaEdit[0]});
})

router.post('/editar/:id', async (req, res) => {
    const { id } = req.params;
    const { name_task, status_task, descrip_task} = req.body;
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+' '+today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const newEditTask = {
         name_task,
         descrip_task,
         status_task,
         fc_update: date,
    };
    console.log(newEditTask.name_task);
    console.log(newEditTask.descrip_task);
    console.log(newEditTask.status_task);
    console.log(newEditTask.fc_update);
    await pool.query('UPDATE TAREA SET name_task = ?, descrip_task = ?, status_task = ?, fc_update = ? WHERE id = ?',[newEditTask.name_task,newEditTask.descrip_task,newEditTask.status_task,newEditTask.fc_update,id]);
    res.redirect('/');
})

module.exports = router;