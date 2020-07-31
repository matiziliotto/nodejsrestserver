require('./config/config');

const express = require('express');
const app = express();

const mongoose = require('mongoose');
const path = require('path');

const bodyParser = require('body-parser');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//Habilitar carpeta public para que se pueda acceder
app.use(express.static(path.resolve(__dirname, '../public')));


//Configuracion global de rutas
app.use(require('./routes/index'));


//Conexcion a la base de datos. /cafe indica que cafe es la base de datos.
// mongoose.connect('mongodb://localhost:27017/cafe', (error, res) => {
//     if (error) throw error;

//     console.log("BASE DE DATOS CONECTADA");
// });

//Lo hice asi porque en la documentacion oficial se hace de esta manera. (Le agregue el nombre de la funcion y el async porque sino el await no se podia usar)
let conectarDB = async() => {
    await mongoose.connect(process.env.URLDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true,
        useCreateIndex: true
    });
}

conectarDB();


app.listen(process.env.PORT, () => {
    console.log("Escuchando puerto", process.env.PORT);
});