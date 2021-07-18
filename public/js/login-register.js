
let DatosAsesor = null;

const lilog = document.querySelector('#li-log');
const log = document.querySelector('#log');
const lising = document.querySelector('#li-sing');
const sing = document.querySelector('#sing');

/* Divs de formulario de registro y de login */
const signup = document.querySelector('#signup');
const login = document.querySelector('#login');

log.addEventListener('click', (e) => {
    e.preventDefault();
    lilog.classList.add("active");
    lising.classList.remove("active");
    //Mostrar o quitar formulario de registro o login
    signup.classList.add('tab-content');
    login.classList.remove('tab-content');
})

sing.addEventListener('click', (e) => {
    e.preventDefault();
    lilog.classList.remove("active");
    lising.classList.add("active");
    //Mostrar o quitar formulario de registro o login
    signup.classList.remove('tab-content');
    login.classList.add('tab-content');
})

var url = (window.location.hostname.includes('localhost'))
            ? 'http://localhost:8085/'
            : 'http://localhost:8085/';



/* 
*****************************************************
* FROMULARIO DE LOGIN ASESOR
*****************************************************
*/

const formLogin = document.querySelector("#formLogin");
const correo     = document.querySelector("#email");
const password  = document.querySelector("#password");


formLogin.addEventListener('submit', async(e) => {
    e.preventDefault();

    if (correo.value === '') {
        return;
    }

    if (password.value === '') {
        return;
    }

    const forData = {
        correo  : correo.value,
        password: password.value
    };

    
    const existeAsesor = await fetch(`${url}auth/login`, {
        method: 'POST',
        body: JSON.stringify(forData),
        headers: {'Content-Type': 'application/json'},
    });

    const { asesor, token } = await existeAsesor.json();
    if(asesor){
        DatosAsesor = asesor;
        localStorage.setItem('token',token);
        await subscribirNavegador();
        window.location = '/asesor';
    }
    
})


/* 
*****************************************************
* FROMULARIO DE REGISTRO DE USUARIO/ASESOR
*****************************************************
*/



//SUBSCRIBIR EL NAVEGADOR DEL ASESOR
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
    let userSubscripcion = { id: DatosAsesor.id }

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