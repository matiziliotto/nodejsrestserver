const jwt = require('jsonwebtoken');

//==============
// Verificar token
//==============

//El next lo que hace es continuar con la ejecucion del programa, sino no se ejecuta el resto de funciones al salir del middleware
let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (error, decoded) => { //En decoded viene la informacion del payload

        if (error) {
            return res.status(401).json({
                ok: false,
                error: {
                    message: 'Token no valido'
                }
            });
        }

        req.usuario = decoded.usuario;

        next();
    });

};

//==============
// Verificar Admin role
//==============

let verificaAdminRole = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role !== "ADMIN_ROLE") {
        return res.json({
            ok: false,
            error: {
                message: 'El usuario no es administrador'
            }
        });
    }

    next();
};

module.exports = {
    verificaToken,
    verificaAdminRole
}