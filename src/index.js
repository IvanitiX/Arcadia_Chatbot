const api_chat = require("tmi.js");
//La API de sonido necesita un reproductor de sonido CLI 
// (en este caso uso MPG123, tendrás que descargarlo via apt o setear una PATH para Windows)
//Si no lo vas a usar coméntalo
const api_sound = require('play-sound-v12') (opts = {player: 'mpg123'});

/*Opciones de configuración*/
const opciones = {
    options:{
        //En caso de querer mensajes detallados por pantalla (como un verbose), descomenta esto
       // debug:true
    },
    identity: {
        //Pon el usuario y OAuth (consíguelo en https://twitchapps.com/tmi/) de tu cuenta bot
        username: "",
        password: ""
    },
    //Pon aquí el nombre de tu canal de Twitch
    channels: [""]
} ;

//handler será la constante para poder enviar mensajes (con el método say) y conectarse al chat
const handler = new api_chat.client(opciones); 

//Funciones para gestionar los eventos
handler.on('connected', notifyInitChat);
handler.on('message', handleMessage);


//Función inicial. Llama a los métodos necesarios para que el bot empiece a funcionar.
//Los detectores de eventos arriba mencionados se encargarán de ver el momento en el que se conecten
// y si alguien manda un mensaje.
function main(){
    console.log("Iniciando Arcadia Chatbot") ;
    connectToTwitch();
}

function connectToTwitch(){
    handler.connect();
    console.log("Conectado");
}

function notifyInitChat(address,port){
    console.log('Hola, aquí Arcadia. Estoy conectada a ' + address + ':' + port);
}

function handleMessage(target,context,message,self){
    //Los mensajes que mande Arcadia, de momento, no son parseables.
    if (self) return 0;
    else{
        //En consola sale quién habla y el mensaje que ha escrito
        console.log(context.username + ' $> ' +  message);
        var commandName = message.trim();

        //Puse un par de funciones de ejemplo.
        /*'target' es el nombre del canal al que va a leer/escribir mensajes
        'context' es la info del usuario, en este caso 'username' devuelve el nick (no estilizado) de este*/ 
        switch(commandName.toLowerCase()){
            case "hola": salute(target, context.username); break;
            case "!dado": rollDice(target, context.username); break;
        }

    }

}

//Funciones randomizadoras
function randomizeNumber(max){
    return randomizeNumberArray(max) + 1;
}

function randomizeNumberArray(max){
    return Math.floor(Math.random() * max) ;
}

//Funciones de respuesta. Pon las funciones que te plazcan aquí.

function salute(channel, user){
    handler.say(channel,"Hola " + user + " , ¿qué tal?");
    //playAudio("Hola.mp3");
}

function rollDice(channel, user){
    const sides = 6;
    var number = randomizeNumber(sides);
    handler.say(channel, user + ", has sacado un " + number + " en el dado");
}

//Funciones de sonido. Si no vas a usar sonidos, comenta las funciones

function notifyAudioError(err){
    console.log("No puedo reproducir este audio o éste ha terminado de sonar :( \n Output >> " + err);
}

function playAudio(soundFile){
    //Introduce aquí tu path a la carpeta de sonidos. A la hora de llamar a tu función pon solo el nombre y extensión
    var path = "" + soundFile ;
    console.log("Intentando reproducir " + path);
    api_sound.play(path,notifyAudioError);
}



//Llamar al inicializador
main();