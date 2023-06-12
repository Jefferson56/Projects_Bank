const express= require('express');
const router= express.Router();

const conexion= require('../conexion.js');

const {isLoggedIn, isNotLoggedIn, isAdmin, isExpert, isExponent}= require('../lib/auth.js');

router.get('/add', isExponent, (req, res) => { //Se indica escuchar por la ruta /add
    res.render('projects/add'); //Se renderiza la vista que se encuentra en la ruta links/add especificamente
});

router.post('/add', isExponent, async (req, res) => { //La función flecha se convierte en asincrónica
    const {title, description, evolved, threat, state}= req.body; //Trae los valores guardados por el usuario en el formulario
    // Obtener la fecha actual
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    const newProject= { //Lo guarda en un objeto que se llamará newLink
        title,
        description,
        evolved,
        threat,
        state,
        creation_date: formattedDate,
        id_exponents: req.user.id
    };
    try {
        await conexion.query('INSERT INTO projects SET ?', [newProject]);//Espera a que se ejecute la consulta, en la consulta se envía el objeto con los datos a la base de datos
        req.flash('success','Proyecto guardado correctamente'); //Mensaje que se muestra en el momento es que se guarda un nuevo link
        res.redirect('/projects');
    } catch (error) {
        if(error.code === 'ER_DUP_ENTRY'){
            req.flash('message','Ya existe un proyecto con este título: ' + title); //Mensaje que se muestra en el momento en que el usuario está registrando un nuevo nombre de usuario
            res.redirect('/projects/add');
        }
    }
});

router.get('/', isExponent, async (req, res) => { //Con isLoggedIn protegemos la ruta
const projects= await conexion.query('SELECT * FROM projects WHERE id_exponents = ?', [req.user.id]);
res.render('projects/list', { projects }); //Se le pasan los datos de la consulta a la vista list.hbs
});

router.get('/coment', isExpert, async (req, res) => { //Con isLoggedIn protegemos la ruta
    try {
    const projects= await conexion.query('SELECT * FROM projects');
    res.render('projects/coment', { projects }); //Se le pasan los datos de la consulta a la vista list.hbs
    } catch (error) {
        console.log(error);
        res.status(500).send('Error retrieving projects');
    }
    });

    router.post('/coment/:id', isExpert, async (req, res) => { //Con isLoggedIn protegemos la ruta
        const id_project= parseInt(req.params.id, 10);
        const id_expert= req.user.id;
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().split('T')[0]; // Formato YYYY-MM-DD
        const {coment}= req.body;
        newComent= {
            coment,
            creation_date: formattedDate,
            id_expert,
            id_project
        };
        try {
            console.log('Entramos a la consulta');
            const result= await conexion.query('INSERT INTO coments SET ?', [newComent]); //Espera a que se ejecute la consulta, en la consulta se envía el objeto con los datos a la base de datos
            console.log(result); 
            req.flash('success','Comentario guardado correctamente'); //Mensaje que se muestra en el momento es que se guarda un nuevo link
            res.redirect('back');
          } catch (error) {
            if(error.code === 'ER_DUP_ENTRY'){
                console.error(error);
            }
        }
        console.log('tenemos error');
        });

router.get('/listDelete', isAdmin, async (req, res) => { //Con isLoggedIn protegemos la ruta
    try {
    const projects= await conexion.query('SELECT * FROM projects');
    res.render('projects/delete', { projects }); //Se le pasan los datos de la consulta a la vista list.hbs
    } catch (error) {
        console.log(error);
        res.status(500).send('Error retrieving projects');
    }
    });

router.get('/delete/:id', isAdmin, async (req, res) => { //Con isLoggedIn protegemos la ruta
    const id= req.params.id;
    try {
        await conexion.query('DELETE FROM coments WHERE id_project = ?', [id]);
        await conexion.query('DELETE FROM projects WHERE id = ?', [id]);
        req.flash('success', 'Proyecto eliminado correctamente');
        res.redirect('back');
    } catch (error) {
        console.error(error);
    }
});

router.get('/edit/:id', isExponent, async (req, res) => { //Con isLoggedIn protegemos la ruta
   const {id}= req.params;
   try {
     const projects= await conexion.query('SELECT * FROM projects WHERE id = ?', [id]);
     res.render('projects/edit', {project: projects[0]});
   } catch (error) {
     console.error(error);
   }
});

router.post('/edit/:id', isExponent, async (req, res) => { //Con isLoggedIn protegemos la ruta
    const {id}= req.params;
    const {description, evolved, threat, state}= req.body;
    const updateProject= {
        description,
        evolved,
        threat,
        state
    }
    try {
        await conexion.query('UPDATE projects SET ? WHERE id = ?', [updateProject, id]);
        req.flash('success', 'Proyecto editado exitosamente');
        res.redirect('/projects');
    } catch (error) {
        console.error(error);
    }
});
// router.post('/projects/coment', isExpert, async (req, res) => { //Con isLoggedIn protegemos la ruta
//     const id= req.user.id;
//     const {description, evolved, threat, state}= req.body;
//     const updateProject= {
//         description,
//         evolved,
//         threat,
//         state
//     }
//     try {
//         await conexion.query('UPDATE projects SET ? WHERE id = ?', [updateProject, id]);
//         req.flash('success', 'Proyecto editado exitosamente');
//         res.redirect('/projects');
//     } catch (error) {
//         console.error(error);
//     }
// });

module.exports= router;