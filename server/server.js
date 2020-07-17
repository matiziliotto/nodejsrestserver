require('./config/config');

const express = require('express');
const app = express();

const bodyParser = require('body-parser');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.get('/usuario', function(req, res) {
    res.json('get Usuario');
});

//Para probar este POST, desde Postman enviamos una peticion POST
//que tiene en el body la opcion seleccionada x-www-form-urlencoded
//y los campos con sus valores.
app.post('/usuario', function(req, res) {

    let body = req.body;

    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es requerido y no se ha recibido.'
        });
    } else {
        res.json({
            persona: body
        });
    }

});

//Poniendo :id, indicamos el parametro que recibiriamos por url
app.put('/usuario/:id', function(req, res) {
    let id_usuario = req.params.id;
    res.json({
        id_usuario
    });
});

app.delete('/usuario', function(req, res) {
    res.json('delete Usuario');
});

app.listen(process.env.PORT, () => {
    console.log("Escuchando puerto", process.env.PORT);
});