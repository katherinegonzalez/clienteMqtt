// An mqtt variable will be initialized globally 
// https://www.emqx.com/en/blog/mqtt-js-tutorial

// Azure: http://20.127.83.110:18083 -> tools -> websocket
// user:admin
// pass: public

console.log(mqtt)
const options = {
    connectTimeout: 4000,
    clientId: 'mqttjs_40c2ffb357',
    keepalive: 60,
    clean: true,
}

// Websocket  connect url
const WebSocketURLAzure = "ws://20.127.83.110:8093/mqtt";
const WebSocketURLAmazon = "ws://54.163.248.88:8093/mqtt";

const isAmazonClient = (hostname) => WebSocketURLAmazon.includes(hostname);
const isAzureClient = (hostname) => WebSocketURLAzure.includes(hostname);
const reconnectOtherClient = () => {
    if(isAzureClient(client.options.hostname)){
        client.end();
        client = mqtt.connect(WebSocketURLAmazon, options);
    } else if(isAmazonClient(client.options.hostname)) {
        client.end();
        client = mqtt.connect(WebSocketURLAzure, options);
    }
    console.log(client);
}

const showToast = (text, type = '') => {
    let color = '#212121'
    if (type === 'success' ) {
        color = '#4CAF50';
    } else if (type === 'error') {
        color = '#FF5722';
    }

    Toastify({
        text,
        duration: 3000,
        gravity: 'bottom',
        style: {
            background: color,
            borderRadius: '5px'
        },
    }).showToast();
}

const noHayMensajes = document.getElementById('noMensajes');
let client = mqtt.connect(WebSocketURLAzure, options);

console.log('client: ', client);
client.on('connect', () => {
    console.log('Mqtt conectado por WS! Exito!');
    showToast('¡Mqtt conectado exitosamente por WS!', 'success');
    // Me suscribo
    client.subscribe('testtopic', { qos: 0 }, error => {
        if(!error){
            console.log('Suscripción Exitosa!');
            showToast('¡Suscripción Exitosa!', 'success');
        } else {
            console.log('Suscripción fallida!');
            showToast('¡Suscripción fallida!', 'error');
        }
    });
});


// Recibir mensaje
client.on('message', (topic, message) => {
    console.log('Mensaje recibido bajo tópico: ', topic, ' ->', message.toString());
    showToast('¡Se ha recibido un mensaje con éxito!', 'success');
    addMessage(message.toString(), 'receivedMessage');
});

client.on('error', (error) => {
    console.log('Hubo un error al conectarse', error);
    showToast('Hubo un error al conectarse', 'error');
    // reconnectOtherClient();
});

client['stream'].on('error', (err) => {
    console.log('error de conexión', err);
    client.end()
});

client.on("reconnect", () => {
    console.log("reconnecting!")
});

const filterMessages = (messageType = "todos") => {
    //TODO: Bloquear el filter si no hay mensajes para evitar el error de que no se filtra
    const mensajesEnviados =  Array.from(document.getElementsByClassName("mensaje-enviado"));
    const mensajesRecibidos =  Array.from(document.getElementsByClassName("mensaje-recibido"));
   
    if(messageType ===  "enviados"){
        mensajesRecibidos.map(mensajeRecibido => mensajeRecibido.style.display = "none");
        mensajesEnviados.map(mensajeEnviado => mensajeEnviado.style.display = "flex");

    } else if(messageType ===  "recibidos"){
        mensajesRecibidos.map(mensajeRecibido => mensajeRecibido.style.display = "flex");
        mensajesEnviados.map(mensajeEnviado => mensajeEnviado.style.display = "none");
       
    } else {
        mensajesRecibidos.map(mensajeRecibido => mensajeRecibido.style.display = "flex");
        mensajesEnviados.map(mensajeEnviado => mensajeEnviado.style.display = "flex");
    }
}

const selectElement = document.getElementById('selectMensajes');

selectElement.addEventListener('change', (event) => {
    const resultado = document.querySelector('.resultado');
    console.log(event.target.value);
    filterMessages(event.target.value);
});

const addMessage = (message, idType) => {
    if (noHayMensajes.style.display = 'block') {
        noHayMensajes.style.display = 'none';
    }
    
    //Create an "li" node:
    const node = document.createElement("li");
    const liClass = idType === "receivedMessage" ? "mensaje-recibido": "mensaje-enviado";
    node.classList.add(liClass);


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
    // verificar primero que esté conectado
    console.log('client: ', client.connected);
    sendButton.disabled = !!textMessage;
    // addMessage(textMessage, 'sendMessage'); // Provisional -> solo par apruebas, debe borrarse
    // textArea.value = ""; // Provisional -> solo par apruebas, debe borrarse
   
    if(client.connected) {
        // Enviar mensaje
        client.publish('salida', textMessage, error => {

            if(error) {
                showToast('¡Su mensaje no pudo ser enviado!', 'error');
                console.log(error);
            } else {
                console.log('Mensaje enviado!!!');
                showToast('¡Su mensaje fue enviado con éxito!', 'success');
                addMessage(textMessage, 'sendMessage');
                textArea.value = "";
            }   
        });
    } else {
        showToast('El cliente no está conectado');
    }
}

