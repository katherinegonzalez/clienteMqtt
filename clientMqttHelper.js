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

// -------- Servidor 2 -----------

const connectBackupServer = () => {
    console.log('Entra a conectar con el segundo servidor');
    let numberReconnectingBackup = 0;
    clientBackup = mqtt.connect(WebSocketURLAmazon, options);
    console.log('clientBackup: ', clientBackup);

    // Conectar 
    clientBackup.on('connect', () => {
        console.log('Mqtt con server backup conectado por WS! Exito!');
        showToast('¡Mqtt con server backup conectado exitosamente por WS!', 'success');
        // Me suscribo
        clientBackup.subscribe('testtopic', { qos: 0 }, error => {
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
    clientBackup.on('message', (topic, message) => {
        console.log('Mensaje recibido bajo tópico: ', topic, ' ->', message.toString());
        showToast('¡Se ha recibido un mensaje con éxito!', 'success');
        addMessage(message.toString(), 'receivedMessage');
    });

    clientBackup.on("reconnect", () => {
        numberReconnectingBackup ++;
        console.log("reconnecting!", numberReconnectingBackup);
        showToast('Reconectando con el servidor 2...');
        // Si el numñero de reconexiones pasa a ser mayor que 4, desconectar el cliente 
        // TODO: Hacer lógica aquí de conectarse con el otro servidor
        // if (numberReconnecting === 4) {
            // client.end();
        //}
    });

    // Cuando el cliente está desconectado:
    clientBackup.on('close', function () {
        console.log('Servidor 2 desconectado');
        showToast('Servidor 2 desconectado');
        if (numberReconnectingBackup === 3) {
            clientBackup.end();
            // ¿ se ued edesconectar o limpiar el mqtt?
            // TODO: Hacer lógica aquí de conectarse con el otro servidor
            // console.log(client);
        }
    });

    clientBackup.on('error', (error) => {
        console.log('Hubo un error al conectarse a servidor 2', error);
        showToast('Hubo un error al conectarse a servidor 2', 'error');
        // reconnectOtherClient();
    });
}

