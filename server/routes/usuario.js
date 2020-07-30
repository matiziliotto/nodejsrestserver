const express = require('express');

//Lo usamos para encriptar las contraseñas
const bcrypt = require('bcrypt');

//Esto nos ayuda a filtrar los parametros que recibimos en las peticiones
const _ = require('underscore');

//Uso el Schema de Usuario
const Usuario = require('../models/usuario');
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

const app = express();

app.get('/usuario', verificaToken, (req, res) => {

    //Si no viene el parametro desde, se inicializa en 0. (viene como string)
    let desde = req.query.desde || 0;
    desde = Number(desde);

    //Si no viene el parametro desde, se inicializa en 5. (viene como string)
    let limite = req.query.limite || 5;
    limite = Number(limite);

    // Usuario.find({ email: "mati_97_ziliotto@hotmail.com" }) //De esta forma buscamos por campo que nos interese
    //Agregandole Usuario.find({}, 'nombre email') nombre email indican que solo se consultaran esos campos o exclusiones.
    Usuario.find({ estado: true }, 'nombre email')
        .skip(desde) //Hace que se salteen los primeros x registros
        .limit(limite) //Le pedimos a Mongo que nos retorne solo x registros
        .exec((error, usuarios) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    error: error
                })
            }

            //count=countDocuments mira la cantidad de usuarios en la base de datos, lo cambie a countDocuments porq el otro ya esta deprecated
            //La idea es ponerle la misma condicion que al find.
            Usuario.countDocuments({ estado: true }, (error, conteo) => {
                // De esta forma nos retorna todos
                res.json({
                    ok: true,
                    usuarios,
                    cant: conteo
                });
            });
        })
});

//Para probar este POST, desde Postman enviamos una peticion POST
//que tiene en el body la opcion seleccionada x-www-form-urlencoded
//y los campos con sus valores.
app.post('/usuario', [verificaToken, verificaAdminRole], function(req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10), //El 10 es para el numero de vueltas que se le van a dar o algo asi al momento de encriptar la password.
        role: body.role
    });

    usuario.save((error, usuarioDB) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error: error
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

//Poniendo :id, indicamos el parametro que recibiriamos por url
app.put('/usuario/:id', [verificaToken, verificaAdminRole], function(req, res) {
    let id_usuario = req.params.id;

    //Con la funcion pick (del underscore), solo me quedo con los campos que a mi me interesa.
    let body = _.pick(req.body, ['nombre', /*'email', */ 'img', 'role', 'estado']);

    //Enviandole la opcion new:true nos retorna el nuevo usuario con los campos ya modificados y no el anterior.
    Usuario.findByIdAndUpdate(id_usuario, body, { new: true, runValidators: true }, (error, usuarioDB) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error: error
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

});

app.delete('/usuario/:id', [verificaToken, verificaAdminRole], function(req, res) {

    let id_usuario = req.params.id;

    let cambiaEstado = {
        estado: false
    };

    //Eliminando un usuario fisicamente
    Usuario.findByIdAndUpdate(id_usuario, cambiaEstado, { new: true }, (error, usuarioBorrado) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error: error
            })
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Usuario no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });



    // //Eliminamos fisicamente el registro.
    // Usuario.findByIdAndRemove(id_usuario, (error, usuarioBorrado) => {
    //     if (error) {
    //         return res.status(400).json({
    //             ok: false,
    //             error: error
    //         })
    //     }

    //     if (!usuarioBorrado) {
    //         return res.status(400).json({
    //             ok: false,
    //             error: {
    //                 message: 'Usuario no encontrado'
    //             }
    //         })
    //     }

    //     res.json({
    //         ok: true,
    //         usuario: usuarioBorrado
    //     });
    // });

});

module.exports = app;
/*
    o
    module.exports = {
        app
    };
*/