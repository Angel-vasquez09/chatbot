const {Schema, model} = require("mongoose");

const subscription = Schema({

    id: {
        type: String,
        ref: 'Usuario',
        require: true
    },
    subcription: {
        type: Object,
        require: true
    }
})

module.exports = model('Subscription',subscription);