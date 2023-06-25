const express = require("express");
const router = express.Router();

const conexion= require('../conexion.js');

const helpers= require('../lib/helpers.js'); 

const {validarContrasena, validarTipoUsuario}= require('../lib/validation.js');

const { isLoggedIn, isNotLoggedIn, isAdmin, isExpert, isExponent } = require("../lib/auth.js");

router.get("/signupAdmin", isAdmin, async (req, res) => {
    res.render("./auth/signupAdmin");
  });
    router.post('/signupAdmin', isAdmin, async (req, res) => {
    const id_modifier= req.user.id;
    const {fullname, username, password, repit_password, typeUser}= req.body;
        const newUser= {
        username,
        password,
        fullname,
        typeUser
      };
      const exchange= 'AGREGAR USUARIO';
      const newSetting= {
        id_modifier,
        modified_name: username,
        exchange_rate: exchange
      };
      if(validarContrasena(password, repit_password)){
        try {
            newUser.password= await helpers.encryptPassword(password); //Se le envía la password para ser encriptada y luego es guardada en la propiedad password del objeto newUser
            await conexion.query('INSERT INTO users SET ?', [newUser]);
            await conexion.query('INSERT INTO settings SET ?', [newSetting]);
            req.flash('success','Usuario registrado con éxito'); //Mensaje que se muestra en el momento en que se guarda un usuario
            res.redirect('/profile');
        } catch (error) {
            if(error.code === 'ER_DUP_ENTRY'){
                req.flash('message','El correo ' + username+ ' ya se encuentra registrado'); //Mensaje que se muestra en el momento en que el usuario está registrando un nuevo nombre de usuario
                res.redirect('/signupAdmin');
            }
        }
    }else {
        req.flash('message','Las contraseñas no coinciden, intentalo de nuevo');
        res.redirect('/signupAdmin');
    }
  });

  module.exports= router;