
var socket               = null;
var id                   = null;
let estudianteRegistrado = null;
let cargando             = false; // Para que espere la respuesta
let mensajeBot           = null;  // Ultimo mensaje que envio el bot

var url = (window.location.hostname.includes('localhost'))
            ? 'http://localhost:8085/'
            : 'http://localhost:8085/';


// Burbuja de chat
const burbuja    = document.querySelector("#burbuja");
// Ventana de chat
const chatBot    = document.querySelector('#chat-bot');
/* Contenido del chat (cabecera,body,iconos,formulario de enviar mensajes) */
const icon_close = document.querySelector('.icon-close');
const cabecera   = document.querySelector('.cabecera');
const body       = document.querySelector('.body');
const enviar     = document.querySelector('.formEnviar');
const loading    = document.querySelector("#cargando");

// variable para saber si esta hablando con el bot
var hablando = false;

// Formulario para que el usuario ingrese sus datos
const formulario = document.querySelector('#formulario');
/* Abrir chat y cerrar burbuja de chat */
icon_close.addEventListener('click', () => {
    chatBot.classList.remove('animacion-divchat');
    cabecera.classList.remove('display')
    body.classList.remove('display');
    enviar.classList.remove('display');
    burbuja.classList.remove('animacion-circulo')
    setTimeout(() => {
        chatBot.classList.add('display')
    }, 500);
    
});

/* Cerrar chat y abrir burbuja de chat*/
burbuja.addEventListener('click', () => {
    chatBot.classList.remove('display')
    if(!hablando){
        divBody.classList.add('display')
        divEnviarMjs.classList.add('display')
    }
    setTimeout(() => {
        chatBot.classList.add('animacion-divchat');
        burbuja.classList.add('animacion-circulo')
    }, 100);

});

/* div del chat */
const divChatbox     = document.querySelector("#divChatbox");
const formEnviar     = document.querySelector("#formEnviar");
const txtMensaje     = document.querySelector("#txtMensaje");


/* Formulario de registro antes de hablar con el bot */
const divRegistroBot = document.querySelector('#divRegistroBot');
const divEnviarMjs   = document.querySelector('#divEnviarMjs');
const divBody        = document.querySelector('#divBody');

const formRegistro   = document.querySelector("#formRegistro");
const identificacion = document.querySelector("#identificacion");
const telefono       = document.querySelector("#telefono");
const nombre         = document.querySelector("#nombre");
const email          = document.querySelector("#email");
const comentario     = document.querySelector("#comentario");
const formMjs        = document.querySelector("#formMjs");
const mjs            = document.querySelector("#mjs");


// REGISTRAR AL USUARIO
formRegistro.addEventListener('submit', async(e) => {
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
    // Subscribimos el navegador
    //await subscribirNavegador();
    // Conectamos el socket
    //conectarSocket();

    let Data = {
        nombre    : nombre.value,
        cedula    : identificacion.value,
        telefono  : telefono.value,
        correo    : email.value,
        comentario: comentario.value,
        rol       : 'USER_ROLE'
    };

    // Verificamos si el usuario existe por medio de su cedula
    const existeCedula = await fetch(`${url}usuarios/cedula/${ identificacion.value }`)
    const respuesta    = await existeCedula.json();
    if (respuesta.ok) {
        // Actualizamos los datos
        const resp = await fetch(`${url}usuarios/put/${ respuesta.usuario.id }`,{
            method: 'PUT',
            body: JSON.stringify(Data),
            headers: {'Content-Type': 'application/json'},
        })

        const { actualizar, token } = await resp.json();
        
        if (token && actualizar) {
            estudianteRegistrado = actualizar
            localStorage.setItem( 'token', token )
        }

        // Opciones y Mensaje de bienvenida del bot
        const inicio       = await fetch(`${url}bot/inicio`);
        const { opcion }   = await inicio.json();
        mensajeBot         = opcion.opciones;
        const data = {
            texto   : opcion.texto,
            opciones: opcion.opciones
        }
        console.log(mensajeBot)
        let objeto = {
            data: data,
            num: opcion,
            yo: false,
            asesor: false
        }
        ListarMensajes(objeto);
        
    }else{

        // Creamos uno nuevo
        const resp = await fetch(`${url}usuarios/post/estudiante`,{
            method: 'POST',
            body: JSON.stringify(Data),
            headers: {'Content-Type': 'application/json'},
        }); 
    
        const { estudiante,token } = await resp.json();
    
        if (token && estudiante) {
            estudianteRegistrado = estudiante
            localStorage.setItem( 'token', token )
        }
    }

    divRegistroBot.classList.add('display');
    divEnviarMjs.classList.remove('display');
    divBody.classList.remove('display');
    

})









/* LISTAR MENSAJES DEL USUARIO */
const chatmjs = document.querySelector("#chatmjs");

const ListarMensajes = ({data,num,yo,asesor}) => {

    var html = document.createElement("div");
    if (yo) {
        html.className = "row justify-content-end gx-1";
        html.innerHTML = `
            <div class="text-light col-10 usuario shadow p-3 mb-5 rounded">
                ${ num }
            </div>
        `;
        
    }
    if(!yo && !asesor){
        // Este mensaje lo resive la otra persona
        let li = '';
        let cabecera = '';
        for (const opc of data.opciones) {
            li += `<li>${ opc.opcion }</li>`;
        }

        for (const txt of data.texto) {
            cabecera += `<p class="text-break"> ${ txt } </p>`;
        }
        html.className = "row gx-1 justify-content-start";
        html.innerHTML = `
            <div class="col-2 mr-3">
                <img src="https://portal.curn.edu.co/img/logo.png" width="45px" class="rounded-circle" alt="...">
            </div>
            <div class="col-10  shadow p-3 mb-5 bg-body rounded mjs-bot">
                ${ cabecera }
                <ol start="1">
                    ${ li }
                </ol>
                <p>Digita una de las opciones</p>
            </div>
        `;
    }

    if(asesor){
        html.className = "row gx-1 justify-content-start";
        html.innerHTML = `
        <div class="col-2 mr-3">
                <img src="https://portal.curn.edu.co/img/logo.png" width="45px" class="rounded-circle" alt="...">
        </div>
        <div class="col-10 shadow p-3 mb-5 bg-body rounded mjs-bot">
            ${ data.mensaje }
        </div>
        `;
    }

    chatmjs.appendChild(html);
    scrol();
    
}




function escribiendo(){
    // Asesor linea: 298
    console.log(asesor);
    if(asesor){
        // Id : es el id del asesor al que le mandaremos el evento
        socket.emit("escribiendo",{ escribiendo: true, id: '60e631f1bfb1742094b68ecc' });
        console.log("Escribiendo");
    }
}

function notEscribiendo(){
    // Asesor linea: 298
    if(asesor){
        // Id : es el id del asesor al que le mandaremos el evento
        socket.emit("escribiendo",{ escribiendo: false, id: '60e631f1bfb1742094b68ecc'});
        console.log("Dejo de escribir");

    }
}





// Scroll
const scrol = () => {
    divBody.scrollTop = divBody.scrollHeight;
}

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
        chatmjs.appendChild(carg);
    }else{
        // Eliminamos el efecto cuando cargue el mensaje
        var hijo = document.getElementById("cargando");
        chatmjs.removeChild(hijo);
    }
    
}

/* 
* HABLAR CON EL BOT O CON UN ASESOR
*/
let asesor = false; // Estara true si el usuario esta hablando con el asesor
formMjs.addEventListener('submit', async(e) => {
    e.preventDefault();
    cargando = true; // Loading de mensaje
    const opcionNum = mjs.value;
    const numopciones = mensajeBot.length;
    const numerico = /^[0-9]+$/;
    
    if(!asesor){
        if (!opcionNum.match(numerico) || opcionNum > numopciones || opcionNum <= 0) {
            console.log("Ingrese un valor numerico de las opciones");
            return;
        }
        let objeto = {
            data: null,
            num: opcionNum,
            yo: true,
            asesor: false
        }
        ListarMensajes(objeto);
        mjs.value = '';

        
    }
    // Mensaje del lado del usuario
    
    // Comunicate con un asesor si marca la opcion de hablar con un asesor ó si la variable asesor esta en true
    if (parseInt(opcionNum) === numopciones || asesor) {
        // HABLANDO CON EL ASESOR
        asesor = true;
        // Evitamos que al momento de enviar la opcion elegita se guarde en la base de datos como un mensaje
        if (parseInt(opcionNum) !== numopciones) {
            let objeto = {
                data: null,
                num: mjs.value,
                yo: true,
                asesor: false
            }
            // para que no guarde la opcion de hablar con el asesor
            ListarMensajes(objeto);

            socket.emit('enviar-mensaje', {
                para   : '60e631f1bfb1742094b68ecc',
                mensaje: mjs.value,
            });

            mjs.value = '';
        }
        
        /* loading.classList.remove("d-none");
        console.log(mjs.value.toLowerCase());

        const asesores = await fetch(`${url}usuarios/getAsesores`);
        const get      = await asesores.json();
        let asesroresArr = [];
        if(get.ok){
            get.asesores.map( (resp) => {
                asesroresArr.push(resp.id);
            })
            
        } */
        

    }else{
        // HABLANDO CON EL BOT
        divLoading(true);
        scrol();
        const numOpc = opcionNum - 1;
        const clave = mensajeBot[numOpc].clave;
        const buscarPorClave = await fetch(`${url}bot/${ clave }`)
        const { opcion }     = await buscarPorClave.json();
        mensajeBot           = opcion.opciones;
        
        const data = {
            texto   : opcion.texto,
            opciones: opcion.opciones
        }
        let objeto = {
            data: data,
            num: null,
            yo: false,
            asesor: false
        }
        setTimeout(() => {
            divLoading(false);
            // Mensaje del lado del Bot
            ListarMensajes(objeto);
            //chatmjs.innerHTML +=  ``;
            
        }, 2000);
            
    }


    
    
})


/* RECONOCIMIENTO DE VOZ */
const reconocimientoVoz = () => {
    let reconoc = new webkitSpeechRecogrecognition();
    reconoc.lang = "es-ES";
    reconoc.continuous = true;
    reconoc.interimResults = false;
}







/* CONECTAR SOCKET PARA TRABAJAR CON EL */
function conectarSocket(){
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('mensaje-privado', (resp) => {
        let objeto = {
            data: resp,
            num: null,
            yo: false,
            asesor: true
        }
        if(asesor){
            ListarMensajes( objeto );
        }
        
    })

    socket.on("estaEscribiendo", ({esc}) => {
        if(asesor){
            if(esc){
                divLoading(true);
                scrol();
            }else{
                divLoading(false);
            }
        }
    })

    
}


/* 
===================================================================
======= ENVIAR NOTIFICACION DE MENSAJES A EL USUARIO PRIVADO ====
===================================================================
 */

async function enviarNotificacion(para){

    /*Buscamos en la base de datos al usuario que queremos enviarle
    una notificacion */
    const obtenerUsuario = await fetch(`${url}pushSubscription/${para}`);

    const userObtenido   = await obtenerUsuario.json();

    console.log(userObtenido);
    if (userObtenido.ok) {
        /* Estraemos la suscripcion del navegador de el usuario
        al que le enviaremos la notify */
        const data = {
            title           : `Asesor`,
            message         : `Tienes un nuevo mensaje de ${estudianteRegistrado.nombre}`,
            pushSubscription:  userObtenido.verificarId.subcription
        }

        console.log(data);

        /* Gracias a la suscripcion que le estragimos al usuario
        podemos enviarle una notificacion al navegador en que 
        se encuentre subscrito */
        const newMessage = await fetch(`${url}webpush/new-message`,{
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'},
        }); 

        const respuesta  = await newMessage.json();
        
        console.log('Respuesta = ' + respuesta.mjs)
    }else{
        
        console.log('No respondioo')
    }
    
}
/* 
===================================================================
======= ENVIAR NOTIFICACION DE MENSAJES A EL USUARIO PRIVADO ====
===================================================================
 */

//SUBSCRIBIR A UN ASESOR DE LA UNIVERSIDAD O EL USUARIO
async function subscribirNavegador(){
    
    // SUSCRIBIMOS AL USUARIO PARA PODER ENVIARLE NOTIFICACIONES

    /* Funcion para convertir la cadena base64 segura de URL en un 
     Uint8Array para pasar a la llamada de suscripción */
     function urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
          .replace(/-/g, '+')
          .replace(/_/g, '/');
       
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
       
        for (let i = 0; i < rawData.length; ++i) {
          outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
      }
    
    const PUBLIC_PUSH_KEY = 'BFrIPY-yWJaYb9No_T6G4vM7h1W6eKXWwX12eWDhK2wiaUpHtb4rXDboNkviBgaraJzVjdn0ZZFCOsPvF6TNSLQ';

    /*Convertimos en  Uint8Array y guardamos en una variable */
    var push_key = urlBase64ToUint8Array(PUBLIC_PUSH_KEY);

    /* Servir worker */
    const register = await navigator.serviceWorker.register(`js/worker.js`,{
        scope: `../js/`
    })

    // Obtenemos la suscripcion del navegador en que nos encontremos
    const subsc = await register.pushManager.subscribe({
        userVisibleOnly     : true,
        applicationServerKey: push_key
    });

    
    /* Creamos un objeto en donde guardaremos la suscripcion del
    navegador en que estemos y tambien guardaremos el id
    del usuario autenticado en este navegador */
    let userSubscripcion = {id: id}

    let datosSubs = JSON.stringify(subsc);

    userSubscripcion['subcription'] = JSON.parse(datosSubs);
    
    // Guardar esa subscripcion en la base de datos
    const guardarSubscripcion = await fetch(`${url}pushSubscription/guardar-subscripcion`,{
        method: 'POST',
        body: JSON.stringify(userSubscripcion),
        headers: {'Content-Type': 'application/json'},
    });

    const respuesta = await guardarSubscripcion.json();
    console.log("Respuesta: => " + respuesta)
}





const main = async() => {

    conectarSocket();

}


main();