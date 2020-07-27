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
// Base de datos
//===================
let urlDB;

//Si no estoy en desarrollo, pongo el url del host de la base de datos en la mondodb atlas
if (process.env.NODE_ENV == 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://root:SCtzhTCx77Qdlm23@cluster0.g4rcs.mongodb.net/cafe';
}

process.env.URLDB = urlDB;