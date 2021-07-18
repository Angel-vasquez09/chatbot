const {Schema, model} = require('mongoose');


const usuarioSchema = Schema({

    nombre: {
        type: String,
        required: [true, "Nombre obligatorio"]
    },
    telefono: {
        type: String
    },
    cedula: {
        type: String,
        require: [true, "La cedula es requerida"]
    },
    correo: {
        type: String,
        required: [true, "Correo obligatorio"],
    },

    password: {
        type: String,
    },

    rol: {
        type: String,
        default: 'USER_ROL',
        emun: ['ADMIN_ROLE','USER_ROL']
    },
    comentario: {
        type: String
    },
    estado: {
        type: Boolean,
        default: true
    },
    online: {
        type: Boolean,
        default: false
    }



})

// Quitamos el password y la __v del a respuesta de la base de datos

usuarioSchema.methods.toJSON = function() {
    const {__v,password,_id, ...usuario} = this.toObject();
    usuario.id = _id; // Cambiamos el nombre del _id por uid
    return usuario;
}


module.exports = model('Usuario', usuarioSchema);