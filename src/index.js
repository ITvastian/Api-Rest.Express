const express = require ('express');
const app = express();

//settings
app.set ('port', 3000);

//middlewares

//routes
app.get('/API/USUARIOS', (req, res) => {
    res.send (' hola desde express');
});
//static files

//listening the server
app.listen(app.get('port'), () => {
    console.log('server on port', app.get('port'));
} );