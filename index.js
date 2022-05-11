// An mqtt variable will be initialized globally 
// https://www.emqx.com/en/blog/mqtt-js-tutorial

// Azure: http://20.127.83.110:18083 -> tools -> websocket
// user:admin
// pass: public
// import { filterMessages } from './messagesHelper.js';

console.log(mqtt)

let numberReconnecting = 0;

// Websocket  connect url
const WebSocketURLAzure = "ws://20.127.83.110:8093/mqtt";
const WebSocketURLAmazon = "ws://54.163.248.88:8093/mqtt";
const options = {
    connectTimeout: 4000,
    clientId: 'mqttjs_40c2ffb357',
    keepalive: 60,
    clean: true,
}

const client = mqtt.connect(WebSocketURLAzure, options);

console.log('client: ', client);
// Conectar 
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
    // Si el numñero de reconexiones pasa a ser mayor que 4, desconectar el cliente 
    // TODO: Hacer lógica aquí de conectarse con el otro servidor
    // if (numberReconnecting === 4) {
        // client.end();
    //}
});

// Cuando el cliente está desconectado:
client.on('close', function () {
    console.log('Disconnected');
    showToast('Disconnected');
    if (numberReconnecting === 4) {
        client.end();
        // TODO: Hacer lógica aquí de conectarse con el otro servidor
        // console.log(client);
    }
});

client.on('error', (error) => {
    console.log('Hubo un error al conectarse', error);
    showToast('Hubo un error al conectarse', 'error');
    // reconnectOtherClient();
});

