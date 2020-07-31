//===================
// Puerto
//===================
process.env.PORT = process.env.PORT || 3000;

//===================
// Entorno
//===================

// Si la variable no existe, entonces estoy en desarrollo
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//===================
// Vencimiento del token
//===================
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


//===================
// SEED de autenticacion
//===================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';


//===================
// Base de datos
//===================
let urlDB;

//Si no estoy en desarrollo, pongo el url del host de la base de datos en la mondodb atlas
if (process.env.NODE_ENV == 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_DB; //Esa es una variable de entorno almacenada en heroku.
}

process.env.URLDB = urlDB;

//===================
// Google client id
//===================
process.env.CLIENT_ID = process.env.CLIENT_ID || '399030335015-9fmiscl5tajefmi8t737ikbmpnn587g1.apps.googleusercontent.com';