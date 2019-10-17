const express = require('express');
const router = express.Router();
const dateTimeFormat = require('dateformat');
const excel = require('exceljs');


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

    await pool.query('INSERT INTO TAREA SET ?',[newTask]);
    req.flash('success','Tarea agregada correctamente');
    res.redirect('/');
});

router.get('/eliminar/:id', async (req, res) => {
    const { id } = req.params
    await pool.query('DELETE FROM TAREA WHERE ID = ?',[id]);
    req.flash('success','Tarea Eliminada correctamente');
    res.redirect('/');
})

router.get('/editar/:id', async (req, res) => {
    const { id } = req.params;
    const tareaEdit = await pool.query('SELECT * FROM TAREA WHERE ID = ?',[id]);
    console.log(tareaEdit[0]);
    res.render('tareas/editar', {tareaEdit: tareaEdit[0]});
});

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
    await pool.query('UPDATE TAREA SET name_task = ?, descrip_task = ?, status_task = ?, fc_update = ? WHERE id = ?',[newEditTask.name_task,newEditTask.descrip_task,newEditTask.status_task,newEditTask.fc_update,id]);
    req.flash('success','Tarea editada correctamente');
    res.redirect('/');
});

router.get('/exportar', async (req, res) => {
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    //await pool.query('SELECT * FROM TAREA WHERE ID = ?',[id]);
    const result = await pool.query('SELECT name_task,descrip_task,status_task  FROM TAREA');
    const jsonTask = JSON.parse(JSON.stringify(result));
    let workbook = new excel.Workbook(); //creating workbook
    let worksheet = workbook.addWorksheet('Tareas'); //creating worksheet
    //  WorkSheet Header
	worksheet.columns = [
		{ header: 'Actividad', key: 'name_task', width: 10 },
		{ header: 'Detalle', key: 'descrip_task', width: 30 },
		{ header: 'Estado', key: 'status_task', width: 30}
	];
	 
	// Add Array Rows
	worksheet.addRows(jsonTask);
	
	// Write to File
	workbook.xlsx.writeFile("tareas.xlsx")
	.then(function() {
        req.flash('success','Tareas exportadas correctamente, verifique archivo en la raiz');
        res.redirect('/');
	});
});

module.exports = router;