const { response } = require('express');
const { Chat, Usuario } = require('../models');



/* GRABAR MENSAJES EN LA BASE DE DATOS */
const grabarMensaje = async( payload ) => {

    try {
        const mensaje = new Chat( payload );
        await mensaje.save();
        return mensaje;
    } catch (error) {
        console.log(error);
        return false;
    }

}

/* Usuarios registrados */
const usuariosRegistrados = async() =>{

        const usuarios = await Usuario.find({rol: "USER_ROLE"});
        
        return usuarios;
}


/* BUSCAR TODOS LOS ASESORES REGISTRADOS */
/* const buscarAsesores = async(req, res = response) => {

    try {
        const asesores = await Usuario.find({estado: true});

        if(asesores){
            return res.json({
                asesores
            })
        }
    } catch (error) {
        console.log(error)
    }

} */


/* 
**************************************************************
*  Mensajes del bot
**************************************************************
*/


module.exports = {
    grabarMensaje,
    usuariosRegistrados
}


