const debug = require ('debug')('app:inicio');
//const dbDebug = require('debug')('app:db');
const express = require ('express');
const config = require('config');
//const logger = require('./logger');
const Joi = require ('joi');
const app = express();
const morgan = require('morgan');

app.use(express.json());

//configuracion de entornos/-----------------------
console.log('Aplicacion: ' + config.get('nombre'));
console.log('DB server: ' + config.get('configDB.host'));


//funcion middlewares------de tercero

if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
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

//solicitando usuarios por su id
 app.get('/' , (req, res) => {
     res.send('Hola mundo desde Express');
 });
 app.get('/api/usuarios',(req, res) => {
     res.send(usuarios);
 });
app.get('/api/usuarios/:id',(req, res) => {
    let usuario = existeUsuario(req.params.id);
    if (!usuario) res.status(404).send('El usuario no fue encontrado');
    res.send(usuario);
});

app.post('/api/usuarios', (req, res) => {
//------------------validacion con JOI--------------------
    const schema = Joi.object({
            nombre: Joi.string()
            .min(3)
            .max(15)
            .required(),
    });
   const {error, value}= validarUsuario(req.body.nombre);
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
});
app.put('/api/usuarios/:id', (req, res) =>  {
    let usuario= existeUsuario(req.params.id);
if (!usuario){ 
    res.status(404).send('El usuario no fue encontrado');
    return;
}
    const {error, value} = validarUsuario(req.body.nombre);
if (error) {
    const mensaje =error.details[0].message;
    res.status(400).send(mensaje);
    return;
}
    usuario.nombre = value.nombre;
    res.send(usuario);
});

//----------------------validacion sin Joi--------------------------
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

//--------------------------------------------
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
//-----------------Escuchas en puerto 3000
const port = process.env.PORT || 3000 ; 
    app.listen (port, () => {
    console.log(`escuchando en el puerto ${port}!!!`);
});
//***otras maneras de validacion de datos */--------------
function existeUsuario (id){
    return (usuarios.find(u => u.id === parseInt(id)))
}
function validarUsuario (nom){
    const schema = Joi.object({
        nombre: Joi.string().min(3).max(15).required()
    });
    return (schema.validate({ nombre:nom}));
}
//----------------------------seccion 6 . fin---------------------------------------


