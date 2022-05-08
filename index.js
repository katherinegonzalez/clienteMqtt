// An mqtt variable will be initialized globally 
// https://www.emqx.com/en/blog/mqtt-js-tutorial
console.log(mqtt)
const options = {
    connectTimeout: 4000,
    clientId: 'mqttjs_40c2ffb357',
    keepalive: 60,
    clean: true,
}

// Websocket  connect url
const WebSocketURL = "ws://20.225.162.185:8093/mqtt";

const client = mqtt.connect(WebSocketURL, options);



const addMessage = (message, idType) => {
    //Create an "li" node:
    const node = document.createElement("li");

    // Create img node
    const img = document.createElement("img");
    img.src = idType === "receivedMessage" ? "assets/icons/received_icon.svg": "assets/icons/sent_icon.svg";
    img.classList.add('icon-list');

    // Create a text node:
    const textnode = document.createElement("span");
    textnode.textContent = message;

    // Append the text node to the "li" node:
    node.appendChild(img);
    node.appendChild(textnode);

    // Append the "li" node to the list:
    document.getElementById("listaMensajesRecibidos").appendChild(node);
}

let textMessage;
const sendButton = document.getElementById("btnEnviar");
sendButton.disabled = true;
const textArea = document.getElementById("sMessage");
textArea.onkeyup = function() {
    console.log('focus');
    // Do something while the textarea being used by a user
    textMessage =  textArea.value;
    if(textMessage) {
        console.log('texto: ', textMessage);
        sendButton.disabled = false;
    }
    
};


const sendMessage = () => {
    console.log('click on button');
    // textMessage =  textArea.value;
    

    // verificar primero que esté conectado
    console.log('textMessage: ', textMessage);
    console.log('client: ', client.connected);
    sendButton.disabled = !!textMessage;
    addMessage(textMessage, 'sendMessage');
    if(!textMessage){
        alert('Escriba un mensaje');
    }

    if(client.connected) {
        // Enviar mensaje
        client.publish('salida', textMessage || 'Mensaje de prueba', error => {

            if(error) {
                alert('Su mensaje no pudo ser enviado', error);
                console.log(error);
            } else {
                console.log('Mensaje enviado!!!');
                addMessage(textMessage, 'sendMessage');
            }
            
        });
    } else {
        alert('El cliente no está conectado');
    }
   

}

client.on('connect', () => {
    console.log('Mqtt conectado por WS! Exito!');

    // Me suscribo
    client.subscribe('testtopic', { qos: 0 }, error => {
        if(!error){
            console.log('Suscripción Exitosa!');
        } else {
            console.log('Suscripción fallida!');
        }
    });

    // publico mensajes
    client.publish('salida', 'esto es un verdadero éxito' || textMessage , error => {
        console.log(error || 'Mensaje enviado!!!');
    });
});

client.on('message', (topic, message) => {
    console.log('Mensaje recibido bajo tópico: ', topic, ' ->', message.toString());
    addMessage(message.toString(), listaMensajesRecibidos);
});
