const express= require('express');
const router= express.Router();

  const multer= require('multer');

  const path = require('path');

// // Directorio de destino para los archivos cargados
// const upload = multer({ dest: 'uploads/' });


    // Configuración de multer para guardar la imagen en la carpeta de uploads
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            // const uploadsFolder = path.join(__dirname, '..', 'uploads'); // Ruta relativa a la carpeta "uploads" desde el directorio actual
            cb(null, 'src/uploads/');
          },
        filename: (req, file, cb) => {
          // Generar un nombre único para la imagen
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          cb(null, uniqueSuffix + '-' + file.originalname);
        }
      });
      
      // Configuración de multer para aceptar solo imágenes
      const fileFilter = (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
          cb(null, true);
        } else {
          cb(new Error('Only image files are allowed.'), false);
        }
      };
      
      // Inicializar multer con la configuración
      const upload = multer({ storage, fileFilter });


const conexion= require('../conexion.js');

const {isAdmin, isExpert, isExponent}= require('../lib/auth.js');

router.get('/add', isExponent, (req, res) => { //Se indica escuchar por la ruta /add
    res.render('projects/add'); //Se renderiza la vista que se encuentra en la ruta links/add especificamente
});


router.post('/add', upload.single('projectImage'), isExponent, async (req, res) => { //La función flecha se convierte en asincrónica
    const {title, description, evolved, threat, state}= req.body; //Trae los valores guardados por el usuario en el formulario
    const file = req.file.filename;

    // Obtener la fecha actual
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    const newProject= { //Lo guarda en un objeto que se llamará newLink
        title,
        description,
        evolved,
        threat,
        state,
        image: file,
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
        const {coment}= req.body;
        newComent= {
            coment,
            id_expert,
            id_project
        };
        try {
            const result= await conexion.query('INSERT INTO coments SET ?', [newComent]); //Espera a que se ejecute la consulta, en la consulta se envía el objeto con los datos a la base de datos
            req.flash('success','Comentario guardado correctamente'); //Mensaje que se muestra en el momento es que se guarda un nuevo link
            res.redirect('back');
          } catch (error) {
            if(error.code === 'ER_DUP_ENTRY'){
                console.error(error);
            }
        }
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
    const id_modifier= req.user.id;
    const id= req.params.id;
    try {
        await conexion.query('DELETE FROM coments WHERE id_project = ?', [id]);
        const projectName= await conexion.query('SELECT title FROM projects WHERE id = ?', [id]);
        const exchange= 'ELIMINACIÓN DE PROYECTO';
        const newSetting= {
          id_modifier,
          modified_name: projectName[0].title,
          exchange_rate: exchange
        };
        await conexion.query('INSERT INTO settings SET ?', [newSetting]);
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

module.exports= router;