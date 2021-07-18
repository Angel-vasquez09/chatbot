
const { response } = require("express")
const Usuario = require("../models/usuario");
const bcryptjs = require("bcryptjs");
const fs = require('fs');
const path = require('path');
const { generarToken } = require("../helpers/generar-token");

/* 
*****************************************************
* OBTENER USUARIO POR CEDULA
*****************************************************
*/
const usuarioCedula = async(req, res = response) => {
    
    try {

        const usuario = await Usuario.findOne({ cedula: req.params.cedula});
        
        if (usuario) {
            res.json({ 
                ok: true,
                usuario
            })
        }else{
            res.json({ 
                ok: false,
                usuario
            })
        }

    } catch (error) {
        console.log(error);
    }

}


/* 
*****************************************************
* OBTENER TODOS LOS ASESORES
*****************************************************
*/
const getAsesores = async(req, res = response) => {

    try {
        
        const asesores = await Usuario.find({rol: "ADMIN_ROLE",estado: true});
        
        
        if (asesores) {
            return res.json({
                ok: true,
                asesores
            })
        }else{
            return response.json({
                ok: false,
                msj: "Error al cominicarse con los asesores"
            })
        }
    } catch (error) {
        console.log(error);
    }
}


/* 
*****************************************************
* OBTENER USUARIO POR ID
*****************************************************
*/
const usuarioId = async(req, res = response) => {
    
    const usuario = await Usuario.findById(req.params.id);

    try {
        if (usuario) {
            res.json({ 
                usuario
            })
        }
    } catch (error) {
        console.log(error);
    }

}

/* 
*****************************************************
* VALIDAR CORREO USUARIO
*****************************************************
*/
const validarCorreo = async(req, res = response) => {

    const {correo} = req.params;

    const usuario = await Usuario.find({correo: correo});

    if (usuario.length === 0) {
        return res.json({
            ok: true,
            mensaje: 'Correo valido no existe'
        })
    }else{
        return res.json({
            ok: false,
            mensaje: 'Correo ya existe'
        })
    }

}


/* 
*****************************************************
* CREAR UN NUEVO USUARIO ó ASESOR
*****************************************************
*/
const usuarioPost = async(req, res) => {

    if (req.body.rol === 'USER_ROLE') {
        // Si el registro es de un estudiante utilizamos lo siguiente
        try {
            const { nombre,correo,telefono,cedula,comentario,rol } = req.body;
            const estudiante = new Usuario({ nombre,correo,telefono,cedula,comentario,rol });
            const token = await generarToken(estudiante.id);
            await estudiante.save();
            res.json({
                estudiante,
                token
            })
        } catch (error) {
            console.log(error)
            return res.json({
                msg: error
            })
        }
        
    }else{
        try {
            // Si el registro es un administrador utilizamos lo siguiente
            const { nombre,correo,cedula,password,rol } = req.body;
            // Creamos la intancia de nustra clase usuario
            const usuario = new Usuario({ nombre,cedula, correo, password, rol });

            // Encriptar la contraseña
            const salt = bcryptjs.genSaltSync();

            usuario.password = bcryptjs.hashSync(password, salt);

            // Guardamos los datos en la base de datos
            await usuario.save();

            res.json({
                usuario
            })
        } catch (error) {
            console.log(error)
        }
        
    }



    
}



/* 
*****************************************************
* ELIMINAR USUARIO
*****************************************************
*/
const usuarioDelete = async(req, res = response) => {

    const { id } = req.params;
    // No eliminamos el usuario solo le colocamos el estado en false
    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false})

    const usuarioAutent = req.usuario;

    res.json(usuario);
}

/* 
*****************************************************
* ELIMINAR USUARIO
*****************************************************
*/


/* 
*****************************************************
* ACTUALIZAR ESTUDIANTE
*****************************************************
*/

const usuarioUpdate = async(req, res = response) => {
    try {
        const { id } = req.params;
        const { _id,...resto } = req.body;

        const actualizar = await Usuario.findOneAndUpdate({_id: id},resto);
        const token      = await generarToken(actualizar.id);

        return res.json({
            actualizar,
            token
        })


    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    usuarioId,
    usuarioPost,
    usuarioDelete,
    validarCorreo,
    usuarioCedula,
    usuarioUpdate,
    getAsesores

}