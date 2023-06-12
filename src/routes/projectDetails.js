const express = require("express");
const router = express.Router();

const conexion= require('../conexion.js');

const helpers= require('../lib/helpers.js');

router.get('/projectDetails/:id', async (req, res) => {
    const {id}= req.params;
    const {title, description, evolved, threat, state, creation_date}= req.query;

    try {
            const projectComents= await conexion.query('SELECT * FROM coments c JOIN users u ON (c.id_expert = u.id) WHERE id_project = ?', [id]);
            res.render('projects/projectDetails', {title, description, evolved, threat, state, creation_date, projectComents: projectComents});
    } catch (error) {
            console.log(error);
            res.render('projects/projectDetails', {title, description, evolved, threat, state, creation_date});
    }
});

module.exports= router;