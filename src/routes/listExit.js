const express= require('express');
const router= express.Router();
const conexion= require('../conexion.js');

router.get('/listExit', async (req, res) => {
    try {
        const allProjectsExit= await conexion.query('SELECT * FROM projects WHERE state = ?', ['Éxito']);
        res.render('projects/listExit', {projects: allProjectsExit});
    } catch (error) {
        console.log(error);
        res.status(500).send('Error retrieving projects');
    }
});

module.exports= router;