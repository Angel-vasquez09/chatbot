const { response } = require("express");
const bcryptjs = require('bcryptjs');
const Usuario = require("../models/usuario");
const { generarToken } = require("../helpers/generar-token");


const loginUsuario = async(req, res = response) => {

    const {correo, password} = req.body;

    try {

        // Verificar si el correo existe
        const asesor = await Usuario.findOne({correo});

        if (!asesor) {
            return res.status(400).json({
                msg: "Correo / password son incorrectos - correo"
            })
        }
        
        // Verificar si el usuario esta activo en la base de datos
        if (!asesor.estado) {
            return res.status(400).json({
                msg: "Correo / password son incorrectos - estado"
            })
        }

        // Verificar la contraseña
        const veriPass = bcryptjs.compareSync(password, asesor.password);

        if (!veriPass) {
            return res.status(400).json({
                msg: "Correo / password son incorrectos - password"
            })
        }

        // Generar el JWT
        const token = await generarToken(asesor.id);

        res.json({
            asesor,
            token
        })
        
    } catch (error) {
        return res.status(500).json({
            msg: error
        })
    }


}


const renovarToken = async(req, res = response) => {

    try {
        const usuario = req.user;

        const token = await generarToken(usuario.id);

        res.json({
            usuario,
            token
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: error
        })
    }
    
}

module.exports = {
    loginUsuario,
    renovarToken

}