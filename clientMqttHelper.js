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
        showToast('Reconectando con el servidor 2...');
        numberReconnectingBackup++;
    });

    // Cuando el cliente está desconectado:
    clientBackup.on('close', function () {
        if(numberReconnectingBackup === 0 ) { // para que no se muestre a cada rato el toast
            console.log('Servidor 2 desconectado');
            showToast('Servidor 2 desconectado');
        }
        
        if(numberReconnectingBackup === 3){
            clientBackup.end();
            showToast('No se pudo conectar con el servidor 2', 'error');
        }
    });

    clientBackup.on('error', (error) => {
        console.log('Hubo un error al conectarse al servidor 2', error);
        showToast('Hubo un error al conectarse al servidor 2', 'error');
        clientBackup.end();
    });
}

