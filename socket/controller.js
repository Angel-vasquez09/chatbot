const { Socket } = require("socket.io");
const { grabarMensaje, usuariosRegistrados } = require("../controllers/socket");
const { comprobarToken } = require("../helpers/generar-token");


const socketController = async(socket = new Socket, io) => {

    const datos = await comprobarToken(socket.handshake.headers['x-token']);
    
    if (!datos) {
        return socket.disconnect();
    }
    // CONECTAR A EL USUARIO A UNA SALA ESPECIALIZADA O A UN ASESOR
    socket.join( datos.id );

    // Envio de mensaje entre usuario/bot - usuario/assesor
    socket.on('enviar-mensaje', async({para, mensaje}) => {
        
        grabarMensaje({de: datos.id, para: para, mensaje: mensaje });
        
        const info = { nombre: datos.nombre, mensaje: mensaje}
        
        socket.to(para).emit("mensaje-privado", info);
    })

    // Evendo de escribiendo...
    socket.on("escribiendo", ({ escribiendo, id }) => {
        console.log(escribiendo, id);
        if(escribiendo){
            socket.to(id).emit("estaEscribiendo", { esc: true });
        }else{
            socket.to(id).emit("estaEscribiendo", { esc: false });
        }
    })

    const usuarios = await usuariosRegistrados();
    
    socket.emit('user-registrados',usuarios);

}


module.exports = {
    socketController
}