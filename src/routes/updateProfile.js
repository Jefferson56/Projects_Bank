const express = require("express");
const router = express.Router();

const conexion= require('../conexion.js');

const helpers= require('../lib/helpers.js');

const {validarContrasena}= require('../lib/validation.js');

const {isLoggedIn, isNotLoggedIn, isAdmin, isExpert, isExponent}= require('../lib/auth.js');

router.get('/updateProfile', isLoggedIn, async (req, res) => {
    const {fullname, username}= req.user;
    try {
        res.render('users/editProfile', {fullname, username});
    } catch (error) {
        console.log(error);
        res.status(400).send('Error redirecting');
    }
});

router.post('/updateProfile', isLoggedIn, async (req, res) => {
    const {fullname, password, repit_password}= req.body;
    const idUser= req.user.id;
    const updateUser= {
        fullname,
        password
    };

    if(validarContrasena(password, repit_password)){
        try {
            updateUser.password= await helpers.encryptPassword(password);
            await conexion.query('UPDATE users SET ? WHERE id = ?', [updateUser, idUser]);
            req.flash('success', 'Actualización exitosa');
            console.log('Validación realizada');
            res.redirect('/profile');
        } catch (error) {
            console.log(error);
            res.status(400).send('Error redirecting');
        }
    } else {
        req.flash('message', 'Las contraseñas no coinciden');
    }
});

module.exports= router;