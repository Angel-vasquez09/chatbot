const express = require('express')
const cors = require('cors');
const { socketController } = require('../socket/controller');

class Server {

    constructor(){

        this.app = express();
        
        this.port = process.env.PORT;

        // CONFIGURAR EL SERVIDOR PARA TRABAJAR CON SOCKETS
        this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server);

        // MiddleWare
        this.middleware();

        // Rutas de mi app
        this.routes();
        
        this.sockets();
    }

    middleware(){
        
        this.app.use(cors());

        this.app.use(express.json());

        this.app.use(express.static('public'));
        
    }

    sockets(){
        this.io.on('connection', (socket) => socketController(socket, this.io));
    }


    async connectarDB(){
        await dbConnection();
    }


    routes(){
        //this.app.use('/auth', require('../routes/auth'));
    }

    listen(){
        this.server.listen(this.port, () => {
            console.log(`Corriendo en el puerto ${this.port}!`)
        })
    }

}

// Exportamos la clase
module.exports = Server;