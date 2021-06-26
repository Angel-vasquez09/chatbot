
let socket = null;
let id     = null;
const chatBot    = document.querySelector('#chat-bot');
const formulario = document.querySelector('#formulario');
const close      = document.querySelector('#close');

chatBot.addEventListener('click', () => {
    formulario.classList.remove("display");
    chatBot.classList.add('display');
});

close.addEventListener('click', () => {
    formulario.classList.add("display");
    chatBot.classList.remove('display');
});

/* div del chat */
const divChatbox     = document.querySelector("#divChatbox");
const formEnviar     = document.querySelector("#formEnviar");
const txtMensaje     = document.querySelector("#txtMensaje");


/* Formulario de registro */
const formRegistro   = document.querySelector("#formRegistro");
const identificacion = document.querySelector("#identificacion");
const telefono       = document.querySelector("#telefono");
const nombre         = document.querySelector("#nombre");
const email          = document.querySelector("#email");

formRegistro.addEventListener('submit', (e) => {
    e.preventDefault();
    
    var validar = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;

    let listo = true;

    listo = nombre.value ===  '' ? false : true;

    listo = telefono.value.length < 11 ? false : true;

    listo = !validar.test(email.value) ? false : true;

    listo = identificacion.value.length < 5 ? false : true;

    id    = identificacion.value;

    /* if (!listo) {
        console.log('* Campos obligatorios')
        return;
    } */

    conectarSocket();

    divChatbox.classList.remove("mostrar");
    formEnviar.classList.remove("mostrar");
    formRegistro.classList.add("mostrar");
})



const ListarMensajes = (datos,yo) => {
    
    var html = '';

    if (yo) {
        html +=  `
                <li class="reverse animated fadeIn">
                    <div class="chat-content">
                        <div class="box bg-light-inverse">
                            Usuario
                        </div>
                    </div>
                </li>
        `;
        
    }else{
        // Este mensaje lo resive la otra persona
        html += '<li class=" animated fadeIn">';
        html +=      '<div class="chat-time">'+datos.hora+'</div>';
        html +=         '<div class="chat-content">';
        html +=             '<div class="box bg-light-info animated fadeIn">'+ datos.mensaje +'</div>';
        html +=         '</div>';
        html += '</li>';
    }

    divChatbox.innerHTML += html;
}


// ENVIAR MENSAJE
formEnviar.addEventListener('submit', (e) => {
    e.preventDefault();

    if (txtMensaje.value === '') {
        return;
    }

    if (txtMensaje.value === 'asesor') {

        socket.emit('enviar-mensaje', {
            para   : 'asesor',
            mensaje: txtMensaje.value,
        });

    }

    socket.emit('enviar-mensaje', {
        para   : 'bot',
        mensaje: txtMensaje.value,
    });

    ListarMensajes(
        {
            mensaje : txtMensaje.value,
        }, true);
        
})


/* CONECTAR SOCKET PARA TRABAJAR CON EL */
const conectarSocket = async() => {
    socket = io({
        'extraHeaders': {
            'id': id
        }
    });

    console.log(id)

}




/* 
const main = async() => {

    await conectarSocket();

}


main(); */