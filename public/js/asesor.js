let ases        = null; // Datos del asesor logueado
let socket      = null;
let tokenValido = null;
let usuarioChat = null; // Usuario con el que quiere hablar el asesor

var url = (window.location.hostname.includes('localhost'))
            ? 'http://localhost:8085/'
            : 'http://localhost:8085/';

const validarTokn = async() => {
    console.log('Asesor')
    // Extraemos el token que tengamos en el navegador
    const token = localStorage.getItem('token') || '';
    tokenValido = token;
    if (token.length <= 10) {
        // Redireccionamos si el token es incorrecto
        window.location = '/administrador';
        throw new Error('No existe un token en el servidor');
    }
    
    const resp = await fetch(`${url}auth/`, { 
        headers: { 'x-token': token }
    });
    
    const { usuario: userDB, token: tokenDB } = await resp.json();
    ases = userDB; 
    // Renovamos el token
    localStorage.setItem('token', tokenDB);
    
    conectarSocket();

}


/* ABRIR LA CONEXION EN TIEMPO REAL CON EL SERVIDOR  */
const conectarSocket = async() => {
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('user-registrados', (usuarios) => {
        mostrarUsuarios(usuarios);
    })

    socket.on('mensaje-privado', (resp) => {
        console.log(resp);
        ListarMensajes(resp,false);
    })

    socket.on("estaEscribiendo", ({esc}) => {
        if(esc){
            divLoading(true);
        }else{
            divLoading(false);
        }
    })
}

/* 
************************************************
* CARGAR TODOS LOS USUARIOS REGISTRADOS
************************************************
*/
const divUsuarios = document.querySelector("#divUsuarios");
const mostrarUsuarios = (usuarios) => {
    let html = '';
    for (let index = 0; index < usuarios.length; index++) {
        const user = usuarios[index];
        html += 
        `
        <a onclick="user('${ user.id }')" id="${user.id}" class="list-group-item list-group-item-action rounded-0">
            <div class="media"><img
                    src="https://png.pngtree.com/png-vector/20190710/ourlarge/pngtree-user-vector-avatar-png-image_1541962.jpg"
                    alt="user" width="50" class="rounded-circle">
                <div class="media-body ml-4">
                    <div class="d-flex align-items-center justify-content-between mb-1">
                        <h6 class="mb-0">${ user.nombre }</h6><small class="small font-weight-bold">25
                            Dec</small>
                    </div>

                </div>
            </div>
        </a>
        
        `;
        
    }

    divUsuarios.innerHTML = html;

    
    
    
}




/* 
************************************************************************
* CARGAR LOS MENSAJES DEL ASESOR Y DEL USUARIO
************************************************************************
 */
const divMensajes = document.querySelector("#divMensajes");
const cargarMensajes = (mensajes) => {
    divMensajes.innerHTML = '';
    let divMsj = '';
    for (let index = 0; index < mensajes.length; index++) {
        const msj = mensajes[index];

        if (msj.para === ases.id) {
            // Mensaje del usuario
            divMsj += `
            <div class="media row justify-content-start mb-3">
                    <div class="col-2 col-sm-1 mr-3">
                        <img
                        src="https://png.pngtree.com/png-vector/20190710/ourlarge/pngtree-user-vector-avatar-png-image_1541962.jpg" alt="user"
                        width="45px" class="rounded-circle">
                    </div>
                    <div class="media-body col-10 col-sm-11 ml-3">
                        <div class="media row mb-3" style="max-width: 90%">
                            <div class="col-12 w-auto" >
                                <div class=" bg-light  rounded py-2 px-3 mb-2" >
                                    <p class="text-small mb-0">${ msj.mensaje }</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="d-flex justify-content-start">
                            <p class="small text-start text-muted">12:00 PM | Aug 13</p>
                        </div>
                    </div>
                </div>
            
            `
        }
        
        if (msj.de === ases.id) {
            // Mensaje del Asesor
            divMsj += `
            <div class="media row justify-content-end mb-3">
                <div class="col-12 d-flex justify-content-end" style="max-width: 70%">
                    <div class="media-body d-flex justify-content-end">
                        <div class=" bg-primary rounded py-2 px-3 mb-2" >
                            <p class="text-small mb-0 text-white">${ msj.mensaje }</p>
                        </div>
                    </div>
                </div>

                <div class="col-12 d-flex justify-content-end">
                    <p class="small text-muted">12:00 PM | Aug 13</p>
                </div>
                
            </div>
            `
        }
    }
    divMensajes.innerHTML += divMsj; 


}

/* 
************************************************************************
* FIN DE CARGAR LOS MENSAJES DEL ASESOR Y DEL USUARIO
************************************************************************
 */



/*
===================================================================
=========================LISTAR MENSAJE EN EL CHAT=================
==================================================================*/
const ListarMensajes = (datos,yo) => {

    var html = document.createElement("div");
    html.className = "media w-100 d-flex justify-content-end mb-3 ";
    if (yo) {
        html.innerHTML = `
            <div class="media row justify-content-end mb-3">
            <div class="col-12 d-flex justify-content-end" style="max-width: 70%">
                <div class="media-body d-flex justify-content-end">
                    <div class=" bg-primary rounded py-2 px-3 mb-2" >
                        <p class="text-small mb-0 text-white">${ datos.mensaje }</p>
                    </div>
                </div>
            </div>

            <div class="col-12 d-flex justify-content-end">
                <p class="small text-muted">12:00 PM | Aug 13</p>
            </div>
            
        </div>
        `;
    }else{
        // Este mensaje lo resive la otra persona
        html.innerHTML = `
        <div class="media row justify-content-start mb-3">
                    <div class="col-2 col-sm-1 mr-3">
                        <img
                        src="https://png.pngtree.com/png-vector/20190710/ourlarge/pngtree-user-vector-avatar-png-image_1541962.jpg" alt="user"
                        width="45px" class="rounded-circle">
                    </div>
                    <div class="media-body col-10 col-sm-11 ml-3">
                        <div class="media row mb-3" style="max-width: 90%">
                            <div class="col-12 w-auto" >
                                <div class=" bg-light  rounded py-2 px-3 mb-2" >
                                    <p class="text-small mb-0">${ datos.mensaje }</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="d-flex justify-content-start">
                            <p class="small text-start text-muted">12:00 PM | Aug 13</p>
                        </div>
                    </div>
                </div>
        `;
        
    }
    divMensajes.appendChild(html);
    scrol();
}
/*
===================================================================
====================FIN DE LISTAR MENSAJE EN EL CHAT===============
==================================================================*/





/*
===================================================================
===================AGREGAR ANIMACION AL ESPERAR UN MENSAJE===============
==================================================================*/

// Crear efecto de espera de mensaje
const divLoading = (esperando) => {
    var carg = document.createElement("div");
    
    if(esperando){
        // Agregamos el efecto a la ultima posicion de la caja de mensaje
        carg.className = "row gx-1 justify-content-start";
        carg.id = "cargando"
        carg.innerHTML = `
        <div class="loading mb-5 ">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
        </div>
        `;
        scrol();
        divMensajes.appendChild(carg);
    }else{
        // Eliminamos el efecto cuando cargue el mensaje
        var hijo = document.getElementById("cargando");
        divMensajes.removeChild(hijo);
    }
    
}


// Evento para saber cuando el asesor esta escribiendo 
function escribiendo(){
    socket.emit("escribiendo",{ escribiendo: true, id: usuarioChat.usuario.id });
    
}

function notEscribiendo(){
    socket.emit("escribiendo",{ escribiendo: false, id: usuarioChat.usuario.id });
}






// Scroll
const scrol = () => {
    divMensajes.scrollTop = divMensajes.scrollHeight;
}


/* 
************************************************************************
* FORMULARIO PEQUEÑO PARA QUE EL ASESOR ENVIE LOS MENSAJES AL ESTUDIANTE
************************************************************************
 */
const formMjs = document.querySelector("#formMjs");

formMjs.addEventListener( 'submit', (e) => {
    e.preventDefault();
    const fecha = new Date();
    const hora = fecha.getHours() + ':' + fecha.getMinutes();

    const datos = {
        para   : usuarioChat.usuario.id,
        mensaje: txtMensaje.value
    }

    socket.emit('enviar-mensaje', datos);

    txtMensaje.value = '';
    ListarMensajes(datos,true);
})
/* 
************************************************************************
* FIN DEL FORMULARIO PEQUEÑO PARA QUE EL ASESOR ENVIE LOS MENSAJES AL ESTUDIANTE
************************************************************************
 */








/* 
************************************************************************
* EVENTO AL PRESIONAR AL USUARIO CON EL QUE VAMOS A CHATEAR
************************************************************************
 */
const antes          = document.querySelector("#antes");
const chatEstudiante = document.querySelector("#chatEstudiante");
const inicio         = document.querySelector("#inicio"); 
// evento para ir al inicio
inicio.addEventListener("click", () => {
    antes.classList.remove('d-none');
    chatEstudiante.classList.add('d-none');
})


async function user(id){
    const resp    = await fetch(`${url}usuarios/${id}`);
    const Msj = await fetch(`${url}chat/${id}`, { 
        headers: { 'x-token':  localStorage.getItem("token") }
    });
    
    const { mensajes } = await Msj.json(); 
    const usuario = await resp.json();
    cargarMensajes( mensajes );
    if(usuario){
        usuarioChat = usuario
        antes.classList.add('d-none');
        chatEstudiante.classList.remove('d-none');
        // Cuando el asesor entre al chat del usuario empezaran hablar los dos
        let divuser = document.getElementById(`${id}`);
        divuser.style.background = "#6a6a69";
        divuser.style.color = "white";
        scrol();
    }
}


/* 
************************************************************************
* EVENTO AL PRESIONAR AL USUARIO CON EL QUE VAMOS A CHATEAR
************************************************************************
 */




const main = async() => {
    await validarTokn();
}


main();

