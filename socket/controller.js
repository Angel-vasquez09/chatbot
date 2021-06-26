const { Socket } = require("socket.io");


const socketController = async(socket = new Socket, io) => {

    const usuarioId = socket.handshake.headers['id'] | null;

    // CONECTAR A EL USUARIO A UNA SALA ESPECIALIZADA
    socket.join(usuarioId);

    console.log('Usuario conectado: ', usuarioId);


    socket.on('enviar-mensaje', async({para, mensaje}) => {
        if (para === 'asesor') {
            
        }
    })

}


module.exports = {
    socketController
}