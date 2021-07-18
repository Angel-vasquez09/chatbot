const express              = require('express')
const hbs                  = require('hbs');
const cors                 = require('cors');
const path                 = require("path")
const { socketController } = require('../socket/controller');
const { dbConnection }     = require('../database/config');

class Server {

    constructor(){

        this.app = express();
        this.port = process.env.PORT;
        

        // CONFIGURAR EL SERVIDOR PARA TRABAJAR CON SOCKETS
        this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server);


        // Conectar a la base de datos
        this.connectarDB();

        // handelbars
        this.handlebars();
        
        // MiddleWare
        this.middleware();

        // Rutas de mi app
        this.routes();
        
        this.sockets();
    }

    middleware(){
        
        this.app.use(cors());

        this.app.use(express.json());

        this.app.use(express.static('public')); // Servir contenido estatico
        
    }

    sockets(){
        this.io.on('connection', (socket) => socketController(socket, this.io));
    }


    async connectarDB(){
        await dbConnection();
    }

    handlebars(){
        this.app.set('view engine', 'hbs');
        hbs.registerPartials(path.join(__dirname, '../' , '/views/partials'));
    }


    routes(){
        
        this.app.use('/',                require('../routes/views'));

        this.app.use('/usuarios',        require('../routes/usuario'));

        this.app.use('/auth',            require('../routes/auth'));

        this.app.use('/asesor',          require('../routes/asesor'));

        this.app.use('/bot',             require('../routes/bot'));
        
        this.app.use('/chat',            require('../routes/chat'));

        this.app.use('/webpush',         require('../routes/webpush'));

        this.app.use('/pushSubscription',require('../routes/subsNotification'));
        
        //this.app.use('*', require('../routes/auth')); Pagina de error
    }

    listen(){
        this.server.listen(this.port, () => {
            console.log(`Corriendo en el puerto ${this.port}!`)
        })
    }

}

// Exportamos la clase
module.exports = Server;