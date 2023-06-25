const express= require('express'); //Se importan el módulo de express para podre conertir el proyecto en una app
const morgan= require('morgan');
const exphbs= require('express-handlebars'); //Módulo para manejar motores de plantillas para las vistas
const path= require('path'); //Módulo para manejar las rutas
const flash= require('connect-flash'); //Este módulo se implementa para mostrar mensajes en las vistas
const session= require('express-session'); //Para crear una sesión para el usuario
const MySQLStore= require('express-mysql-session')(session); //Modulo utilizado para manejar las sesiones
const {database}= require('./keys'); //Se importan el modulo con los datos de la base de datos que permite establecer la conexión
const passport= require('passport'); //Módulo cuyos métodos permiten complementar la implementación de sesiones

//Inicialziaciones
const app = express();
require('./lib/passport'); //Se llama el módulo passport

// Configuraciones
app.set('port', process.env.PORT || 4000); //Configurar la propiedad port de la aplicación para decirle que por defecto escuche por medio del puerto del entorno o por el puerto 4000
app.set('views', path.join(__dirname, 'views')); //Configurar para que el nombre de ruta views sea equivalente a la ruta actual unida a la ruta de views
app.engine('.hbs', exphbs.engine({ //Configuración para manejar las plantillas de handlebars
    defaultLayout: 'main', //Se establece main como la vista por defecto de todas las vistas
    layoutsDir: path.join(app.get('views'), 'layouts'), //Se establece la ruta, uniendo las la vista layouts a views
    partialsDir: path.join(app.get('views'), 'partials'), //Se establece la ruta, uniendo las la vista partials a views
    extname: '.hbs', //Se especifica que todas las vistas terminan en la extensión .hbs
    helpers: require('./lib/handlebars')
}));

app.set('view engine', '.hbs'); //Índica que los archivos para las vistas con el motor de plantillas handlebars terminan en .hbs 

const sessionStore= new MySQLStore(database);

app.use(session({
    secret: 'linkssession', //Nombre que se le da a la sesión
    resave: false, //Se configura false para que no se empiece a renovar la sesión
    saveUninitialized: false, //Se configura para que no se restablezca la sesión
    store: sessionStore //Se configura  el manejo de las sesiones
}));

app.use((req, res, next) => {
    // Establecer la duración de la sesión en 1 hora (3600000 milisegundos)
    req.session.cookie.maxAge = 3600000;
    next();
  });

app.use(flash()); //Se índica a la app que use la función flash para poder mostrar los mensajes
app.use(morgan('dev')); //Se índica a morgan que mantenga actualizada a la dependencia de desarrollo dev
app.use(express.urlencoded({extended: false}));
app.use(express.json()); //Se índica a la app que use la función json para tratar archivos de texto
app.use(passport.initialize()); //Se inincializa passport para poder hacer uso de sus métodos
app.use(passport.session()); //Se inicializa en session
app.use('/uploads', express.static('uploads'));
app.use(express.static('src'));


//Variables globales
app.use((req, res, next) =>{
    app.locals.success= req.flash('success'); //Almacena el mensaje enviado a través de succes
    app.locals.message= req.flash('message'); //Almacena el mensaje enviado a través de message
    app.locals.user= req.user; //Se almacena el usuario user y dicha variable puede ser accedida desde cualquier vista
    next();
});

//Rutas
app.use(require('./routes'));
app.use(require('./routes/authetication'));
app.use('/projects', require('./routes/projects'));
app.use(require('./routes/listExit'));
app.use(require('./routes/signupAdmin'));
app.use(require('./routes/revokeUser'));
app.use(require('./routes/updateProfile'));
app.use(require('./routes/projectDetails'));
app.use(require('./routes/settings'));

//Archivos públicos
app.use(express.static(path.join(__dirname, 'public')));

//Sección para inicializar el servidor
app.listen(app.get('port'), () => { //Se le indica a la aplicación que escuche a través del port
    // console.log('Servidor funcionando a través del puerto', app.get('port'));
});

// module.exports= upload;