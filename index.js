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

    // Create a text node:
    const textnode = document.createTextNode(message);

    // Append the text node to the "li" node:
    node.appendChild(textnode);

    // Append the "li" node to the list:
    document.getElementById("listaMensajesRecibidos").appendChild(node);
}

let textMessage;

const sendMessage = () => {
    console.log('click on button');
    textMessage =  document.getElementById("sMessage").value;

    // verificar primero que esté conectado
    console.log('textMessage: ', textMessage);
    // Enviar mensaje
    client.publish('salida', textMessage || 'Mensaje de prueba', error => {
        console.log(error || 'Mensaje enviado!!!');
    });

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