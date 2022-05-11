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