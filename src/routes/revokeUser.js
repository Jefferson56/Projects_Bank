const express= require('express');
const router= express.Router();
const conexion= require('../conexion.js');

const {isLoggedIn, isNotLoggedIn, isAdmin, isExpert, isExponent}= require('../lib/auth.js');

router.get('/listUser', isAdmin, async (req, res) => {
    try {
        const allUsers= await conexion.query('SELECT * FROM users');
        res.render('listUser', {users: allUsers});
    } catch (error) {
        console.log(error);
        res.status(500).send('Error retrieving projects');
    }
});

router.get('/revokeUser/:id/:username/:fullname', isAdmin, async (req, res) => {
    const {id, username, fullname}= req.params;
    try {
        res.render('revokeUser', {id, username, fullname});
    } catch (error) {
        console.log(error);
        res.status(400).send('Error redirecting');
    }
});

router.post('/updateTypeUser/:id/:fullname', isAdmin, async (req, res) => {
    const {id, fullname}= req.params;
    const {typeUser}= req.body;
    updateTypeUser= {
        typeUser
    }
    try {
        await conexion.query('UPDATE users SET ? WHERE id = ?', [updateTypeUser, id]);
        req.flash('success', 'Permisos para el usuario: '+fullname+ ', han sido actualizados correctamente');
        res.redirect('/listUser');
    } catch (error) {
        console.log(error);
        res.status(400).send('Error redirect');
    }
});

module.exports= router;