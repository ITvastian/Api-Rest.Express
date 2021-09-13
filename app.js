const debug = require ('debug')('app:inicio');//otra forma de depurar
//const dbDebug = require('debug')('app:db');//si trabajamos con base de datos            //funciona para apps chicas.sino mejor generalizar y nombrar todo debug
const express = require ('express');//utilizar constante dentro de node//requiriendo express
const config = require('config');
//const logger = require('./logger');//requiere logger.js file
const Joi = require ('joi');//requerir Joi 
const app = express(); //instanciar elemento //app = aplicacion
const morgan = require('morgan');

app.use(express.json());//le decimos que use el middleware express.json 

//configuracion de entornos/-----------------------
console.log('Aplicacion: ' + config.get('nombre'));
console.log('DB server: ' + config.get('configDB.host'));


//funcion middlewares------de tercero
//lo activo en la consola con el comando $ export DEBUG=app:inicio o export DEBUG=app:* (ACTIVA TODOS LOS DEBUG)
//despues inicio                         $ nodemon app.js

if (app.get('env') === 'development') {//si me encuentro en entorno de desarrollo, se acciona morgan.(if)
    app.use(morgan('tiny'));//usando morgan con formato 'tiny';
    //console.log('Morgan habilitado....');//MORGAN ME MOSTRO EN EL CMD  (GET /api/usuarios 200 113 - 0.412 ms)tiempos de respuesta  
    debug('morgan esta habilitado');
}
//Trabajos con la base de datos
debug('conectando con la base de datos');


//app.use(express.static('public'));//prueba de middleware con file app.js
//app.use(logger);//prueba de middleware exportando funcion log.
// app.use (function (req, res, next) {
//     console.log('autenticando...');
//     next();
// })
//funcion middlewares------




const usuarios = [
    {id:1, nombre:'sebastian'},
    {id:2, nombre:'ana'},
    {id:3, nombre:'robertito'}
];
//-----------------------------------------------------------------------
//solicitando usuarios por su id
//indicar a la app metodos que puede utilizar con rutas asignadas
 app.get('/' , (req, res) => {
     res.send('Hola mundo desde Express');
 });
 app.get('/api/usuarios',(req, res) => { //la ruta entre barras!
     res.send(usuarios);
 });//solicitando datos
app.get('/api/usuarios/:id',(req, res) => {// /:id es un parametro que trae el id solicitado
    let usuario = existeUsuario(req.params.id); //lo parseamos (parseInt) ya que esta en numero el id
    if (!usuario) res.status(404).send('El usuario no fue encontrado');
    res.send(usuario);
});

//--------------------------------------------------------------------
//enviando datos en formato json
app.post('/api/usuarios', (req, res) => {
//---------------------------------------------validacion con JOI-------------------------------------------------
    const schema = Joi.object({//esquema para validar datos con Joi
            nombre: Joi.string()//defino el campo a recibir. en este caso nombre:
            .min(3)
            .max(15)
            .required(),
    });
   const {error, value}= validarUsuario(req.body.nombre); /*recibo en una reestructuracion de datos{error, value} */
if (!error) {
    const usuario = {
        id: usuarios.length + 1,
        nombre: value.nombre
        };
        usuarios.push(usuario);
        res.send(usuario);
}else{
    const mensaje =error.details[0].message;
    res.status(400).send(mensaje);
}
});//***---------validando con joi. el metodo put(aqui puedo actualizar datos)-----------*****/
app.put('/api/usuarios/:id', (req, res) =>  {//encontrar si existe el usuario a modificar
//let usuario = usuarios.find(u => u.id === parseInt(req.params.id));//lo parseamos (parseInt) ya que esta en numero el id
    let usuario= existeUsuario(req.params.id);
if (!usuario){ 
    res.status(404).send('El usuario no fue encontrado');
    return;
}

// const schema = Joi.object({//esquema para validar datos con Joi
//          nombre: Joi.string().min(3).max(15).required()//defino el campo a recibir. en este caso nombre:
//});
    const {error, value} = validarUsuario(req.body.nombre);  //schema.validate({ nombre: req.body.nombre}); /*recibo en una reestructuracion de datos{error, value} */
if (error) {
    const mensaje =error.details[0].message;
    res.status(400).send(mensaje);
    return;
}
    usuario.nombre = value.nombre;
    res.send(usuario);
});
//----------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------validacion sin Joi----------------------------------------------------------------
    // if (!req.body.nombre || req.body.nombre.length <= 2) {
    //     //si el dato dentro del body no existe retorna 400
    //     //400 Bad Request//todos los codigos  400 se retornan de APIs a los clientes
    //     res.status(400).send('Debe ingresar un nombre, que tenga minimo 3 letras');
    //     return; //validando las peticiones de usuario
    // };
    // const usuario = {
    //     id: usuarios.length + 1,
    //     nombre: req.body.nombre
    // };
    // usuarios.push(usuario);
    // res.send(usuario)//enviar respuesta a postman

//---------------------------------------------------------------------------------------------------------------------------------
//*****************app.delete  ******************/
app.delete('/api/usuarios/:id', (req, res) => {
    let usuario= existeUsuario(req.params.id);
    if (!usuario){ 
        res.status(404).send('El usuario no fue encontrado');
        return;
    }
    const index = usuarios.indexOf(usuario);
    usuarios.splice(index, 1);

    res.send(usuarios);
});
//*****************app.delete  ******************/
//------------------------------aca escuchamos en el puerto 3000 || o  otro que ponga en la consola---------------------------------
const port = process.env.PORT || 3000 ; //port de puerto // process objeto propio de node. // si no esta la variable de entorno port escucha en el  3000
    app.listen (port, () => { //llamo al puerto y envio a la consola la escucha
    console.log(`escuchando en el puerto ${port}!!!`);
});//desde la CONSOLA con el comando (set PORT=5000) cambio el puerto de escucha
//---------------------------------------------------------------------------------------------------------------------
//***otras maneras de validacion de tados */------------------------------------------

function existeUsuario (id){
    return (usuarios.find(u => u.id === parseInt(id)))
}
function validarUsuario (nom){
    const schema = Joi.object({//esquema para validar datos con Joi
        nombre: Joi.string().min(3).max(15).required()//defino el campo a recibir. en este caso nombre:
    });
    return (schema.validate({ nombre:nom}));
}
//----------------------------seccion 6 . fin---------------------------------------


