const express = require('express');

//Lo usamos para encriptar las contraseñas
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

//Uso el Schema de Usuario
const Usuario = require('../models/usuario');

const app = express();

app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (error, usuarioDB) => {

        if (error) {
            return res.status(500).json({
                ok: false,
                error
            })
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Usuario| y/o contraseña incorrectos'
                }
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Usuario y/o contraseña| incorrectos'
                }
            });
        }

        //En el primer argumento/objeto se define el payload
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }); //Expirara en 30 dias de esa forma

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    });
});


module.exports = app;