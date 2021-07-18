const {Schema, model} = require("mongoose");


const botSchema = Schema({

    clave: {
        type: String, 
    },
    
    opciones: [
        {
            clave : String,
            opcion: String
        }
    ],
    texto: [{
        type: String,
        required: true
    }]

},{
    timestamps: true
})

botSchema.methods.toJSON = function() {
    const {__v,_id, ...bot} = this.toObject();
    return bot;
}

module.exports = model('Bot', botSchema);