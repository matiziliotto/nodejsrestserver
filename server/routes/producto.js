const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');

let app = express();

const Producto = require('../models/producto');

// =========================
// Mostrar todas los productos
// =========================
app.get('/productos', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .skip(desde)
        .limit(limite)
        .exec((error, productosDB) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                });
            }

            res.json({
                ok: true,
                productos: productosDB
            })
        });
});

// =========================
// Mostrar un producto
// =========================
app.get('/productos/:id', verificaToken, (req, res) => {

    let id_producto = req.params.id;

    Producto.findById(id_producto)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((error, productoDB) => {

            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                })
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: "El producto no existe"
                    }
                })
            }

            res.json({
                ok: true,
                producto: productoDB
            })
        });
});

// =========================
// Crear un producto
// =========================
app.post('/productos', verificaToken, (req, res) => {

    let id_usuario = req.body.id_usuario;
    let id_categoria = req.body.id_categoria;

    let producto_new = {
        nombre: req.body.nombre,
        precioUni: req.body.precioUni,
        descripcion: req.body.descripcion,
        disponible: req.body.disponible,
        categoria: req.body.categoria,
        usuario: req.usuario._id, //Este usuario se agrega al req cuando pasa por el middleware verificaToken
    }

    let producto = new Producto(producto_new);

    producto.save((error, productoDB) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }

        if (!productoDB) {
            return res.status(500).json({
                ok: false,
                error: {
                    message: "No se pudo crear el producto"
                }
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        })
    })


});

// =========================
// Actualizar un producto
// =========================
app.put('/productos/:id', verificaToken, (req, res) => {
    let id_producto = req.params.id;

    Producto.findById(id_producto, (error, productoDB) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error: error
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Producto no encontrado'
                }
            })
        }

        productoDB.nombre = req.body.nombre;
        productoDB.disponible = req.body.disponible;
        productoDB.precioUni = req.body.precioUni;
        productoDB.categoria = req.body.categoria;
        productoDB.descripcion = req.body.descripcion;

        productoDB.save((error, productoGuardado) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    error: error
                })
            }

            res.json({
                ok: true,
                producto: productoGuardado
            });
        })
    })
});

// =========================
// Eliminar un producto
// =========================
app.delete('/productos/:id', verificaToken, (req, res) => {

    let id_producto = req.params.id;

    let cambioDisponible = {
        disponible: false
    }

    //Tambien se puede hacer como el get PUT, usando findById
    Producto.findByIdAndUpdate(id_producto, cambioDisponible, { new: true }, (error, productoDB) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error: error
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Producto no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            producto: productoDB,
            mensaje: "Producto borrado"
        });
    })
});


// =========================
// Buscar productos
// =========================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    //la i hace que no le importe las mayusculas y minusculas
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        // .populate('usuario', 'nombre email')
        .exec((error, productosDB) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                });
            }

            res.json({
                ok: true,
                productos: productosDB
            })
        });
});





module.exports = app;