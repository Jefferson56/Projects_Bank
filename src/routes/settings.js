const express= require('express');
const router= express.Router();

const conexion= require('../conexion.js');

const {isAdmin}= require('../lib/auth.js');

router.get('/settings', isAdmin, async (req, res) => {

    try {
        const settings= await conexion.query('SELECT username, fullname, modified_name, exchange_rate, creation_setting FROM settings s JOIN users u ON (s.id_modifier = u.id)');
        res.render('users/settings', {settings});
    } catch (error) {
        console.log(error);
        res.status(400).send('Error redirecting');
    }
});

module.exports= router;