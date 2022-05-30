// An mqtt variable will be initialized globally 
// https://www.emqx.com/en/blog/mqtt-js-tutorial

// Azure: http://20.127.83.110:18083 -> tools -> websocket
// user:admin
// pass: public

// TODO: 
// Revisar todo el código para ver si hay algo que toca limpiar
// Subir a netlify o a github pages

console.log(mqtt)

let numberReconnecting = 0;
let clientBackup;

// Websocket  connect url
const WebSocketURLAzure = "ws://20.127.83.110:8093/mqtt";
const WebSocketURLBackup = "ws://20.25.7.126:8093/mqtt";
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

client.on("reconnect", () => {
    numberReconnecting ++;
    console.log("reconnecting!", numberReconnecting);
    showToast('Reconectando con el servidor...');
});

// Cuando el cliente está desconectado:
client.on('close', function () {
    console.log('El servidor está desconectado');
    if(numberReconnecting === 0 ) { // para que no se muestre a cada rato el toast
        showToast('El servidor está desconectado');
    }
    // Si el número de reconexiones pasa a ser mayor que 3, desconectar el cliente 
    if (numberReconnecting === 3) {
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


