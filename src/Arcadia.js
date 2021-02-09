const api_chat = require("tmi.js");
const api_sound = require('play-sound-v12') (opts = {player: 'mpg123'});

/*Opciones de configuración*/
const opciones = {
    options:{
        debug:true
    },
    identity: {
        username: "notifs_arcadia",
        password: "oauth:lfujhuoaq4g65zr1k3pc2rpe03prs8"
    },
    channels: ["IvanitiX"]
} ;

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
	console.log("Nuevo mensaje");
	console.log(context);
        console.log(context["display-name"] + ' $> ' +  message);
        var commandName = message.trim();

        switch(commandName.toLowerCase()){
            case "hola": salute(target, context["display-name"]); break;
            case "!dado": rollDice(target, context["display-name"]); break;
            case "!manco": tellManco(target); break;
            case "!dollars": tellDollars(target); break;
            case "!troll": trollStreamer(target); break;
            case "!audiencianacional" : tellCondena(target, context["display-name"]) ; break ;
            case "!discord" : tellDiscord(target, context.username); break;
            case "!comandos" : tellCommands(target); break; 
            case "!arcadia" : tellAboutArcadia(target) ; break;
            case "!f" : drawF(target); break;
            case "!coinflip" : coinFlip(target, context.username) ; break;
        }

        if(commandName.toLowerCase().includes("chino")) chinesePun(target) ;
        if(commandName.toLowerCase().includes("chino")) japanesePun(target) ;
        if(commandName.toLowerCase().includes("!amor")) calcLove(target, context["display-name"], commandName.split(" ")[1]);
        if(commandName.toLowerCase().includes("!duelo")) calcLoveDuel(target, context["display-name"], commandName.split(" ")[1],commandName.split(" ")[2]);
        if(commandName.toLowerCase().includes("!examen")) calcExamen(target, context["display-name"], commandName.split(" ")[1]) ;
        if(commandName.toLowerCase().includes("law")) handler.say(target, "¿Y quien es esa tal Law?");

    }

}

//Función randomizadora
function randomizeNumber(max){
    return randomizeNumberArray(max) + 1;
}

function randomizeNumberArray(max){
    return Math.floor(Math.random() * max) ;
}

//Funciones específicas del canal

function salute(channel, user){
    handler.say(channel,"/me Hola " + user + " , ¿qué tal?");
    playAudio("Hola.mp3");
}

function rollDice(channel, user){
    const sides = 6;
    var number = randomizeNumber(sides);
    handler.say(channel, "/me" + user + ", has sacado un " + number + " en el dado");
}

function coinFlip(channel, user){
    const faces = 2;
    var face = randomizeNumber(faces);
    switch (face) {
      case 1:
        handler.say(channel, "/me " + user + ", has sacado cara");
      break;
      case 2:
        handler.say(channel, "/me " + user + ", has sacado cruz");
      break;
  
    }
  }

function chinesePun(channel){
    handler.say(channel, "/me ¡No es chino, es japonés! (seguramente)");
}

function japanesePun(channel){
    handler.say(channel, "/me KAWAIII DESUNEE ONIICHAN OWO UWU EWE");
}

function tellManco(channel){
    handler.say(channel, "/me Eres un manco, no sé ni para qué me creaste");
    playAudio("Manco.mp3");
}

function tellDollars(channel){
    handler.say(channel, "/me Dollars, chavales, DOOOOLARSS!");
}

function trollStreamer(channel){
    const sides = 10;
    const timeout = 10000;
    var number = randomizeNumber(sides);
    var numberTimeOut = randomizeNumber(timeout);
    for (let i = 0 ; i < number ; i++){
        setTimeout(() =>  handler.say(channel, "/me Iván"), numberTimeOut);
    }
}

function calcLove(channel, user, lover){
    if (lover === undefined) lover = "la Nada";
    const loveMax = 100;
    const loveProb = randomizeNumber(loveMax);
    handler.say(channel, "/me Hay un " + loveProb + "% de que se enamoren " + user + " y " + lover);
}

function tellDiscord(channel, user){
    handler.say(channel, "/me " + user + ", el Discord es https://discord.gg/QxvCwrS");
}

function tellCondena(channel, user){
    const condenas = ["Tráfico de Bytes","Desobediencia civil","Injurias a nuestra deidad Arcadia","Referendum ilegal","Atentado contra el estado psicomental del streamer",
                      "Spammeo incontrolado","Robo de Bytes", "Uso de Tecnopsicotrópicos", "No entender una Arcadia Reference", "Desacato a la Audiencia Nacional", 
                      "Robo de Opel Corsa", "Injurias a Japoneses", "Generalización de asiáticos a China", "Posesión de bombas de spammeo"];
    const totalCondenas = condenas.length; 
    const totalCasos = 1000;
    var numCondenas = randomizeNumber(totalCondenas);
    var numCaso = randomizeNumber(totalCasos);
    var strCondenas = "/me Por orden de la Audiencia Nacional, en el caso nº " + numCaso + " ,el acusado " + user + " es condenado a 1 día de trabajos sociales por los crímenes de ";
    var condena = randomizeNumberArray(totalCondenas);
    strCondenas = strCondenas +  condenas[condena];
    for (let i = 1 ; i < numCondenas ; i++){
        condena = randomizeNumberArray(totalCondenas);
        strCondenas = strCondenas + " , " +  condenas[condena];
    }
    
    switch(numCaso){
        case 69: strCondenas = strCondenas + " y ser Demasiado sexy" ;  break;
        case 420: strCondenas = strCondenas + " y Fumar Hierbas del campo"; break;
        case 155: strCondenas = strCondenas + " y No comer calçots" ; break;
        case 143: strCondenas = strCondenas + " y No Llevar Mascarilla "; break;
    }
    
    handler.say(channel, strCondenas);
    playAudio("Sorpresa.mp3");
}

function tellCommands(channel){
    handler.say(channel,"/me Los comandos disponibles son: !amor, !duelo, !dado, !manco,!dollars,!audiencianacional,!troll,!discord. Se irá mejorando este bot poco a poco, así que paciencia")
}

function tellAboutArcadia(channel){
    handler.say(channel, "/me Pues yo, Arcadia, soy una IA. Ayudo a Iván de vez en cuando y me gusta interactuar con vosotros. Espero que os lo paséis bien por aquí :)");
    playAudio("Arcadia.mp3");
}

function calcLoveDuel(channel,user,enemy,lover){
    const loveMax = 100;
    var love, winner, loser, loveProbUser = 0, loveProbEnemy = 0, loveProbWinner, loveProbLoser;
    for(let i=0; i < 10 ; i++){
        loveProbUser += randomizeNumber(loveMax);
        loveProbEnemy += randomizeNumber(loveMax);
    }

    if(loveProbUser > loveProbEnemy){
        winner = user; 
        loveProbWinner = loveProbUser ;
        loser = enemy;
        loveProbLoser = loveProbEnemy ;
    }
    else{
        winner = enemy;
        loveProbWinner = loveProbEnemy ;
        loser = user ;
        loveProbLoser = loveProbUser ;
    }

    handler.say(channel, "/me " + winner + " está más enamorado de " + lover + " que " + loser + ", así que cuidadito! (" + loveProbWinner/10.0  + "/" + loveProbLoser/10.0 + ")");

    
}

function calcExamen(channel,user,subject){
    const notaMax = 11;
    var nota = randomizeNumber(notaMax) ;

    handler.say(channel, "/me " + user + ", vas a sacar un " + nota + " en el examen de " + subject);
}

function drawF(channel){
    var stringsF = ["/me FFFFFFFFFFFFFF", "/me FFFF", "/me FFFFFFFFF" ];
    var stringF ;

    for (let i = 0 ; i < 9 ; i++){
        if (i < 2) stringF = stringsF[0];
        else if (i === 4 || i === 5) stringF = stringsF[2];
        else stringF = stringsF[1];
        handler.say(channel, stringF);
    }
}

//Funciones de sonido

function notifyAudioError(err){
    console.log("No puedo reproducir este audio o éste ha terminado de sonar :( \n Output >> " + err);
}

function playAudio(soundFile){
    var path = "C:\\Users\\Ivan\\Desktop\\Arcadia_Chatbot\\sound\\" + soundFile ;
    console.log("Intentando reproducir " + path);
    api_sound.play(path,notifyAudioError);
}



//Llamar al inicializador
main();