const express= require('express');
const router= express.Router();
const conexion= require('../conexion.js');

router.get('/', async (req, res) => {
    try {
        const allProjects = await conexion.query('SELECT * FROM projects');
        res.render('projects/index', { projects: allProjects});
    } catch (error) {
        console.log(error);
        res.status(500).send('Error retrieving projects');
    }
});

module.exports= router;