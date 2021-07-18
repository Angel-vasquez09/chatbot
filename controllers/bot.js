const { response } = require("express");
const Bot = require("../models/bot");





const postMensajeAutomatico = async (req, res = response) => {

    const { clave, opciones, texto } = req.body;
    
    try {

        const mensaje = await Bot({clave, opciones, texto});

        await mensaje.save();

        res.json({
            mensaje
        })

    } catch (error) {
        return res.json({
            error
        })
    }
}


const getPorClave = async(req, res = response) => {
    const { clave } = req.params;
    try {

        const opcion = await Bot.findOne({clave: clave});

        return res.json({
            opcion
        })

    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}




module.exports = {
    postMensajeAutomatico,
    getPorClave
}