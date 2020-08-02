const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const fs = require('fs');
const path = require('path');

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

//Esto hace que todo lo que se suba, se guarde en req.files. Es como un middleware
app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            error: {
                message: 'No se subio ningun archivo'
            }
        });
    }

    //Validar tipo
    let tipos_validos = ['productos', 'usuarios'];
    if (tipos_validos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            error: {
                message: ' Los tipos validos son ' + tipos_validos.join(', '),
                tipo
            }
        });
    }

    //req.files.archivo hace que se acceda al archivo con el input name="archivo"
    let archivo = req.files.archivo;

    //Separamos al nombre del archivo en un array separado por el punto
    let nombre_archivo = archivo.name.split('.');

    let extension = nombre_archivo[nombre_archivo.length - 1];

    //Extensiones validas
    let extensionesValidas = ['jpg', 'png', 'gif', 'jpeg'];

    //Si la extension del archivo no se encontro en el array de extensiones validas
    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            error: {
                message: ' Las extensiones permitidas son ' + extensionesValidas.join(', '),
                extension
            }
        })
    }

    // Cambio de nombre al archivo
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;

    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (error) => {
        if (error)
            return res.status(500).json({
                ok: false,
                error
            });

        //En este punto la imagen ya esta cargada
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else if (tipo === 'productos') {
            imagenProducto(id, res, nombreArchivo);
        }

    });
});

function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (error, usuarioDB) => {
        if (error) {
            //Si hubo un error al buscar el usuario para ponerle la imagen, borro la imagen que se subio
            borrarArchivo(nombreArchivo, 'usuarios');

            return res.status(500).json({
                ok: false,
                error
            });
        }

        if (!usuarioDB) {
            //Si no se encontro un usuario con ese id para ponerle la imagen, borro la imagen que se subio
            borrarArchivo(nombreArchivo, 'usuarios');

            return res.status(400).json({
                ok: false,
                error: {
                    message: 'El usuario no existe'
                }
            });
        }

        borrarArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((error, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado
            })
        })
    })
}

function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (error, productoDB) => {
        if (error) {
            borrarArchivo(nombreArchivo, 'productos')
            return res.status(500).json({
                ok: false,
                error
            })
        }

        if (!productoDB) {
            borrarArchivo(nombreArchivo, 'productos')
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'No se encontro un producto con ese id'
                }
            });
        }

        borrarArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;

        productoDB.save((error, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado
            })
        })
    });
}

function borrarArchivo(nombreImagen, tipo) {
    //Path de la imagen anterior
    let pathImg = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreImagen }`);
    //Si el path (osea la imagen) existe, la elimino.
    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg);
    }
}


module.exports = app;