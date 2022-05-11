const noHayMensajes = document.getElementById('noMensajes');

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

const sendMessage = () => {    
    // verificar primero que esté conectado
    console.log('client: ', client.connected);
    sendButton.disabled = !!textMessage; 
    // TODO: Poner estilo al botón cuando está deshabilitado, del color y del cursor
    addMessage(textMessage, 'sendMessage'); // Provisional -> solo par apruebas, debe borrarse
    textArea.value = ""; // Provisional -> solo par apruebas, debe borrarse
   
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

let textMessage;
const selectElement = document.getElementById('selectMensajes');
const sendButton = document.getElementById("btnEnviar");
const textArea = document.getElementById("sMessage");

sendButton.disabled = true;

// Detectar cuando se escriba para saber si hay texto en el campo, para habilitar el botón
textArea.onkeyup = function() {
    textMessage =  textArea.value;
    if(textMessage) {
        sendButton.disabled = false;
    }  
};

// Controlar el filtro
selectElement.addEventListener('change', (event) => {
    console.log(event.target.value);
    filterMessages(event.target.value);
});


