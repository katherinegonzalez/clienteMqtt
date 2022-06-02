// An mqtt variable will be initialized globally 
// https://www.emqx.com/en/blog/mqtt-js-tutorial

// Azure: http://20.127.83.110:18083 -> tools -> websocket
// user:admin
// pass: public

console.log(mqtt)

let numberReconnecting = 0;
let clientBackup;

// Amazon: http://52.72.239.90:18083/

// Websocket  connect url
const WebSocketURLAzure = "ws://20.127.83.110:8093/mqtt"; // "wss://20.127.83.110:8094/mqtt"; 
const WebSocketURLBackup = "ws://52.72.239.90:8093/mqtt"//"ws://20.25.7.126:8093/mqtt"; // "wss://20.25.7.126:8094/mqtt";
const options = {
    connectTimeout: 4000,
    clientId: 'mqttjs_40c2ffb357',
    keepalive: 60,
    clean: true,
}

const client = mqtt.connect(WebSocketURLAzure, options);

console.log('client: ', client);
// Conectar con servidor principal
client.on('connect', () => {
    console.log('Mqtt conectado por WS! Exito!');
    showToast('¡Mqtt conectado exitosamente por WS!', 'success');
    // Me suscribo a los tópicos
    client.subscribe('Bodega/humedad', { qos: 0 }, error => {
        if(!error){
            console.log('Suscripción Exitosa tópico humedad!');
            showToast('¡Suscripción Exitosa tópico humedad!', 'success');
        } else {
            console.log('Suscripción fallida tópico humedad!');
            showToast('¡Suscripción fallida tópico humedad!', 'error');
        }
    });

    client.subscribe('Bodega/temperatura', { qos: 0 }, error => {
        if(!error){
            console.log('Suscripción Exitosa tópico temperatura!');
            showToast('¡Suscripción Exitosa tópico temperatura!', 'success');
        } else {
            console.log('Suscripción fallida tópico temperatura!');
            showToast('¡Suscripción fallida tópico temperatura!', 'error');
        }
    });
});

// Recibir mensaje
client.on('message', (topic, message) => {
    console.log('Mensaje recibido bajo tópico: ', topic, ' ->', message.toString());
    showToast('¡Se ha recibido un mensaje con éxito!', 'success');
    addMessage(message.toString(), 'receivedMessage');
});

client.on("reconnect", () => {
    numberReconnecting ++;
    if(numberReconnecting === 1 ) { // para que no se muestre a cada rato el toast
        showToast('Reconectando con el servidor...');
        console.log("reconnecting!", numberReconnecting);
    }
});

// Cuando el cliente está desconectado:
client.on('close', function () {
    if(numberReconnecting === 0 ) { // para que no se muestre a cada rato el toast
        showToast('El servidor está desconectado');
        console.log('El servidor está desconectado');
    }
    // Si el número de reconexiones pasa a ser mayor que 3, desconectar el cliente 
    if (numberReconnecting === 2) {
        client.end();
        showToast('Número de intentos de reconexión excedido. Conectando Servidor 2...');
        connectBackupServer();
    }
});

client.on('error', (error) => {
    client.end();
    console.log('Hubo un error al conectarse', error);
    showToast('Hubo un error al conectarse', 'error');
    connectBackupServer();
});


