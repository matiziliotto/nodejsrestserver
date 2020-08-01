const express = require('express');

const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

let app = express();


//Esto nos ayuda a filtrar los parametros que recibimos en las peticiones
const _ = require('underscore');


const Categoria = require('../models/categoria');


// =========================
// Mostrar todas las categorias
// =========================
// app.get('/categoria', (req, res) => {
//     let categorias = Categoria.find((error, categoriasDB) => {
//         if (error) {
//             return res.status(500).json({
//                 ok: false,
//                 error
//             })
//         }
//         Categoria.countDocuments((error, cantidad_categorias) => {
//             res.json({
//                 ok: true,
//                 categorias: categoriasDB,
//                 cantidad: cantidad_categorias
//             })
//         });
//     });
// });

//LO MISMO QUE LO DE ARRIBA PERO CON POPULATE, esto hace que se retornen los datos de la asociacion con otra tabla
app.get('/categoria', (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        // .populate('usuario', 'nombre email') //En caso de que haya mas relaciones
        .exec((error, categoriasDB) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                })
            }
            Categoria.countDocuments((error, cantidad_categorias) => {
                res.json({
                    ok: true,
                    categorias: categoriasDB,
                    cantidad: cantidad_categorias
                })
            });
        });
});

// =========================
// Mostrar una categoria
// =========================
app.get('/categoria/:id', verificaToken, (req, res) => {
    let id_categoria = req.params.id;

    if (!id_categoria) {
        return res.status(400).json({
            ok: false,
            error: {
                message: 'Debe recibir el id como parametro'
            }
        });
    }

    Categoria.findById(id_categoria, (error, categoriaDB) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }

        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                error: {
                    message: 'No se encontro una categoria'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    });
});

// =========================
// Crear una categoria y regresarla
// =========================
app.post('/categoria', verificaToken, (req, res) => {

    let id_usuario = req.usuario._id;

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: id_usuario
    });

    categoria.save((error, categoriaDB) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            })
        }

        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                error
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    });
})

// =========================
// Actualizar una categoria
// =========================
app.put('/categoria/:id', verificaToken, (req, res) => {

    let id_categoria = req.params.id;
    let body = {
        descripcion: req.body.descripcion
    }

    Categoria.findByIdAndUpdate(id_categoria, body, { new: true, runValidators: true }, (error, categoriaDB) => {

        if (error) {
            return res.status(500).json({
                ok: false,
                error
            })
        }

        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                error: "La categoria no existe"
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    });
})

// =========================
// Delete de una categoria, solo un admin puede borrar
// =========================
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {

    let id_categoria = req.params.id;

    Categoria.findByIdAndRemove(id_categoria, (error, categoriaDB) => {

        if (error) {
            return res.status(500).json({
                ok: false,
                error
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Categoria no encontrada'
                }
            })
        }

        res.json({
            ok: true,
            message: 'Categoria borrada',
            categoria: categoriaDB
        })
    });
})


module.exports = app;