const mongoose = require('mongoose');

//Validador
const uniqueValidator = require('mongoose-unique-validator');


let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
};


let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es requerido']
    },
    email: {
        type: String,
        required: [true, 'El correo es necesario'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,
        required: false //Este si queremos no lo ponemos.
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});


//Esta funcion la hacemos para que no se retorne en el modelo la password y que nadie vea ni el campo, ni el valor.
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();

    delete userObject.password;

    return userObject;
};

usuarioSchema.plugin(uniqueValidator, {
    message: 'El {PATH} ya existe y debe ser unico'
});


//En Usuario es como se guarda y como se hara referencia en otros lugares
module.exports = mongoose.model('Usuario', usuarioSchema);