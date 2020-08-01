const mongoose = require('mongoose');

//Validador
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, "La descripcion de la categoria es obligatoria"]
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});

// categoriaSchema.plugin(uniqueValidator, {
//     message: 'El {PATH} ya existe y debe ser unico'
// });

//En Usuario es como se guarda y como se hara referencia en otros lugares
module.exports = mongoose.model('Categoria', categoriaSchema);